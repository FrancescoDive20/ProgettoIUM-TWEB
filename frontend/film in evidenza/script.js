import { getAllMovies } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    fetchMovies();
});

function loadNavbar() {
    fetch("components/navbar.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("navbar-container").innerHTML = html;
        });
}

function fetchMovies() {
    getAllMovies()
        .then(response => {
            window.allMovies = response.data;

            const container = document.getElementById("movies-container");
            container.innerHTML = response.data.map(movie => `
                <div class="movie-card">
                    <img src="${movie.poster}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <p>${movie.year}</p>
                </div>
            `).join("");
        })
        .catch(error => console.error("Errore nel caricamento dei film:", error));
}

