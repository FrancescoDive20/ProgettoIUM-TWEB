const axios = require("axios");
const {response} = require("express");
const POSTGRES_SERVER = "http://localhost:8081"; // Verifica che Spring Boot sia in esecuzione su questa porta

/**
 * Cerca film in base al nome e alla data.
 * @async
 * @function searchMovies
 * @param {string} name - Nome del film da cercare
 * @param {string} [date] - Data del film (facoltativa)
 * @returns {Promise<Object>} Dati dei film che corrispondono alla ricerca
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function searchMovies(name, date) {
    try {
        const query = {
            name,
            ...(date && { date })
        };

        console.log("Sending request with query params:", query);

        const response = await axios.get(`${POSTGRES_SERVER}/movies`, { params: query });

        return response.data;
    } catch (err) {
        console.error('Errore nella ricerca dei film:', err.message);
        throw new Error('Errore durante la ricerca dei film');
    }
}

/**
 * Recupera tutti i film dal server con paginazione.
 * @async
 * @function getAllMovies
 * @param {number} [limit=50] - Limite massimo di film da recuperare
 * @returns {Promise<Object[]>} Lista di film
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getAllMovies(limit = 50) {
    let page = 0;
    let allMovies = [];

    try {
        while (true) {
            const response = await axios.get(`${POSTGRES_SERVER}/movies`, { params: { page } });

            const movies = response.data?.content || [];
            allMovies = allMovies.concat(movies);

            const totalPages = response.data?.totalPages ?? 1;

            if (page >= totalPages - 1 || allMovies.length >= limit) break;

            page++;
        }

        return allMovies;
    } catch (error) {
        console.error("Errore durante la richiesta a Spring Boot:", error.message);
        return [];
    }
}

/**
 * Recupera un film per ID.
 * @async
 * @function getMovieById
 * @param {string} id - ID del film da recuperare
 * @returns {Promise<Object>} Dati del film con l'ID specificato
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getMovieById(id) {
    const response = await axios.get(`${POSTGRES_SERVER}/movies/${id}`);
    return response.data;
}

/**
 * Recupera un film con i dettagli tramite ID.
 * @async
 * @function getMovieWithDetails
 * @param {string} id - ID del film da recuperare con dettagli
 * @returns {Promise<Object>} Dati completi del film con l'ID specificato
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getMovieWithDetails(id) {
    const response = await axios.get(`${POSTGRES_SERVER}/movies/${id}/details`);
    return response.data;
}


/**
 * Cerca attori in base al nome e al ruolo.
 * @async
 * @function searchActors
 * @param {string} name - Nome dell'attore da cercare
 * @param {string} [role] - Ruolo dell'attore (facoltativo)
 * @returns {Promise<Object>} Dati degli attori che corrispondono alla ricerca
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function searchActors(name, role) {
    try {
        const response = await axios.get(`${POSTGRES_SERVER}/actors`, { params: { name, role } });
        return response.data;
    } catch (err) {
        console.error('Errore nella ricerca degli attori:', err.message);
        throw new Error('Errore durante la ricerca degli attori');
    }
}

/**
 * Recupera gli attori di un film tramite ID.
 * @async
 * @function getActorsByMovieId
 * @param {string} id - ID del film
 * @returns {Promise<Object[]>} Lista di attori associati al film
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getActorsByMovieId(id) {
    const response = await axios.get(`${POSTGRES_SERVER}/actors/movies/${id}`);
    return response.data;
}

/**
 * Recupera una lista di paesi con paginazione.
 * @async
 * @function getAllCountries
 * @param {number} page - Numero della pagina
 * @param {number} size - Numero di paesi per pagina
 * @returns {Promise<Object[]>} Lista di paesi
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getAllCountries(page, size) {
    try {
        const response = await axios.get(`${POSTGRES_SERVER}/countries`, { params: { page, size } });
        return response.data;
    } catch (err) {
        console.error('Errore nella ricerca dei paesi:', err.message);
        throw new Error('Errore durante la ricerca dei paesi');
    }
}

/**
 * Recupera il paese di un film tramite ID.
 * @async
 * @function getCountryByMovieId
 * @param {string} id - ID del film
 * @returns {Promise<Object>} Dati del paese associato al film
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getCountryByMovieId(id) {
    const response = await axios.get(`${POSTGRES_SERVER}/countries/movies/${id}`);
    return response.data;
}

/**
 * Cerca crew in base al nome e al ruolo.
 * @async
 * @function searchCrew
 * @param {string} name - Nome del membro della crew da cercare
 * @param {string} [role] - Ruolo del membro della crew (facoltativo)
 * @returns {Promise<Object>} Dati della crew che corrispondono alla ricerca
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function searchCrew(name, role) {
    try {
        const response = await axios.get(`${POSTGRES_SERVER}/crew`, { params: { name, role } });
        return response.data;
    } catch (err) {
        console.error('Errore nella ricerca della crew:', err.message);
        throw new Error('Errore durante la ricerca della crew');
    }
}

/**
 * Recupera la crew di un film tramite ID.
 * @async
 * @function getCrewByMovieId
 * @param {string} id - ID del film
 * @returns {Promise<Object[]>} Lista della crew associata al film
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getCrewByMovieId(id) {
    const response = await axios.get(`${POSTGRES_SERVER}/crew/movies/${id}`);
    return response.data;
}

/**
 * Ottieni tutti i generi di film.
 * @async
 * @function getAllGenres
 * @returns {Promise<Object[]>} Lista di generi di film
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getAllGenres() {
    const response = await axios.get(`${POSTGRES_SERVER}/genres`);
    return response.data;
}

/**
 * Recupera i generi di un film tramite ID.
 * @async
 * @function getGenresByMovieId
 * @param {string} id - ID del film
 * @returns {Promise<Object[]>} Lista dei generi associati al film
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getGenresByMovieId(id) {
    const response = await axios.get(`${POSTGRES_SERVER}/genres/movies/${id}`);
    return response.data;
}

/**
 * Ottieni tutte le lingue di film.
 * @async
 * @function getAllLanguages
 * @returns {Promise<Object[]>} Lista delle lingue di film
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getAllLanguages() {
    const response = await axios.get(`${POSTGRES_SERVER}/languages`);
    return response.data;
}

/**
 * Recupera le lingue di un film tramite ID.
 * @async
 * @function getLanguagesByMovieId
 * @param {string} id - ID del film
 * @returns {Promise<Object[]>} Lista delle lingue associate al film
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getLanguagesByMovieId(id) {
    const response = await axios.get(`${POSTGRES_SERVER}/languages/movies/${id}`);
    return response.data;
}

/**
 * Cerca premi in base all'anno del film, alla categoria e se il film ha vinto.
 * @async
 * @function searchAwards
 * @param {number} yearFilm - Anno del film
 * @param {string} category - Categoria del premio
 * @param {boolean} winner - Se il film ha vinto il premio
 * @returns {Promise<Object>} Dati dei premi
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function searchAwards(yearFilm, category, winner) {
    try {
        const response = await axios.get(`${POSTGRES_SERVER}/awards`, { params: { yearFilm, category, winner } });
        return response.data;
    } catch (err) {
        console.error('Errore nella ricerca dei premi:', err.message);
        throw new Error('Errore durante la ricerca dei premi');
    }
}

/**
 * Cerca premi per un film in base al titolo e all'anno.
 * @async
 * @function getAwardsByMovie
 * @param {string} film - Titolo del film
 * @param {number} yearFilm - Anno del film
 * @returns {Promise<Object>} Dati dei premi per il film specificato
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getAwardsByMovie(film, yearFilm) {
    try {
        if (!film || !yearFilm) {
            throw new Error("Il titolo del film e l'anno sono obbligatori per la ricerca dei premi.");
        }

        const encodedFilm = encodeURIComponent(film);
        const adjustedYear = parseInt(yearFilm);

        const response = await axios.get(`${POSTGRES_SERVER}/awards/movies/${encodedFilm}/${adjustedYear}`);

        const allAwards = response.data;

        // Filtro dei premi vinti
        const oscarsWon = Array.isArray(allAwards)
            ? allAwards.filter(a =>
                a.winner === true || a.winner === 1 || a.winner === "true"
            )
            : [];

        return oscarsWon;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            // Premi non trovati: ritorno array vuoto senza rilanciare errore
            console.warn('Premi non trovati per il film:', film, yearFilm);
            return [];
        }

        console.error('Errore nella ricerca dei premi:', err.message);
        throw new Error('Errore durante la ricerca dei premi');
    }
}


/**
 * Ottieni tutti gli studios di film.
 * @async
 * @function getAllStudios
 * @returns {Promise<Object[]>} Lista degli studios di film
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getAllStudios() {
    const response = await axios.get(`${POSTGRES_SERVER}/studios`);
    return response.data;
}

/**
 * Recupera gli studios di un film tramite ID.
 * @async
 * @function getStudiosByMovieId
 * @param {string} id - ID del film
 * @returns {Promise<Object[]>} Lista degli studios associati al film
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getStudiosByMovieId(id) {
    const response = await axios.get(`${POSTGRES_SERVER}/studios/movies/${id}`);
    return response.data;
}

/**
 * Ottieni tutti i temi di film.
 * @async
 * @function getAllThemes
 * @returns {Promise<Object[]>} Lista dei temi di film
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getAllThemes() {
    const response = await axios.get(`${POSTGRES_SERVER}/themes`);
    return response.data;
}

/**
 * Recupera i temi di un film tramite ID.
 * @async
 * @function getThemesByMovieId
 * @param {string} id - ID del film
 * @returns {Promise<Object[]>} Lista dei temi associati al film
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getThemesByMovieId(id) {
    const response = await axios.get(`${POSTGRES_SERVER}/themes/movies/${id}`);
    return response.data;
}

/**
 * Recupera la relazione tra durata e valutazione dei film.
 * @async
 * @function getRuntimeVsRating
 * @param {string} [id] - ID del film (opzionale)
 * @returns {Promise<any>}
 * @throws {Error} Se si verifica un errore nella richiesta HTTP
 */
async function getRuntimeVsRating() {
    const response = await axios.get(`${POSTGRES_SERVER}/movies/runtime-rating`);
    return response.data;
}

async function getTopActors() {
    const response = await axios.get(`${POSTGRES_SERVER}/actors/top-actors`);
    return response.data;
}

async function getLanguagesOverTime() {
    const response = await axios.get(`${POSTGRES_SERVER}/languages/languages-over-time`);
    return response.data;
}

async function getGenresOverTime() {
    const response = await axios.get(`${POSTGRES_SERVER}/genres/genres-over-time`);
    return response.data;
}

async function getThemesOverTime() {
    const response = await axios.get(`${POSTGRES_SERVER}/themes/themes-over-time`);
    return response.data;
}

async function getFilmography(name) {
    const response = await axios.get(`${POSTGRES_SERVER}/actors/filmography/${encodeURIComponent(name)}`);
    return response.data;
}

async function getActorDetails(name) {
    const response = await axios.get(`${POSTGRES_SERVER}/actors/details/${encodeURIComponent(name)}`);
    const actorData = response.data;

    const filmography = actorData.filmography || [];
    const ids = filmography.map(film => film[0]);
    console.log("ids FILMOGRAFIA:", ids);

    if (ids.length === 0) {
        actorData.releaseCountries = [];
        return actorData;
    }

    let releases = [];
    try {
        const releasesResponse = await axios.post(`http://localhost:8082/releases/by-ids`, {
            ids: ids
        });
        releases = releasesResponse.data;
        console.log("RELEASES RICEVUTE:", releases); // 🔎 verifica della risposta
    } catch (err) {
        console.error("Errore fetch releases:", err);
        actorData.releaseCountries = [];
        return actorData;
    }


    const countryCount = {};
    for (const release of releases) {
        const country = release.country;
        if (!country) continue;
        countryCount[country] = (countryCount[country] || 0) + 1;
    }

    const sorted = Object.entries(countryCount)
        .sort((a, b) => b[1] - a[1])
        .map(([country, count]) => ({ country, count }));

    actorData.releaseCountries = sorted;

    return actorData;
}

async function getAwardsDetails(name){
    const response = await axios.get(`${POSTGRES_SERVER}/awards/oscars/${encodeURIComponent(name)}`);
    return response.data;
}



module.exports = { searchMovies, getAllMovies, getMovieById, getMovieWithDetails, searchActors,
    getActorsByMovieId, getAllCountries, getCountryByMovieId, searchCrew, getCrewByMovieId, getAllGenres,
    getGenresByMovieId, getAllLanguages, getLanguagesByMovieId, getAwardsByMovie, getAllStudios,
    getStudiosByMovieId, getAllThemes, getThemesByMovieId, getRuntimeVsRating, getTopActors, getLanguagesOverTime,
    getGenresOverTime, getThemesOverTime, getFilmography, getActorDetails, getAwardsDetails};
