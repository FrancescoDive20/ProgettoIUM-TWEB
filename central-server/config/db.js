/**
 * Crea e configura una pool di connessioni per PostgreSQL.
 * Utilizza le credenziali per connettersi al database "Movies_DB".
 * @module config/db
 */
const { Pool } = require('pg');

/**
 * Pool di connessioni PostgreSQL configurato.
 * @type {Pool}
 */
const pool = new Pool({
    user: 'postgres',  // Sostituisci con le tue credenziali
    host: 'localhost',
    database: 'Movies_DB',  // Sostituisci con il nome del tuo DB
    password: 'Cetriolo20!',  // Sostituisci con la tua password
    port: 5432,
});

module.exports = pool;
