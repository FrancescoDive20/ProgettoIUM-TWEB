import {
    getAllCountries, getAllGenres, getAllLanguages, getAllStudios, getAllThemes
} from "./api.js";

function applyFilters() {
    const genre = document.getElementById("filter-genre").value;
    const language = document.getElementById("filter-language").value;
    const country = document.getElementById("filter-country").value;
    const studio = document.getElementById("filter-studio").value;
    const theme = document.getElementById("filter-theme").value;

    Promise.all([
        getAllGenres(),
        getAllLanguages(),
        getAllCountries(),
        getAllStudios(),
        getAllThemes()
    ]).then(([genres, languages, countries, studios, themes]) => {
        let filteredMovies = [];
        if (genre) filteredMovies = genres.data.filter(g => g.name === genre);
        if (language) filteredMovies = languages.data.filter(l => l.name === language);
        if (country) filteredMovies = countries.data.filter(c => c.name === country);
        if (studio) filteredMovies = studios.data.filter(s => s.name === studio);
        if (theme) filteredMovies = themes.data.filter(t => t.name === theme);
        renderMovies(filteredMovies);
    }).catch(error => console.error("Errore nell'applicazione dei filtri:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("apply-filters").addEventListener("click", applyFilters);
});