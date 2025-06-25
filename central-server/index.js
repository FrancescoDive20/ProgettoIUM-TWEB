/**
 * Modulo principale per il server Express.
 * Configura il server, i middleware e le rotte.
 * Gestisce le richieste verso il server centrale, inclusi gli endpoint per PostgreSQL e MongoDB.
 *
 * @module index
 */

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// Importa le route
const postgresRoutes = require("./routes/postgres");
const mongodbRoutes = require("./routes/mongodb");

const app = express();

// Middleware per il parsing del corpo della richiesta in formato JSON
app.use(express.json());

// Middleware per abilitare CORS
app.use(cors());

// Middleware per il logging delle richieste HTTP
app.use(morgan("dev"));

/**
 * Collega le route per PostgreSQL e MongoDB.
 * @route {GET} /postgres
 * @route {GET} /mongodb
 */
app.use("/postgres", postgresRoutes);
app.use("/mongodb", mongodbRoutes);


/**
 * Route di base che fornisce informazioni sul server centrale.
 * @route {GET} /
 * @returns {String} HTML con la descrizione degli endpoint disponibili
 */
app.get("/", (req, res) => {
    res.send(`
        <h1>Central Server</h1>
        <p>Benvenuto al Central Server. Usa gli endpoint:</p>
        <ul>
            <li><a href="/postgres/movies">/postgres/movies</a> - Lista di Film</li>
            <li><a href="/postgres/film">/postgres/film</a> - prende dei Film</li>
            <li><a href="/postgres/movies/runtime-rating">/postgres/movies/runtime-rating</a> - Lista di ratings</li>
            <li><a href="/mongodb/reviews">/mongodb/reviews</a> - Lista di Recensioni</li>
        </ul>
    `);
});


/**
 * Gestisce gli errori generati dal server.
 * @function
 * @param {Error} err - L'errore generato
 * @param {Object} req - Oggetto richiesta
 * @param {Object} res - Oggetto risposta
 * @param {Function} next - Funzione di callback per il passaggio al prossimo middleware
 */
app.use((err, req, res, next) => {
    console.error(`Errore: ${err.message}`); // Logga l'errore
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || "Errore interno del server" });
});

/**
 * Avvia il server sulla porta specificata e logga l'avvio.
 * @function
 * @param {number} PORT - La porta su cui il server ascolta
 */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Central server running on http://localhost:${PORT}`);
});
