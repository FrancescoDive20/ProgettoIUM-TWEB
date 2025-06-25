/**
 * Questo Server configura il server Express e le rotte per la gestione delle recensioni, poster e release.
 * Utilizza Mongoose per connettersi a MongoDB e CORS per abilitare le richieste cross-origin.
 * @module server
 */

const express = require("express");
const cors = require("cors");
const mongoose = require("./services/mongodb");

const app = express();
const PORT = 8082;

// Middleware
app.use(cors());
app.use(express.json());

// Importiamo le rotte
const reviewsRoutes = require("./routes/reviews");
const postersRoutes = require("./routes/posters");
const releasesRoutes = require("./routes/releases");

// Configuriamo le rotte
app.use("/reviews", reviewsRoutes);
app.use("/posters", postersRoutes);
app.use("/releases", releasesRoutes);

/**
 * Avviamo il server Express sulla porta specificata.
 * @function
 * @param {number} PORT
 * @returns {void}
 */
app.listen(PORT, () => {
    console.log(`MongoDB server running on http://localhost:${PORT}`);
});
