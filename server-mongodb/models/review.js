/**
 * Importazione di Mongoose per l'interazione con il database MongoDB.
 * @module models/review
 */
const mongoose = require('mongoose');

/**
 * Schema per le recensioni dei film.
 * @typedef {Object} ReviewSchema
 * @property {string} rottenTomatoesLink - Link alla recensione su Rotten Tomatoes.
 * @property {string} movieTitle - Titolo del film.
 * @property {string} criticName - Nome del critico.
 * @property {boolean} topCritic - Indica se il critico è considerato un "top critic".
 * @property {string} publisherName - Nome della casa editrice della recensione.
 * @property {string} reviewType - Tipo di recensione (ad esempio "Film Review").
 * @property {number} reviewScore - Punteggio della recensione.
 * @property {Date} reviewDate - Data della recensione.
 * @property {string} reviewContent - Contenuto completo della recensione.
 */
const reviewSchema = new mongoose.Schema({
    rottenTomatoesLink: { type: String, required: true },
    movieTitle: { type: String, required: true },
    criticName: { type: String, required: true },
    topCritic: { type: Boolean, default: false },
    publisherName: { type: String, required: true },
    reviewType: { type: String, required: true },
    reviewScore: { type: Number, required: true },
    reviewDate: { type: Date, required: true },
    reviewContent: { type: String, required: true }
});

// Aggiungi indice su movieTitle e reviewDate per velocizzare le query.
reviewSchema.index({ movieTitle: 1, reviewDate: -1 });

/**
 * Modello Mongoose per le recensioni dei film.
 * @type {Model}
 */
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
