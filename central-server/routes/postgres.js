/**
 * Gestisce le rotte per la ricerca e la gestione dei film, attori, crew, premi, generi, lingue, paesi, studi e temi.
 * Utilizza i servizi di PostgreSQL per ottenere i dati.
 * @module routes/postgres
 */
const express = require("express");
const router = express.Router();
const {
    searchMovies,
    getMovieById,
    getMovieWithDetails,
    searchActors,
    getActorsByMovieId,
    getAllCountries,
    getCountryByMovieId,
    searchCrew,
    getCrewByMovieId,
    getAllGenres,
    getGenresByMovieId,
    getAllLanguages,
    getLanguagesByMovieId,
    getAwardsByMovie,
    getAllStudios,
    getStudiosByMovieId,
    getAllThemes,
    getThemesByMovieId,
    getRuntimeVsRating,
    getTopActors,
    getLanguagesOverTime,
    getGenresOverTime,
    getThemesOverTime,
    getFilmography,
    getActorDetails,
    getAwardsDetails
} = require("../services/postgres");

/**
 * Endpoint per cercare film nel database in base al nome e alla data.
 * @route GET /film
 * @param {string} name.query - Nome del film
 * @param {string} [date.query] - Anno del film (facoltativo)
 * @returns {Array} Array di film corrispondenti alla ricerca
 * @throws {400} Se il parametro 'name' non è presente
 * @throws {500} Se si verifica un errore durante la ricerca dei film
 */
router.get('/film', async (req, res) => {
    const { name, date } = req.query;

    if (!name || !date) {
        return res.status(400).json({ error: "Parametri 'name' e 'date' obbligatori" });
    }

    try {
        const movieList = await searchMovies(name, date);
        console.log("Risultato da searchMovies:", movieList);
        if (!movieList || !Array.isArray(movieList.content) || movieList.content.length === 0) {
            console.error("Nessun risultato valido da searchMovies:", movieList);
            return res.status(404).json({ error: "Film non trovato" });
        }

        const movie = movieList.content[0]; // Prendi il primo film trovato
        const movieId = movie.id;
        const movieTitle = movie.name;
        const movieYear = movie.date;
        console.log("Recupero dettagli film:", movie);


        const { page = 0, limit = 10 } = req.query;

        // Recupera tutti i dettagli associati in parallelo
        const [
            actors,
            crew,
            countries,
            genres,
            languages,
            studios,
            themes,
            awards
        ] = await Promise.all([
            getActorsByMovieId(movieId),
            getCrewByMovieId(movieId),
            getCountryByMovieId(movieId),
            getGenresByMovieId(movieId),
            getLanguagesByMovieId(movieId),
            getStudiosByMovieId(movieId),
            getThemesByMovieId(movieId),
            getAwardsByMovie(movieTitle, movieYear)
        ]);

        console.log("Awards recuperati:", awards);

        res.json({
            ...movie,
            actors,
            crew,
            countries,
            genres,
            languages,
            studios,
            themes,
            awards
        });
    } catch (err) {
        console.error("Errore durante il recupero dettagliato del film:", err);
        res.status(500).json({ error: "Errore interno durante il recupero del film" });
    }
});


/**
 * Ottieni tutti i film.
 * @route GET /movies
 * @returns {Object} Oggetto contenente la lista dei film
 * @throws {500} Se si verifica un errore durante il recupero dei film
 */
router.get("/movie", async (req, res, next) => {
    try {
        const { name = "", date = "", page = 0, size = 1000 } = req.query;

        const movies = await searchMovies(name, date, parseInt(page), parseInt(size));

        res.json({ content: movies });
    } catch (error) {
        console.error("Errore durante la ricerca dei film:", error.message);
        next(error);
    }
});


/**
 * Ottieni un film per ID.
 * @route GET /movies/:id
 * @param {string} id.params - ID del film
 * @returns {Object} Dati del film
 * @throws {500} Se si verifica un errore durante il recupero del film
 */
router.get("/movies/:id", async (req, res, next) => {
    try {
        const movie = await getMovieById(req.params.id);
        res.json(movie);
    } catch (error) {
        next(error);
    }
});


/**
 * Ottieni un film con dettagli aggiuntivi per ID.
 * @route GET /movies/:id/details
 * @param {string} id.params - ID del film
 * @returns {Object} Dati del film con dettagli aggiuntivi
 * @throws {500} Se si verifica un errore durante il recupero del film
 */
router.get("/movies/:id/details", async (req, res, next) => {
    try {
        const movie = await getMovieWithDetails(req.params.id);
        res.json(movie);
    } catch (error) {
        next(error);
    }
});


/**
 * Crea un nuovo film nel database.
 * @route POST /movies
 * @param {Object} body - Dati del film da creare
 * @returns {Object} Film creato
 * @throws {500} Se si verifica un errore durante la creazione del film
 */
router.post("/movies", async (req, res, next) => {
    try {
        const newMovie = await createMovie(req.body);
        res.status(201).json(newMovie);
    } catch (error) {
        next(error);
    }
});


/**
 * Endpoint per cercare attori nel database.
 * @route GET /actors
 * @param {string} [name.query] - Nome dell'attore (facoltativo)
 * @param {string} [role.query] - Ruolo dell'attore (facoltativo)
 * @returns {Array} Array di attori corrispondenti alla ricerca
 * @throws {500} Se si verifica un errore durante la ricerca degli attori
 */
router.get('/actors', async (req, res) => {
    const { name, role } = req.query;

    try {
        const actors = await searchActors(name, role);
        res.json(actors);
    } catch (err) {
        console.error('Errore nella ricerca degli attori:', err.message);
        res.status(500).json({ error: 'Errore durante la ricerca degli attori' });
    }
});


/**
 * Ottieni gli attori di un film tramite movieId.
 * @route GET /actors/movie/:id
 * @param {string} id.params - ID del film
 * @returns {Array} Array di attori per il film specificato
 * @throws {500} Se si verifica un errore durante il recupero degli attori
 */
router.get("/actors/movie/:id", async (req, res, next) => {
    try {
        const actor = await getActorsByMovieId(req.params.id);
        res.json(actor);
    } catch (error) {
        next(error);
    }
});


/**
 * Endpoint per ottenere tutti i paesi.
 * @route GET /countries
 * @param {number} [page.query] - Numero della pagina (facoltativo)
 * @param {number} [size.query] - Numero di paesi per pagina (facoltativo)
 * @returns {Object} Oggetto contenente i paesi
 * @throws {500} Se si verifica un errore durante il recupero dei paesi
 */
router.get('/countries', async (req, res) => {
    const { page, size } = req.query;

    try {
        const countries = await getAllCountries(page, size);
        res.json(countries);  // Restituisci i dati al client
    } catch (err) {
        console.error('Errore nella ricerca dei paesi:', err.message);
        res.status(500).json({ error: 'Errore durante la ricerca dei paesi' });
    }
});


/**
 * Ottieni i paesi per un film tramite movieId.
 * @route GET /countries/movie/:id
 * @param {string} id.params - ID del film
 * @returns {Array} Array di paesi per il film specificato
 * @throws {500} Se si verifica un errore durante il recupero dei paesi
 */
router.get("/countries/:id", async (req, res, next) => {
    try {
        const country = await getCountryByMovieId(req.params.id);
        res.json(country);
    } catch (error) {
        next(error);
    }
});


/**
 * Endpoint per cercare i membri della crew nel database.
 * @route GET /crew
 * @param {string} [name.query] - Nome del membro della crew (facoltativo)
 * @param {string} [role.query] - Ruolo del membro della crew (facoltativo)
 * @returns {Array} Array di membri della crew corrispondenti alla ricerca
 * @throws {500} Se si verifica un errore durante la ricerca dei membri
 */
router.get('/crew', async (req, res) => {
    const { name, role } = req.query;

    try {
        const crew = await searchCrew(name, role);
        res.json(crew);  // Restituisci i dati al client
    } catch (err) {
        console.error('Errore nella ricerca dei membri:', err.message);
        res.status(500).json({ error: 'Errore durante la ricerca dei membri' });
    }
});


/**
 * Ottieni la crew di un film tramite movieId.
 * @route GET /crew/movie/:id
 * @param {string} id.params - ID del film
 * @returns {Array} Array di membri della crew per il film specificato
 * @throws {500} Se si verifica un errore durante il recupero della crew
 */
router.get("/crew/movie/:id", async (req, res, next) => {
    try {
        const crew = await getCrewByMovieId(req.params.id);
        res.json(crew);
    } catch (error) {
        next(error);
    }
});


/**
 * Ottieni tutti i generi di film.
 * @route GET /genre
 * @returns {Object} Oggetto contenente i generi di film
 * @throws {500} Se si verifica un errore durante il recupero dei generi
 */
router.get("/genre", async (req, res, next) => {
    try {
        const genres = await getAllGenres();
        res.json({ content: genres });
    } catch (error) {
        console.error("Errore durante il recupero dei generi:", error.message);
        next(error);
    }
});


/**
 * Ottieni i generi di un film tramite movieId.
 * @route GET /genres/movie/:id
 * @param {string} id.params - ID del film
 * @returns {Array} Array di generi per il film specificato
 * @throws {500} Se si verifica un errore durante il recupero dei generi
 */
router.get("/genres/movie/:id", async (req, res, next) => {
    try {
        const genres = await getGenresByMovieId(req.params.id);
        res.json(genres);
    } catch (error) {
        next(error);
    }
});


/**
 * Ottieni tutte le lingue di film.
 * @route GET /languages
 * @returns {Object} Oggetto contenente le lingue dei film
 * @throws {500} Se si verifica un errore durante il recupero delle lingue
 */
router.get("/languages", async (req, res, next) => {
    try {
        const languages = await getAllLanguages();
        res.json({ content: languages });
    } catch (error) {
        console.error("Errore durante il recupero delle lingue:", error.message);
        next(error);
    }
});


/**
 * Ottieni le lingue di un film tramite movieId.
 * @route GET /languages/movie/:id
 * @param {string} id.params - ID del film
 * @returns {Array} Array di lingue per il film specificato
 * @throws {500} Se si verifica un errore durante il recupero delle lingue
 */
router.get("/languages/movie/:id", async (req, res, next) => {
    try {
        const languages = await getLanguagesByMovieId(req.params.id);
        res.json(languages);
    } catch (error) {
        next(error);
    }
});


/**
 * Endpoint per cercare i premi di un film.
 * @route GET /awards/movies/:film/:yearFilm
 * @param {string} film.params - Nome del film
 * @param {string} yearFilm.params - Anno del film
 * @returns {Object} Oggetto contenente i premi del film
 * @throws {500} Se si verifica un errore durante la ricerca dei premi
 */
router.get('/awards/movies/:film/:yearFilm', async (req, res) => {
    try {
        const film = decodeURIComponent(req.params.film);
        const yearFilm = req.params.yearFilm;

        if (!film || !yearFilm) {
            return res.status(400).json({ error: "Titolo del film e anno sono obbligatori." });
        }

        const oscarsWon = await getAwardsByMovie(film, yearFilm);
        return res.json(oscarsWon);
    } catch (err) {
        console.error("Errore nella ricerca dei premi:", err.message);
        res.status(500).json({ error: "Errore durante la ricerca dei premi" });
    }
});


/**
 * Ottieni tutti gli studios di film.
 * @route GET /studios
 * @returns {Object} Oggetto contenente gli studios
 * @throws {500} Se si verifica un errore durante il recupero degli studios
 */
router.get("/studios", async (req, res, next) => {
    try {
        const studios = await getAllStudios();
        res.json({ content: studios });
    } catch (error) {
        console.error("Errore durante il recupero degli studios:", error.message);
        next(error);
    }
});


/**
 * Ottieni gli studios di un film tramite movieId.
 * @route GET /studios/movie/:id
 * @param {string} id.params - ID del film
 * @returns {Array} Array di studios per il film specificato
 * @throws {500} Se si verifica un errore durante il recupero degli studios
 */
router.get("/studios/movie/:id", async (req, res, next) => {
    try {
        const studios = await getStudiosByMovieId(req.params.id);
        res.json(studios);
    } catch (error) {
        next(error);
    }
});


/**
 * Ottieni tutti i temi di film.
 * @route GET /themes
 * @returns {Object} Oggetto contenente i temi dei film
 * @throws {500} Se si verifica un errore durante il recupero dei temi
 */
router.get("/themes", async (req, res, next) => {
    try {
        const themes = await getAllThemes();
        res.json({ content: themes });
    } catch (error) {
        console.error("Errore durante il recupero dei temi:", error.message);
        next(error);
    }
});


/**
 * Ottieni i temi di un film tramite movieId.
 * @route GET /themes/movie/:id
 * @param {string} id.params - ID del film
 * @returns {Array} Array di temi per il film specificato
 * @throws {500} Se si verifica un errore durante il recupero dei temi
 */
router.get("/themes/movie/:id", async (req, res, next) => {
    try {
        const themes = await getThemesByMovieId(req.params.id);
        res.json(themes);
    } catch (error) {
        next(error);
    }
});


/**
 * Endpoint per ottenere le statistiche sui film in base alla durata e alla valutazione.
 * @route GET /movies/stats/runtime-rating
 * @param {string} [startDate.query] - Data di inizio (facoltativo)
 * @param {string} [endDate.query] - Data di fine (facoltativo)
 * @returns {Object} Oggetto contenente le statistiche sui film
 * @throws {500} Se si verifica un errore durante il recupero delle statistiche
 */
router.get("/runtime-rating", async (req, res, next) => {
    try {
        const data = await getRuntimeVsRating();
        res.json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * Endpoint per ottenere gli attori più popolari.
 * @route GET /actors/top-actors
 * @returns {Array} Array di attori più popolari
 * @throws {500} Se si verifica un errore durante il recupero degli attori
 */
router.get("/actors/top-actors", async (req, res, next) => {
    try {
        const data = await getTopActors();
        res.json(data);
    } catch (error) {
        next(error);
    }
});


/**
 * Endpoint per ottenere le statistiche sulle lingue, generi e temi dei film nel tempo.
 * @route GET /languages/languages-over-time
 * returns {Object} Oggetto contenente le statistiche sulle lingue nel tempo
 */
router.get("/languages/languages-over-time", async (req, res, next) => {
    try {
        const data = await getLanguagesOverTime();
        res.json(data);
    } catch (error) {
        next(error);
    }
});


/**
 * Endpoint per ottenere le statistiche sui generi dei film nel tempo.
 * @route GET /genres/genres-over-time
 * returns {Object} Oggetto contenente le statistiche sui generi nel tempo
 */
router.get("/genres/genres-over-time", async (req, res, next) => {
    try {
        const data = await getGenresOverTime();
        res.json(data);
    } catch (error) {
        next(error);
    }
});


/**
 * Endpoint per ottenere le statistiche sui temi dei film nel tempo.
 * @route GET /themes/themes-over-time
 * returns {Object} Oggetto contenente le statistiche sui temi nel tempo
 */
router.get("/themes/themes-over-time", async (req, res, next) => {
    try {
        const data = await getThemesOverTime();
        res.json(data);
    } catch (error) {
        next(error);
    }
});


/**
 * Endpoint per ottenere la filmografia di un attore.
 * @route GET /actors/filmography/:name
 * @param {string} name.params - Nome dell'attore
 * @returns {Array} Array di film in cui l'attore ha recitato
 * @throws {500} Se si verifica un errore durante il recupero della filmografia
 */
router.get('/actors/filmography/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const result = await getFilmography(name);
        res.json(result);
    } catch (err) {
        console.error('Errore nella route /api/actor/filmography/:name', err.message);
        res.status(500).json({ error: 'Errore interno nel server centrale' });
    }
});


/**
 * Endpoint per ottenere i dettagli di un attore.
 * @route GET /actors/details/:name
 * @param {string} name.params - Nome dell'attore
 * @returns {Object} Oggetto contenente i dettagli dell'attore
 * @throws {400} Se il parametro 'name' non è presente
 */
router.get('/actors/details/:name', async (req, res) => {
    const { name } = req.params;

    if (!name) {
        return res.status(400).json({ error: "Parametro 'name' obbligatorio" });
    }

    try {
        const result = await getActorDetails(name);

        if (!result) {
            return res.status(404).json({ error: "Attore non trovato" });
        }

        res.json(result);
    } catch (error) {
        console.error("Errore fetching /actors/details:", error);
        res.status(500).json({ error: "Errore nel server centrale durante la chiamata al microservizio" });
    }
});


/**
 * Endpoint per ottenere i dettagli degli Oscar di un film.
 * @route GET /awards/oscars/:name
 * @param {string} name.params - Nome del film
 * @returns {Object} Oggetto contenente i dettagli degli Oscar del film
 * @throws {400} Se il parametro 'name' non è presente
 */
router.get('/awards/oscars/:name', async (req, res) => {
    const { name } = req.params;

    if (!name) {
        return res.status(400).json({ error: "Parametro 'name' obbligatorio" });
    }

    try {
        const result = await getAwardsDetails(name);
        res.json(result);
    } catch (error) {
        console.error("Errore fetching /awards/details:", error.message);
        res.status(500).json({ error: "Errore nel server centrale durante la chiamata al microservizio" });
    }
});

module.exports = router;
