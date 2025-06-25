/**
 * Importazione di Mongoose per l'interazione con il database MongoDB.
 * @module models/poster
 */
const mongoose = require('mongoose');

/**
 * Schema per i poster dei film.
 * @typedef {Object} PosterSchema
 * @property {string} movieId - ID del film (riferimento al modello 'Movie').
 * @property {string} link - URL del poster del film.
 */
const posterSchema = new mongoose.Schema({
    movieId: { type: String, ref: 'Movie', required: true },
    link: { type: String, required: true }
});

// Aggiungi indice su movieId per velocizzare le query basate su questo campo.
posterSchema.index({ movieId: 1 });

/**
 * Modello Mongoose per i poster dei film.
 * @type {Model}
 */
const Poster = mongoose.model('Poster', posterSchema);

module.exports = Poster;
