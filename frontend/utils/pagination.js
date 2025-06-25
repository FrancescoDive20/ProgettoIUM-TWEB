let currentPage = 1;
const moviesPerPage = 10;

function fetchMovies(page = 1) {
    fetch(`https://localhost:3000/postgres/movies/?page=${page}&limit=${moviesPerPage}`)
        .then(res => {
            if (!res.ok) throw new Error("Errore nel recupero dei dati");
            return res.json();
        })
        .then(data => {
            renderMovies(data.movies);
            updatePaginationControls(page, data.totalPages);
        })
        .catch(error => console.error("Errore durante il recupero dei film:", error));
}

function renderMovies(movies) {
    const container = document.getElementById("movies-container");
    container.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="${movie.poster}" alt="${movie.name}">
            <h3>${movie.name}</h3>
            <p>${movie.year}</p>
        `;
        container.appendChild(movieCard);
    });
}

function updatePaginationControls(page, totalPages) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const prevButton = document.createElement("button");
    prevButton.textContent = "←";
    prevButton.disabled = page === 1;
    prevButton.addEventListener("click", () => changePage(-1));

    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Pagina ${page} di ${totalPages}`;

    const nextButton = document.createElement("button");
    nextButton.textContent = "→";
    nextButton.disabled = page === totalPages;
    nextButton.addEventListener("click", () => changePage(1));

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(nextButton);
}

function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage < 1) return;

    currentPage = newPage;
    fetchMovies(currentPage);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchMovies();
});
