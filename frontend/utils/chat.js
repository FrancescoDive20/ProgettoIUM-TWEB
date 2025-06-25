const socket = io("http://localhost:3001"); // Connessione al server della chat
let currentRoom = null;

let username = localStorage.getItem("username") || prompt("Inserisci il tuo nome utente:");
localStorage.setItem("username", username);

/**
 * Funzione per alternare l'ingresso/uscita dalla stanza
 * Quando viene cliccato il bottone, se l'utente è già nella stanza selezionata, esce, altrimenti entra.
 */
function toggleRoom() {
    const roomSelect = document.getElementById("rooms");
    const selectedRoom = roomSelect.value;
    if (currentRoom === selectedRoom) {
        // Se già nella stanza, esci
        leaveRoom();
    } else {
        // Se in un'altra stanza o non in nessuna, esci (se necessario) e poi entra nella nuova stanza
        if (currentRoom) {
            leaveRoom(() => joinRoom(selectedRoom));
        } else {
            joinRoom(selectedRoom);
        }
    }
}

/**
 * Entra in una stanza.
 * Invia l'evento "join_room" con l'oggetto { room, username } e mostra un messaggio di sistema.
 */
function joinRoom(room) {
    currentRoom = room;
    socket.emit("join_room", { room, username });
    showSystemMessage(`🔵 ${username} è entrato nella stanza: ${room}`);
    document.getElementById("chat-messages").innerHTML = "";
    loadMessages(room);
    updateJoinButton(true, room);
}

/**
 * Esce dalla stanza corrente.
 * Invia l'evento "leave_room" con i dati e mostra un messaggio di sistema.
 * Se è stato passato un callback, lo esegue al termine.
 */
function leaveRoom(callback) {
    if (!currentRoom) return;
    socket.emit("leave_room", { room: currentRoom, username });
    showSystemMessage(`🔴 ${username} ha lasciato la stanza: ${currentRoom}`);
    updateJoinButton(false);
    currentRoom = null;
    if (typeof callback === "function") callback();
}

/**
 * Aggiorna il testo del bottone "Entra/Esci" in base allo stato.
 */
function updateJoinButton(isInRoom, room = "") {
    const btn = document.getElementById("join-leave-btn");
    if (btn) {
        if (isInRoom) {
            btn.innerText = `Esci da ${room}`;
            btn.classList.add("leave");
        } else {
            btn.innerText = "Entra";
            btn.classList.remove("leave");
        }
    }
}

/**
 * Mostra un messaggio di sistema nella chat.
 */
function showSystemMessage(message) {
    const chatMessages = document.getElementById("chat-messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add("system-message");
    messageElement.innerText = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Invia un messaggio.
 * Se il campo è vuoto o non si è in una stanza, non fa nulla.
 */
function sendMessage() {
    const messageInput = document.getElementById("chat-input");
    const message = messageInput.value.trim();
    if (message === "" || !currentRoom) return;

    const data = {
        room: currentRoom,
        username: username,
        message: message,
        timestamp: new Date().toLocaleTimeString()
    };

    socket.emit("send_message", data);

    displayMessage(data);

    messageInput.value = "";
}


/**
 * Ricezione messaggi dal server.
 * Tutti i messaggi vengono visualizzati (compresi i messaggi di sistema).
 */
socket.on("receive_message", (data) => {
    displayMessage(data);
    saveMessage(data);
});


/**
 * Visualizza un messaggio nella chat.
 * Se il messaggio è di sistema, non mostra avatar; altrimenti, mostra avatar a sinistra (per i messaggi ricevuti) o a destra (per i messaggi inviati).
 */
function displayMessage(data) {
    const chatMessages = document.getElementById("chat-messages");
    const messageElement = document.createElement("div");

    // Se il messaggio è di sistema
    if (data.system) {
        messageElement.classList.add("system-message");
        messageElement.innerText = data.message;
    } else {
        const messageClass = data.username === username ? "sent" : "received";
        messageElement.classList.add("message", messageClass);

        const userProfile = `https://i.pravatar.cc/40?u=${data.username}`;

        messageElement.innerHTML = `
            <div class="message-content">
                ${data.username !== username ? `<img src="${userProfile}" alt="Profile" class="profile-pic">` : ""}
                <div class="message-text">
                    <strong>${data.username}</strong> (${data.timestamp || ""}): ${data.message}
                </div>
                ${data.username === username ? `<img src="${userProfile}" alt="Profile" class="profile-pic">` : ""}
            </div>
        `;
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Salva il messaggio nel localStorage per la stanza corrente.
 */
function saveMessage(data) {
    if (!data.system) {
        let chatHistory = JSON.parse(localStorage.getItem(data.room)) || [];
        chatHistory.push(data);
        localStorage.setItem(data.room, JSON.stringify(chatHistory));
    }
}

/**
 * Carica la cronologia dei messaggi per la stanza dal localStorage.
 */
function loadMessages(room) {
    let chatHistory = JSON.parse(localStorage.getItem(room)) || [];
    chatHistory.forEach((msg) => displayMessage(msg));
}

document.getElementById("chat-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
