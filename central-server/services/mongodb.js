const axios = require("axios");

const MONGO_DB_URL = "http://localhost:8082";

/**
 * Ottiene una lista di recensioni con paginazione.
 * @async
 * @function getReviews
 * @param {number} page - Numero della pagina da recuperare
 * @param {number} limit - Numero massimo di recensioni per pagina
 * @returns {Promise<Object>} Dati delle recensioni per la pagina richiesta
 * @throws {Error} Se la richiesta HTTP fallisce
 */
async function getReviews(page, limit) {
    const { data } = await axios.get(`${MONGO_DB_URL}/reviews?page=${page}&limit=${limit}`);
    return data;
}

/**
 * Crea una nuova recensione nel database.
 * @async
 * @function createReview
 * @param {Object} review - Dati della recensione da creare
 * @param {string} review.movieId - ID del film a cui è associata la recensione
 * @param {string} review.text - Testo della recensione
 * @param {number} review.rating - Valutazione del film (da 1 a 5)
 * @returns {Promise<Object>} Dati della recensione appena creata
 * @throws {Error} Se la richiesta HTTP fallisce
 */
async function createReview(review) {
    const { data } = await axios.post(MONGO_DB_URL, review);
    return data;
}

/**
 * Cerca recensioni in base alla query fornita.
 * @async
 * @function searchReviews
 * @param {Object} query - Query di ricerca
 * @param {string} query.movieId - ID del film da cercare (facoltativo)
 * @param {string} query.text - Testo della recensione da cercare (facoltativo)
 * @returns {Promise<Object>} Risultati della ricerca delle recensioni
 * @throws {Error} Se la richiesta HTTP fallisce
 */
async function searchReviews(query) {
    const queryString = new URLSearchParams(query).toString();

    const { data } = await axios.get(`${MONGO_DB_URL}/search?${queryString}`);
    return data;
}

/**
 * Ottiene la valutazione media di tutti i film.
 * @async
 * @function getAverageRatings
 * @returns {Promise<Object>} Valutazione media per tutti i film
 * @throws {Error} Se la richiesta HTTP fallisce
 */
async function getAverageRatings() {
    const { data } = await axios.get(`${MONGO_DB_URL}/average-rating`);
    return data;
}

/**
 * Ottiene una lista di tutte le release con paginazione.
 * @async
 * @function getReleases
 * @param {number} page - Numero della pagina da recuperare
 * @param {number} limit - Numero massimo di release per pagina
 * @returns {Promise<Object>} Dati delle release per la pagina richiesta
 * @throws {Error} Se la richiesta HTTP fallisce
 */
async function getReleases(page, limit) {
    const { data } = await axios.get(`${MONGO_DB_URL}/releases?page=${page}&limit=${limit}`);
    return data;
}

/**
 * Ottiene una release specifica tramite ID.
 * @async
 * @function getReleaseById
 * @param {string} id - ID della release da recuperare
 * @returns {Promise<Object>} Dati della release specificata
 * @throws {Error} Se la richiesta HTTP fallisce
 */
async function getReleaseById(id) {
    const { data } = await axios.get(`${MONGO_DB_URL}/releases/${id}`);
    return data;
}

/**
 * Ottiene una lista di tutti i poster (solo link e movieId).
 * @async
 * @function getPosters
 * @returns {Promise<Object>} Lista dei poster disponibili
 * @throws {Error} Se la richiesta HTTP fallisce
 */
async function getPosters() {
    const { data } = await axios.get(`${MONGO_DB_URL}/posters`);
    return data;
}

/**
 * Ottiene un poster specifico tramite ID.
 * @async
 * @function getPosterById
 * @param {string} id - ID del poster da recuperare
 * @returns {Promise<Object>} Dati del poster specificato
 * @throws {Error} Se la richiesta HTTP fallisce
 */
async function getPosterById(id) {
    const { data } = await axios.get(`${MONGO_DB_URL}/posters/${id}`);
    return data;
}

/**
 * Ottiene le release associate a una lista di ID.
 * @async
 * @function getReleasesByIds
 * @param ids
 * @returns {Promise<any>}
 * @throws {Error} Se la richiesta HTTP fallisce
 */
async function getReleasesByIds(ids) {
    if (!Array.isArray(ids)) {
        ids = [ids];
    }
    try {
        const { data } = await axios.post(`${MONGO_DB_URL}/releases/by-ids`, {
            ids: ids });
        return data;
    } catch (error) {
        console.error("Errore in getReleasesByIds:", error);
        throw error;
    }
}

/**
 * Ottiene le recensioni associate a un film specifico tramite il titolo.
 * async
 * @function getReviewsByMovieTitle
 * @param movieTitle
 * @param page
 * @param limit
 * @returns {Promise<any>}
 * @throws {Error} Se la richiesta HTTP fallisce
 */
async function getReviewsByMovieTitle(movieTitle, page=0, limit=10) {
    const encodedTitle = encodeURIComponent(movieTitle);
    const query = new URLSearchParams({ page, limit }).toString();
    const { data } = await axios.get(`${MONGO_DB_URL}/reviews/${encodedTitle}?${query}`);
    return data;
}

module.exports = {
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
};
