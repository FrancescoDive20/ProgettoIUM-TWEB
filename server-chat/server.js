/**
 * Importazione delle dipendenze necessarie.
 * @module server
 */
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

/**
 * Creazione dell'applicazione Express.
 * @constant {Object} app - Applicazione Express.
 */
const app = express();

/**
 * Creazione del server HTTP.
 * @constant {Object} server - Server HTTP basato sull'app Express.
 */
const server = http.createServer(app);

/**
 * Creazione di una nuova istanza di Socket.IO.
 * @constant {Server} io - Istanziamento del server WebSocket.
 */
const io = new Server(server, {
    cors: {
        origin: "http://localhost:63342", // URL del frontend
        methods: ["GET", "POST"]
    }
});

// Middleware CORS per consentire richieste da client esterni.
app.use(cors());

/**
 * Gestisce la connessione di un nuovo client WebSocket.
 * @event connection
 * @param {Socket} socket - Oggetto socket associato al client connesso.
 */
io.on("connection", (socket) => {
    console.log(`🔗 Utente connesso: ${socket.id}`);

    /**
     * Evento per un client che si unisce a una stanza.
     * @event join_room
     * @param {Object} data - Dati inviati dal client contenenti le informazioni della stanza e del nome utente.
     * @param {string} data.room - Nome della stanza a cui il client si unisce.
     * @param {string} data.username - Nome utente del client.
     */
    socket.on("join_room", (data) => {
        const { room, username } = data;
        socket.join(room);
        console.log(`🏠 ${username} (socket ${socket.id}) è entrato nella stanza: ${room}`);

        // Invia un messaggio di sistema a tutti gli altri nella stanza.
        socket.to(room).emit("receive_message", {
            username: "Sistema",
            message: `🔵 ${username} è entrato nella stanza: ${room}`,
            system: true
        });
    });

    /**
     * Evento per un client che lascia una stanza.
     * @event leave_room
     * @param {Object} data - Dati inviati dal client contenenti le informazioni della stanza e del nome utente.
     * @param {string} data.room - Nome della stanza che il client lascia.
     * @param {string} data.username - Nome utente del client.
     */
    socket.on("leave_room", (data) => {
        const { room, username } = data;
        socket.leave(room);
        console.log(`🚪 ${username} (socket ${socket.id}) ha lasciato la stanza: ${room}`);
        socket.to(room).emit("receive_message", {
            username: "Sistema",
            message: `🔴 ${username} ha lasciato la stanza: ${room}`,
            system: true
        });
    });

    /**
     * Evento per l'invio di un messaggio da parte di un client.
     * @event send_message
     * @param {Object} data - Dati del messaggio inviato dal client.
     * @param {string} data.room - Nome della stanza in cui inviare il messaggio.
     * @param {string} data.username - Nome utente che invia il messaggio.
     * @param {string} data.message - Contenuto del messaggio.
     */
    socket.on("send_message", (data) => {
        const { room } = data;
        // Invia il messaggio solo agli altri (socket.to) per evitare duplicati nel mittente.
        socket.to(room).emit("receive_message", data);
    });

    /**
     * Evento che gestisce la disconnessione di un client.
     * @event disconnect
     * @param {string} socket.id - ID univoco del client disconnesso.
     */
    socket.on("disconnect", () => {
        console.log(`❌ Utente disconnesso: ${socket.id}`);
        // Se vuoi gestire messaggi di disconnessione nelle stanze, occorre memorizzare le stanze in cui l'utente era connesso.
    });
});

/**
 * Avvia il server sulla porta 3001.
 * @function listen
 * @param {number} 3001 - La porta sulla quale il server WebSocket sarà in ascolto.
 */
server.listen(3001, () => {
    console.log("✅ Server WebSocket in esecuzione sulla porta 3001");
});
