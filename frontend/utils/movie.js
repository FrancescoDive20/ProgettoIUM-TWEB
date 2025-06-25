import {
    getMovieById, getMovieDetails, getActorsByMovieId,
    getCrewByMovieId, getGenresByMovieId, getLanguagesByMovieId,
    getCountryByMovieId, getAwardsByMovie, getStudiosByMovieId, getThemesByMovieId
} from "./api.js";

function displayMovieDetails(movie) {
    document.getElementById("movie-details").innerHTML = `
        <div class="movie-card">
            <img src="${movie.poster}" alt="Poster">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.rating}</p>
            <p>${movie.description}</p>
        </div>
    `;
}

function loadMovieDetails(id) {
    getMovieById(id).then(response => {
        const movie = response.data;
        displayMovieDetails(movie);

        return Promise.all([
            getMovieDetails(id),
            getActorsByMovieId(id),
            getCrewByMovieId(id),
            getGenresByMovieId(id),
            getLanguagesByMovieId(id),
            getCountryByMovieId(id),
            getAwardsByMovie(movie.title, movie.year),
            getStudiosByMovieId(id),
            getThemesByMovieId(id)
        ]);
    }).then(([details, actors, crew, genres, languages, country, awards, studios, themes]) => {
        document.getElementById("movie-actors").innerHTML = actors.data.map(actor => `<p>${actor.name}</p>`).join("");
        document.getElementById("movie-crew").innerHTML = crew.data.map(member => `<p>${member.name} - ${member.role}</p>`).join("");
        document.getElementById("movie-genres").innerHTML = genres.data.map(genre => `<span>${genre.name}</span>`).join(", ");
        document.getElementById("movie-languages").innerHTML = languages.data.map(lang => `<span>${lang.name}</span>`).join(", ");
        document.getElementById("movie-country").innerText = country.data.name;
        document.getElementById("movie-awards").innerHTML = awards.data.map(award => `<p>${award.category} - ${award.year}</p>`).join("");
        document.getElementById("movie-studios").innerHTML = studios.data.map(studio => `<span>${studio.name}</span>`).join(", ");
        document.getElementById("movie-themes").innerHTML = themes.data.map(theme => `<span>${theme.name}</span>`).join(", ");
    }).catch(error => console.error("Errore nel caricamento dei dettagli del film:", error));
}

