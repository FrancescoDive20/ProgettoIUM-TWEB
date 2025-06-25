/**
 * Importazione di Express e del modello Poster.
 * @module routes/poster
 */
const express = require('express');
const router = express.Router();
const Poster = require('../models/Poster');

/**
 * @route GET /posters
 * @returns {Array} Lista dei poster con 'link' e 'movieId'.
 * @throws {500} Errore interno del server.
 */
router.get('/', async (req, res) => {
    try {
        const posters = await Poster.find({}, { link: 1, movieId: 1 });
        res.json(posters);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @route GET /posters/:id
 * @param {string} id - ID del poster da recuperare.
 * @returns {Object} Dettagli del poster.
 * @throws {404} Poster non trovato.
 * @throws {500} Errore interno del server.
 */
router.get('/:id', async (req, res) => {
    try {
        const poster = await Poster.findOne({ id: req.params.id });
        if (!poster) {
            return res.status(404).json({ message: "Poster non trovato" });
        }
        res.json(poster);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
