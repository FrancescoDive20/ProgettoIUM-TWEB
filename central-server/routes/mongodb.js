/**
 * Gestisce le rotte per recensioni, poster e release, utilizzando MongoDB.
 * @module routes/mongodb
 */
const express = require("express");
const router = express.Router();
const {
    getReviews,
    createReview,
    searchReviews,
    getAverageRatings,
    getReleases,
    getReleaseById,
    getPosters,
    getPosterById,
    getReleasesByIds,
    getReviewsByMovieTitle
} = require("../services/mongodb");
const pool = require("../config/db");
const {getActorDetailsFromPostgres} = require("../services/postgres");

/**
 * Ottieni tutte le recensioni con paginazione.
 * @route GET /reviews
 * @param {number} page - Numero di pagina (default 1)
 * @param {number} limit - Numero di recensioni per pagina (default 10)
 * @returns {Object} Recensioni
 */
router.get("/reviews", async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const reviews = await getReviews(parseInt(page) || 1, parseInt(limit) || 10);
        res.json(reviews);
    } catch (error) {
        next(error);
    }
});


/**
 * Ottieni recensioni per un film specifico tramite il titolo.
 * @route GET /reviews/:movieTitle
 * @param {string} movieTitle - Titolo del film
 * @param {number} page - Numero di pagina (default 0)
 * @param {number} limit - Numero di recensioni per pagina (default 10)
 * @returns {Object} Recensioni del film specificato
 * @param {Object} req - Oggetto richiesta contenente i parametri della query
 * @param {Object} res - Oggetto risposta per inviare i dati al client
 * @throws {Error} Se la richiesta HTTP fallisce o se non vengono trovate recensioni
 */
router.get("/reviews/:movieTitle", async (req, res, next) => {
    try {
        const { movieTitle } = req.params;
        const { page=0, limit=10 } = req.query;

        const data = await getReviewsByMovieTitle(movieTitle, page, limit);
        res.json(data);
    } catch (error) {
        console.error("Errore nel recupero delle recensioni per titolo:", error);
        if (error.response?.status === 404) {
            return res.status(404).json({ message: "Nessuna recensione trovata" });
        }
        next(error);
    }
});

/**
 * Crea una nuova recensione.
 * @route POST /reviews
 * @param {Object} req.body - Corpo della recensione da creare
 * @returns {Object} Nuova recensione
 */
router.post("/reviews", async (req, res, next) => {
    try {
        const newReview = await createReview(req.body);
        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
});

/**
 * Ricerca avanzata delle recensioni con filtri.
 * @route GET /reviews/search
 * @param {Object} req.query - Parametri di ricerca
 * @returns {Object} Recensioni filtrate
 */
router.get("/reviews/search", async (req, res, next) => {
    try {
        const reviews = await searchReviews(req.query);
        res.json(reviews);
    } catch (error) {
        next(error);
    }
});

/**
 * Ottieni la media dei punteggi per ciascun film.
 * @route GET /reviews/average-rating
 * @returns {Object} Media dei punteggi
 */
router.get("/reviews/average-rating", async (req, res, next) => {
    try {
        const ratings = await getAverageRatings();
        res.json(ratings);
    } catch (error) {
        next(error);
    }
});

/**
 * Ottieni tutte le release con paginazione.
 * @route GET /releases
 * @param {number} page - Numero di pagina (default 1)
 * @param {number} limit - Numero di release per pagina (default 10)
 * @returns {Object} Releases
 */
router.get("/releases", async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const releases = await getReleases(parseInt(page) || 1, parseInt(limit) || 10);
        res.json(releases);
    } catch (error) {
        next(error);
    }
});

/**
 * Ottieni una release specifica tramite ID.
 * @route GET /releases/:id
 * @param {string} id - ID della release
 * @returns {Object} Release
 */
router.get("/releases/:id", async (req, res, next) => {
    try {
        const release = await getReleaseById(req.params.id);
        res.json(release);
    } catch (error) {
        next(error);
    }
});

/**
 * Ottieni tutti i poster (solo link e movieId).
 * @route GET /posters
 * @returns {Object} Poster
 */
router.get("/posters", async (req, res, next) => {
    try {
        const posters = await getPosters();
        res.json(posters);
    } catch (error) {
        next(error);
    }
});

/**
 * Ottieni un poster specifico tramite ID.
 * @route GET /posters/:id
 * @param {string} id - ID del poster
 * @returns {Object} Poster
 */
router.get("/posters/:id", async (req, res, next) => {
    try {
        const poster = await getPosterById(req.params.id);
        res.json(poster);
    } catch (error) {
        next(error);
    }
});


/**
 *  Ottieni i dettagli completi di un attore, inclusi paesi e tendenze delle recensioni.
 *  @route GET /actor/:id/full
 *  @param {string} id - ID dell'attore
 *  @returns {Object} Dettagli completi dell'attore
 */
router.get("/actor/:id/full", async (req, res) => {
    const actorId = req.params.id;
    const actorDetails = await getActorDetailsFromPostgres(actorId);
    const name = actorDetails.name;

    const countries = await getActorCountriesFromMongo(name);
    const trends = await getReviewTrendsFromMongo(name);

    res.json({ ...actorDetails, countries, trends });
});


/**
 * Ottieni le release associate a una lista di ID.
 * @route POST /releases/by-ids
 * @param {Array} ids - Array di ID delle release
 * @returns {Object} Release associate agli ID
 */
router.post("/releases/by-ids", async (req, res, next) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "Array 'ids' mancante o vuoto" });
        }
        const releases = await getReleasesByIds(ids);
        res.json(releases);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
