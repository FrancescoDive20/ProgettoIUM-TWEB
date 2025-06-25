const axios = window.axios;

const api = axios.create({
    baseURL: "http://localhost:3000", // Server centrale
});


/**
 * Recupera i dati completi di un film, inclusi attori, crew, generi, paesi, lingue, studi, temi, poster e rilasci.
 * @param title
 * @param year
 * @returns {Promise<{date: *, studios: (*[]|*|*[]), languages: (*|*[]), rating, description: (string|AllowSharedBufferSource|string|*), countries: (*[]|*[]), minute: any, crew: (*[]|*|*[]), oscars: (*|*[]), releases: (any|*[]), actors: (*[]|*|*[]), themes: (*[]|any[]|*|*[]), reviews: *[], genres: (*[]|*|*[]), name, tagline, id, poster: null}|null>}
 */
export async function getMovieFullData(title, year = "") {
    try {
        let urlPostgres = `http://localhost:3000/postgres/film?name=${encodeURIComponent(title)}&page=0&size=10`;
        if (year && year.trim() !== "") {
            urlPostgres += `&date=${encodeURIComponent(year)}`;
        }

        const response = await fetch(urlPostgres);
        if (!response.ok) throw new Error("Errore nella fetch del film");

        const data = await response.json();
        console.log("Risposta completa dal backend:", data);

        if (!data || Object.keys(data).length === 0) throw new Error("Film non trovato");
        const movie = data; // prendiamo il primo matching
        const movieId = movie.id;

        const posterResponse = await fetch(`http://localhost:3000/mongodb/posters/${movieId}`);
        const posterData = posterResponse.ok ? await posterResponse.json() : { link: null };

        const releasesResponse = await fetch(`http://localhost:3000/mongodb/releases/${movieId}`);
        const releasesData = releasesResponse.ok ? await releasesResponse.json() : [];

        const awards = data.awards || [];

        let reviewsData = [];
        try {
            const reviewsResponse = await fetch(`http://localhost:3000/mongodb/reviews/${encodeURIComponent(movie.name)}`);
            if (reviewsResponse.ok) {
                reviewsData = await reviewsResponse.json();
            } else if (reviewsResponse.status === 404) {
                // Non ci sono recensioni, mantieni reviewsData = []
                console.warn("Nessuna recensione trovata per", movie.name);
            } else {
                throw new Error(`Errore nel recupero recensioni: ${reviewsResponse.status}`);
            }
        } catch (err) {
            console.error(err);
            reviewsData = [];
        }

        return {
            id: movie.id,
            name: movie.name,
            date: movie.date,
            description: movie.description,
            tagline: movie.tagline,
            minute: movie.minute,
            rating: movie.rating,

            actors: movie.actors || [],
            crew: movie.crew || [],
            genres: movie.genres || [],
            countries: movie.countries || [],
            languages: movie.languages || [],
            studios: movie.studios || [],
            themes: movie.themes || [],
            oscars: awards,

            poster: posterData.link,
            releases: releasesData,
            reviews: reviewsData
        };

    } catch (error) {
        console.error("Errore in getMovieFullData:", error);
        return null;
    }
}


export const getAllMovies = () => api.get("postgres/movies");
export const getMovieById = (id) => api.get(`postgres/movies/${id}`);
export const getMovieDetails = (id) => api.get(`postgres/movies/${id}/details`);

export const searchActors = (name = "", role = "") =>
    api.get("/actors", { params: { name, role } });
export const getActorsByMovieId = (id) => api.get(`postgres/actors/movie/${id}`);

/**
 * Recupera i dati completi di un attore, inclusi filmografia, paesi di rilascio, media rating e premi Oscar.
 * @param name
 * @returns {Promise<{releaseCountries: *[], averageRating: (number|number), name, filmography: (*[]|*[]), oscars: (any|[])}>}
 */
export async function getActorFullData(name) {
    try {
        const resDetails = await fetch(`http://localhost:3000/postgres/actors/details/${encodeURIComponent(name)}`);
        if (!resDetails.ok) throw new Error('Errore nel recupero dettagli attore');
        const details = await resDetails.json();

        const filmography = details.filmography || [];

        console.log("Filmografia completa:", filmography);

        const ratings = filmography.map(film => film[5]);
        const averageRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0;

        let releaseCountries = [];
        if (filmography.length > 0) {
            const releases = await getReleaseCountries(filmography);

            const countryCount = {};
            for (const r of releases) {
                if (!r.country) continue;
                countryCount[r.country] = (countryCount[r.country] || 0) + 1;
            }
            releaseCountries = Object.entries(countryCount)
                .sort((a, b) => b[1] - a[1])
                .map(([country, count]) => ({ country, count }));
        }

        const oscars = await getActorOscars(details.name);

        return {
            name: details.name,
            averageRating,
            filmography,
            releaseCountries,
            oscars
        };

    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Recupera i premi Oscar vinti da un attore specifico.
 * @param name
 * @returns {Promise<any|*[]>}
 */
export async function getActorOscars(name) {
    try {
        const res = await fetch(`http://localhost:3000/postgres/awards/oscars/${encodeURIComponent(name)}`);
        return await res.json();
    } catch (error) {
        console.warn("Nessun premio Oscar trovato o errore:", error);
        return [];
    }
}

/**
 * Recupera i paesi di rilascio per una lista di film.
 * @param filmography
 * @returns {Promise<any>}
 */
export async function getReleaseCountries(filmography) {
    try {
        const ids = filmography.map(film => film[0]); // [id, titolo, ...] → prendiamo solo i titoli
        const res = await fetch(`http://localhost:3000/mongodb/releases/by-ids`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
        });
        if (!res.ok) throw new Error('Errore nel recupero paesi uscita');
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAllCountries = (page = 1, size = 10) =>
    api.get("/countries", { params: { page, size } });
export const getCountryByMovieId = (id) => api.get(`postgres/countries/movie/${id}`);

export const searchCrew = (name = "", role = "") =>
    api.get("/crew", { params: { name, role } });
export const getCrewByMovieId = (id) => api.get(`postgres/crew/movie/${id}`);

export const getAllGenres = () => api.get("postgres/genre");
export const getGenresByMovieId = (id) => api.get(`postgres/genres/movie/${id}`);

export const getAllLanguages = () => api.get("postgres/languages");
export const getLanguagesByMovieId = (id) => api.get(`postgres/languages/movie/${id}`);

export const searchAwards = (yearFilm = "", category = "", winner = "") =>
    api.get("postgres/awards", { params: { yearFilm, category, winner } });
export const getAwardsByMovie = (film, yearFilm) =>
    api.get(`postgres/awards/movies/${film}/${yearFilm}`);

export const getAllStudios = () => api.get("postgres/studios");
export const getStudiosByMovieId = (id) => api.get(`postgres/studios/movie/${id}`);

export const getAllThemes = () => api.get("postgres/themes");
export const getThemesByMovieId = (id) => api.get(`postgres/themes/movie/${id}`);

export const getAllPosters = () => api.get("mongodb/posters");
export const getPostersByMovieId = (id) => api.get(`mongodb/posters/${id}`);

export const getAllReleases = () => api.get("mongodb/releases");
export const getReleasesByMovieId = (id) => api.get(`mongodb/releases/${id}`);


/**
 * Ottiene i dati di runtime e rating dei film.
 * @returns {Promise<any>}
 * @description Questa funzione recupera i dati di runtime e rating dei film dal server centrale.
 */
export async function getRuntimeVsRating() {
    try {
        const response = await fetch(`http://localhost:3000/postgres/movies/runtime-rating`); // server centrale
        if (!response.ok) throw new Error("Errore nel recupero dei dati");
        return await response.json();
    } catch (error) {
        console.error("Errore nella chiamata API:", error);
        throw error;
    }
}

/**
 * Ottiene gli attori più popolari.
 * @function getTopActors
 * @returns {Promise<any>}
 */
export async function getTopActors() {
    try {
        const response = await fetch(`http://localhost:3000/postgres/actors/top-actors`); // server centrale
        if (!response.ok) throw new Error("Errore nel recupero dei dati");
        return await response.json();
    } catch (error) {
        console.error("Errore nella chiamata API:", error);
        throw error;
    }
}

/**
 * Ottiene le lingue più popolari nel tempo.
 * @function getLanguagesOverTime
 * @description Questa funzione recupera le lingue più popolari nel tempo dal server centrale.
 * @returns {Promise<any>}
 */
export async function getLanguagesOverTime() {
    try {
        const response = await fetch(`http://localhost:3000/postgres/languages/languages-over-time`); // server centrale
        if (!response.ok) throw new Error("Errore nel recupero dei dati");
        return await response.json();
    } catch (error) {
        console.error("Errore nella chiamata API:", error);
        throw error;
    }
}

/**
 * Ottiene i generi più popolari nel tempo.
 * @returns {Promise<any>}
 */
export async function getGenresOverTime() {
    try {
        const response = await fetch(`http://localhost:3000/postgres/genres/genres-over-time`); // server centrale
        if (!response.ok) throw new Error("Errore nel recupero dei dati");
        return await response.json();
    } catch (error) {
        console.error("Errore nella chiamata API:", error);
        throw error;
    }
}

/**
 * Ottiene i temi più popolari nel tempo.
 * @returns {Promise<any>}
 */
export async function getThemesOverTime() {
    try {
        const response = await fetch(`http://localhost:3000/postgres/themes/themes-over-time`); // server centrale
        if (!response.ok) throw new Error("Errore nel recupero dei dati");
        return await response.json();
    } catch (error) {
        console.error("Errore nella chiamata API:", error);
        throw error;
    }
}


/**
 * Ottiene tutte le recensioni con paginazione.
 * @param {number} page - Numero della pagina (default: 1)
 * @param {number} limit - Numero di risultati per pagina (default: 10)
 * @returns {Promise} Promise con i dati delle recensioni
 */
export function getReviews(page = 1, limit = 10) {
    return api.get("/reviews", { params: { page, limit } })
        .then(response => response.data);
}

/**
 * Ottiene le recensioni di un film specifico, passando il movieId di PostgreSQL.
 * @param {number|string} movieId - L'ID del film in PostgreSQL
 * @param {number} page - Numero della pagina (default: 1)
 * @param {number} limit - Numero di risultati per pagina (default: 10)
 * @returns {Promise} Promise con le recensioni del film
 */
export function getReviewsByMovie(movieId, page = 1, limit = 10) {
    return api.get(`/movies/${movieId}/reviews`, { params: { page, limit } })
        .then(response => response.data);
}

/**
 * Crea una nuova recensione.
 * @param {object} review - Oggetto contenente i dati della recensione
 * @returns {Promise} Promise con i dati della nuova recensione creata
 */
export function createReview(review) {
    return api.post("/reviews", review)
        .then(response => response.data);
}

/**
 * Effettua una ricerca avanzata delle recensioni.
 * @param {object} filters - Oggetto contenente i filtri di ricerca (movieTitle, criticName, etc.)
 * @returns {Promise} Promise con i risultati della ricerca
 */
export function searchReviews(filters) {
    return api.get("/reviews/search", { params: filters })
        .then(response => response.data);
}

/**
 * Ottiene la media dei punteggi per ciascun film.
 * @returns {Promise} Promise con i dati della media dei punteggi
 */
export function getAverageRatings() {
    return api.get("/reviews/average-rating")
        .then(response => response.data);
}


export default api;
