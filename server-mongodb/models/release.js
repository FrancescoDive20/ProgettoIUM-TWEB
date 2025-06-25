/**
 * Importazione di Mongoose per l'interazione con il database MongoDB.
 * @module models/release
 */
const mongoose = require('mongoose');

/**
 * Schema per le date di rilascio dei film.
 * @typedef {Object} ReleaseSchema
 * @property {string} movieId - ID del film (riferimento al modello 'Movie').
 * @property {string} country - Paese di rilascio del film.
 * @property {Date} date - Data di rilascio del film.
 * @property {string} type - Tipo di rilascio (ad esempio "Cinema", "Home Video").
 * @property {number} rating - Valutazione del film (compresa tra 0 e 10).
 */
const releaseSchema = new mongoose.Schema({
    movieId: { type: String, ref: 'Movie', required: true },
    country: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    rating: { type: Number, min: 0, max: 10 }
});

// Aggiungi indice su movieId e date per velocizzare le query.
releaseSchema.index({ movieId: 1, date: -1 });

/**
 * Modello Mongoose per le date di rilascio dei film.
 * @type {Model}
 */
const Release = mongoose.model('Release', releaseSchema);

module.exports = Release;
