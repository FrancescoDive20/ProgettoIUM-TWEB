/**
 * Importazione di Express e del modello Review.
 * @module routes/review
 */
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

/**
 * Endpoint per cercare recensioni con filtri opzionali e paginazione.
 * @route GET /reviews/search
 * @param {string} [movieTitle] - Titolo del film da cercare.
 * @param {string} [criticName] - Nome del critico.
 * @param {boolean} [topCritic] - Se cercare solo critici "top".
 * @param {string} [publisherName] - Nome della casa editrice.
 * @param {string} [reviewType] - Tipo di recensione (ad esempio "Film Review").
 * @param {number} [minScore] - Punteggio minimo della recensione.
 * @param {number} [maxScore] - Punteggio massimo della recensione.
 * @param {string} [startDate] - Data di inizio per il filtro delle recensioni.
 * @param {string} [endDate] - Data di fine per il filtro delle recensioni.
 * @param {number} [page=1] - Pagina corrente.
 * @param {number} [limit=10] - Numero di risultati per pagina.
 * @returns {Array} Lista di recensioni filtrate e paginate.
 * @throws {500} Errore durante la ricerca delle recensioni.
 */
router.get("/search", async (req, res) => {
    const {
        movieTitle,
        criticName,
        topCritic,
        publisherName,
        reviewType,
        minScore,
        maxScore,
        startDate,
        endDate,
        page = 1,
        limit = 10
    } = req.query;

    try {
        let filter = {};

        if (movieTitle) filter.movieTitle = { $regex: new RegExp(movieTitle, "i") };
        if (criticName) filter.criticName = { $regex: new RegExp(criticName, "i") };
        if (topCritic !== undefined) filter.topCritic = topCritic === "true";
        if (publisherName) filter.publisherName = { $regex: new RegExp(publisherName, "i") };
        if (reviewType) filter.reviewType = reviewType;
        if (minScore || maxScore) {
            filter.reviewScore = {};
            if (minScore) filter.reviewScore.$gte = parseFloat(minScore);
            if (maxScore) filter.reviewScore.$lte = parseFloat(maxScore);
        }
        if (startDate || endDate) {
            filter.reviewDate = {};
            if (startDate) filter.reviewDate.$gte = new Date(startDate);
            if (endDate) filter.reviewDate.$lte = new Date(endDate);
        }

        const reviews = await Review.find(filter)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .sort({ reviewDate: -1 })
            .lean();

        res.json(reviews);
    } catch (err) {
        console.error("Errore nella ricerca delle recensioni:", err.message);
        res.status(500).json({ message: "Errore durante la ricerca delle recensioni" });
    }
});

/**
 * @route GET /reviews
 * @param {number} [page=1] - Pagina corrente.
 * @param {number} [limit=10] - Numero di risultati per pagina.
 * @returns {Array} Lista di recensioni.
 * @throws {500} Errore nel recupero delle recensioni.
 */
router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const reviews = await Review.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ reviewDate: -1 })
            .lean();

        res.json(reviews);
    } catch (err) {
        console.error("Errore nel recupero delle recensioni:", err.message);
        res.status(500).json({ message: "Errore nel recupero delle recensioni" });
    }
});

/**
 * @route GET /reviews/:movieTitle
 * @param {string} movieTitle - Titolo del film per cercare recensioni.
 * @returns {Array} Lista delle recensioni per il film.
 * @throws {404} Nessuna recensione trovata.
 * @throws {500} Errore durante la ricerca delle recensioni.
 */
router.get("/:movieTitle", async (req, res, next) => {
    try {
        const { movieTitle } = req.params;

        const reviews = await Review.find({
            movie_title: { $regex: new RegExp(`^${movieTitle}$`, "i") }
        })
            .limit(parseInt(req.query.limit) || 10)
            .lean();

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: "Nessuna recensione trovata per questo film" });
        }

        res.json(reviews);
    } catch (error) {
        console.error("Errore nella ricerca delle recensioni:", error.message);
        next(error);
    }
});


/**
 * @route POST /reviews
 * @param {Object} review - Oggetto della recensione da creare.
 * @returns {Object} Recensione appena creata.
 * @throws {500} Errore nella creazione della recensione.
 */
router.post("/", async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        console.error("Errore nella creazione della recensione:", err.message);
        res.status(500).json({ message: "Errore nella creazione della recensione" });
    }
});

/**
 * @route GET /reviews/average-rating
 * @returns {Array} Media dei punteggi per ogni film.
 * @throws {500} Errore nel recupero della media delle recensioni.
 */
router.get("/average-rating", async (req, res) => {
    try {
        const result = await Review.aggregate([
            { $group: { _id: "$movieTitle", averageRating: { $avg: "$reviewScore" } } },
            { $sort: { averageRating: -1 } }
        ]);

        res.json(result);
    } catch (err) {
        console.error("Errore nel recupero della media delle recensioni:", err.message);
        res.status(500).json({ message: "Errore nel recupero della media delle recensioni" });
    }
});

module.exports = router;
