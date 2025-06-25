function openMovieModal(movieId) {
    fetch(`/api/movie/${movieId}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("modal-title").textContent = data.title;
            document.getElementById("modal-poster").src = data.poster;
            document.getElementById("modal-description").textContent = data.description;
            document.getElementById("movie-link").href = `/pages/movie.html?id=${movieId}`;
            document.getElementById("movie-modal").style.display = "block";
        });
}

function closeModal() {
    document.getElementById("movie-modal").style.display = "none";
}
