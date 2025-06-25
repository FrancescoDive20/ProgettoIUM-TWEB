const dbRequest = indexedDB.open("Movie_DB", 1);
let db;

dbRequest.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore("movies", { keyPath: "id" });
};

dbRequest.onsuccess = (event) => {
    db = event.target.result;
};

function cacheMovies(movies) {
    const transaction = db.transaction("movies", "readwrite");
    const store = transaction.objectStore("movies");
    movies.forEach(movie => store.put(movie));
}

function getCachedMovies(callback) {
    const transaction = db.transaction("movies", "readonly");
    const store = transaction.objectStore("movies");
    const request = store.getAll();

    request.onsuccess = () => callback(request.result);
}
