/**
 * Configura la connessione a MongoDB utilizzando Mongoose.
 * @module services/mongodb
 */
const mongoose = require('mongoose');

/**
 * Connessione al database MongoDB.
 * @function
 * @returns {void}
 */
mongoose.connect("mongodb://localhost:27017/Movies_DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Aumenta il timeout della connessione
    socketTimeoutMS: 45000,          // Aumenta il timeout della lettura
});

const db = mongoose.connection;

/**
 * Gestisce l'errore di connessione a MongoDB.
 * @event
 * @param {Error} error - Errore di connessione.
 */
db.on("error", console.error.bind(console, "Errore di connessione a MongoDB"));

/**
 * Evento che indica la connessione riuscita a MongoDB.
 * @event
 */
db.once("open", () => {
    console.log("Connesso a MongoDB");
});

module.exports = mongoose;
