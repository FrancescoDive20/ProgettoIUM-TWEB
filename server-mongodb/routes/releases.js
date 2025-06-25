/**
 * Importazione di Express e del modello Release.
 * @module routes/release
 */
const express = require('express');
const router = express.Router();
const Release = require('../models/Release');

/**
 * @route GET /releases
 * @param {number} [page=1] - Pagina corrente.
 * @param {number} [limit=10] - Numero di risultati per pagina.
 * @returns {Array} Lista delle release dei film.
 * @throws {500} Errore interno del server.
 */
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const releases = await Release.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ date: -1 });
        res.json(releases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @route GET /releases/:id
 * @param {string} id - ID della release da recuperare.
 * @returns {Array} Lista di release corrispondenti all'ID.
 * @throws {404} Release non trovata.
 * @throws {500} Errore interno del server.
 */
router.get('/:id', async (req, res) => {
    try {
        const releases = await Release.find({ id: req.params.id });
        if (!releases || releases.length === 0) {
            return res.status(404).json({ message: "Release non trovata" });
        }
        res.json(releases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @route POST /releases/by-ids
 * @param {Array} ids - Lista di id dei film.
 * @returns {Array} Lista delle release corrispondenti.
 * @throws {400} Se gli id sono mancanti o vuoti.
 * @throws {500} Errore interno del server.
 */
router.post('/by-ids', async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "Array 'ids' mancante o vuoto" });
    }

    const stringIds = ids.map(id => id.toString());

    try {
        const releases = await Release.find(
            { id: { $in: stringIds } },
            'id country date type rating'
        );
        res.json(releases);
    } catch (err) {
        console.error("Errore in /releases/by-ids:", err.message);
        res.status(500).json({ error: "Errore interno del server MongoDB" });
    }
});

module.exports = router;
