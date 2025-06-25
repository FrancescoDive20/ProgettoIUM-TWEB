import { searchMovies } from './api.js';

document.getElementById("search-button").addEventListener("click", handleSearch);
document.getElementById("search-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

async function handleSearch() {
    const name = document.getElementById("search-input").value.trim();
    const date = document.getElementById("date-input").value.trim();
    if (!name) {
        alert("Inserisci il nome del film.");
        return;
    }
    try {
        const movie = await searchMovies(name, date);
        displayMovie(movie);
    } catch (error) {
        alert(error.message);
        document.getElementById("movie-details-section").style.display = "none";
    }
}

function displayMovie(movie) {
    const detailsSection = document.getElementById("movie-details-section");
    const movieCard = document.getElementById("movie-card");

    movieCard.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}">
        <div>
          <h2>${movie.title} (${movie.year || movie.date || "N/D"})</h2>
          <p>${movie.plot || "Nessuna trama disponibile."}</p>
          <h3>Recensioni:</h3>
          <ul>
            ${movie.reviews && movie.reviews.length > 0
        ? movie.reviews.map(review => `<li><strong>${review.author}:</strong> ${review.text}</li>`).join("")
        : "<li>Nessuna recensione disponibile.</li>"}
          </ul>
        </div>
        <div style="clear: both;"></div>
      `;
    detailsSection.style.display = "block";
}
