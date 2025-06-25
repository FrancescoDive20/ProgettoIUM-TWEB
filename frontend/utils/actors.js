console.log("actors.js caricato");

import {
    getActorFullData,
    getMovieFullData
} from "./api.js";

import { setupToggle } from './toggle.js';

const FILMS_PER_PAGE = 5;
const OSCARS_PER_PAGE = 5;
const COUNTRIES_PER_PAGE = 5;

document.getElementById("search-button").addEventListener("click", async () => {
    const actorName = document.getElementById("actor-name-input").value.trim();
    const errorDiv = document.getElementById("error-message");
    const loadingDiv = document.getElementById("loading-message");
    errorDiv.innerText = "";

    if (!actorName) {
        errorDiv.innerText = "Inserisci un nome attore valido.";
        return;
    }

    loadingDiv.style.display = "block";

    const actorDetails = document.getElementById("actor-details");
    actorDetails.style.display = "none";
    document.getElementById("filmography").innerHTML = "";
    document.getElementById("average-rating").innerText = "";
    document.getElementById("oscar-list").innerHTML = "";
    document.getElementById("countries-list").innerHTML = "";
    document.getElementById("pagination-controls").innerHTML = "";
    document.getElementById("oscar-pagination")?.remove();
    document.getElementById("country-pagination")?.remove();

    // Svuota anche i dettagli film precedenti
    document.getElementById("movie-details").innerHTML = "";
    document.getElementById("movie-details").style.display = "none";


    try {
        const details = await getActorFullData(actorName);

        loadingDiv.style.display = "none";
        document.getElementById("actor-name").innerText = details.name || actorName;

        const avg = details.averageRating;
        document.getElementById("average-rating").innerText =
            typeof avg === "number" ? avg.toFixed(2) : "N/A";

        const oscarList = document.getElementById("oscar-list");
        if (!details.oscars || details.oscars.length === 0) {
            oscarList.innerHTML = "<li>Nessun premio Oscar</li>";
        } else {
            const won = details.oscars.filter(o => o.winner).sort((a, b) => a.yearCeremony - b.yearCeremony);
            const nominated = details.oscars.filter(o => !o.winner).sort((a, b) => a.yearCeremony - b.yearCeremony);
            const allSortedOscars = [...won, ...nominated];

            let currentOscarPage = 1;
            const totalOscarPages = Math.ceil(allSortedOscars.length / OSCARS_PER_PAGE);

            const paginationDiv = document.createElement("div");
            paginationDiv.id = "oscar-pagination";
            oscarList.after(paginationDiv);

            function renderOscarPage(page) {
                oscarList.innerHTML = "";
                const start = (page - 1) * OSCARS_PER_PAGE;
                const end = start + OSCARS_PER_PAGE;
                const pageOscars = allSortedOscars.slice(start, end);

                pageOscars.forEach(oscar => {
                    const li = document.createElement("li");
                    const status = oscar.winner ? "🏆 Vincitore" : "🥈 Candidato";
                    li.innerText = `${oscar.yearCeremony} - ${status} - ${oscar.category} per "${oscar.film}"`;
                    oscarList.appendChild(li);
                });

                renderOscarPagination(page);
            }

            /**
             * Renderizza la paginazione per gli Oscar.
             * @param page
             */
            function renderOscarPagination(page) {
                paginationDiv.innerHTML = "";

                const prev = document.createElement("button");
                prev.innerText = "« Precedente";
                prev.disabled = page === 1;
                prev.onclick = () => {
                    if (currentOscarPage > 1) {
                        currentOscarPage--;
                        renderOscarPage(currentOscarPage);
                    }
                };

                const next = document.createElement("button");
                next.innerText = "Successivo »";
                next.disabled = page === totalOscarPages;
                next.onclick = () => {
                    if (currentOscarPage < totalOscarPages) {
                        currentOscarPage++;
                        renderOscarPage(currentOscarPage);
                    }
                };

                const info = document.createElement("span");
                info.innerText = ` Pagina ${page} di ${totalOscarPages} `;
                info.style.margin = "0 10px";

                paginationDiv.appendChild(prev);
                paginationDiv.appendChild(info);
                paginationDiv.appendChild(next);
            }

            renderOscarPage(currentOscarPage);
        }

        const countriesList = document.getElementById("countries-list");
        countriesList.innerHTML = "";

        if (details.releaseCountries && details.releaseCountries.length > 0) {
            let currentCountryPage = 1;
            const totalCountryPages = Math.ceil(details.releaseCountries.length / COUNTRIES_PER_PAGE);

            const countryPagination = document.createElement("div");
            countryPagination.id = "country-pagination";
            countriesList.after(countryPagination);


            /**
             * Renderizza la pagina dei paesi.
             * @param page
             */
            function renderCountryPage(page) {
                countriesList.innerHTML = "";
                const start = (page - 1) * COUNTRIES_PER_PAGE;
                const end = start + COUNTRIES_PER_PAGE;
                const slice = details.releaseCountries.slice(start, end);
                slice.forEach(entry => {
                    const li = document.createElement("li");
                    li.innerText = `${entry.country} (${entry.count})`;
                    countriesList.appendChild(li);
                });
                renderCountryPagination(page);
            }

            /**
             * Renderizza la paginazione per i paesi.
             * @param page
             */
            function renderCountryPagination(page) {
                countryPagination.innerHTML = "";

                const prev = document.createElement("button");
                prev.innerText = "« Precedente";
                prev.disabled = page === 1;
                prev.onclick = () => {
                    if (currentCountryPage > 1) {
                        currentCountryPage--;
                        renderCountryPage(currentCountryPage);
                    }
                };

                const next = document.createElement("button");
                next.innerText = "Successivo »";
                next.disabled = page === totalCountryPages;
                next.onclick = () => {
                    if (currentCountryPage < totalCountryPages) {
                        currentCountryPage++;
                        renderCountryPage(currentCountryPage);
                    }
                };

                const info = document.createElement("span");
                info.innerText = ` Pagina ${page} di ${totalCountryPages} `;
                info.style.margin = "0 10px";

                countryPagination.appendChild(prev);
                countryPagination.appendChild(info);
                countryPagination.appendChild(next);
            }

            renderCountryPage(currentCountryPage);
        } else {
            countriesList.innerHTML = "<li>Nessun dato disponibile</li>";
        }

        const filmographyRaw = details.filmography || [];

        const withYear = filmographyRaw.filter(f => f[2]);
        const withoutYear = filmographyRaw.filter(f => !f[2]);

        withYear.sort((a, b) => a[2] - b[2]);

        const filmography = [...withYear, ...withoutYear];

        if (filmography.length === 0) {
            document.getElementById("filmography").innerHTML = "<p>Nessun film trovato</p>";
            document.getElementById("pagination-controls").innerHTML = "";
        } else {
            let currentPage = 1;
            const totalPages = Math.ceil(filmography.length / FILMS_PER_PAGE);

            function renderPage(page) {
                const filmographyDiv = document.getElementById("filmography");
                filmographyDiv.innerHTML = "";

                const start = (page - 1) * FILMS_PER_PAGE;
                const end = Math.min(start + FILMS_PER_PAGE, filmography.length);
                for (let i = start; i < end; i++) {
                    const film = filmography[i];
                    const div = document.createElement("div");
                    div.classList.add("movie-entry");
                    div.innerHTML = `
                        <strong class="clickable-movie" data-title="${film[1]}" data-year="${film[2] || ""}">
                            ${film[2] || "?"} - ${film[1] || "?"}
                        </strong><br>
                        Ruolo: ${film[4] || "?"}<br>
                        Voto: ${film[5] != null ? film[5] : "N/A"}<br>
                        <p>${film[3] || ""}</p>
                    `;
                    filmographyDiv.appendChild(div);

                    const strong = div.querySelector("strong");
                    if (strong) {
                        strong.style.cursor = "pointer";
                        strong.style.color = "#0077cc";
                        strong.addEventListener("click", async () => {
                            const text = strong.innerText.trim(); // es: "2010 - Inception: The Cobol Job"

                            // Estrai l'anno e il titolo
                            const [date, ...rest] = text.split(" - ");
                            const title = rest.join(" - ").trim();

                            if (!date || !title) {
                                console.warn("Formato non valido:", text);
                                alert("Formato titolo non valido");
                                return;
                            }

                            try {
                                const movieData = await getMovieFullData(title, date);
                                console.log("Chiamata getMovieFullData:", {title, date});
                                console.log("Dati film:", movieData);

                                if (movieData && movieData.name) {
                                    renderMovieDetails(movieData);
                                    document.getElementById("movie-details").style.display = 'block';

                                    // Riattiva i bottoni "Mostra/Nascondi"
                                    setupToggle('.toggle-btn');
                                    setupModalClose();

                                } else {
                                    alert("Errore: film non trovato o nome mancante");
                                }
                            } catch (err) {
                                console.error("Errore nel recupero film:", err);
                                alert("Errore nel recupero dati del film: " + err.message);
                            }
                        });
                    }
                }
                renderPaginationControls(page);
            }

            function renderPaginationControls(page) {
                const controlsDiv = document.getElementById("pagination-controls");
                controlsDiv.innerHTML = "";

                if (totalPages <= 1) return;

                const prevBtn = document.createElement("button");
                prevBtn.innerText = "« Precedente";
                prevBtn.disabled = page === 1;
                prevBtn.onclick = () => {
                    if (currentPage > 1) {
                        currentPage--;
                        renderPage(currentPage);
                    }
                };
                controlsDiv.appendChild(prevBtn);

                for (let i = 1; i <= totalPages; i++) {
                    const btn = document.createElement("button");
                    btn.innerText = i;
                    btn.disabled = i === page;
                    btn.style.margin = "0 3px";
                    btn.onclick = () => {
                        currentPage = i;
                        renderPage(currentPage);
                    };
                    controlsDiv.appendChild(btn);
                }

                const nextBtn = document.createElement("button");
                nextBtn.innerText = "Successivo »";
                nextBtn.disabled = page === totalPages;
                nextBtn.onclick = () => {
                    if (currentPage < totalPages) {
                        currentPage++;
                        renderPage(currentPage);
                    }
                };
                controlsDiv.appendChild(nextBtn);
            }

            renderPage(currentPage);
        }

        actorDetails.style.display = "block";
    } catch (err) {
        loadingDiv.style.display = "none";
        console.error("Errore durante il recupero dati:", err);
        errorDiv.innerText = "Errore nel recupero dati: " + err.message;
    }
});

/**
 * Renderizza i dettagli del film in un overlay modale.
 * @param data
 */
function renderMovieDetails(data) {
    const container = document.getElementById("movie-details");

    // Genera gli ID univoci come prima
    const uniqueDescriptionId = `description-section-${Math.random().toString(36).substr(2, 9)}`;
    const uniqueLanguagesId = `languages-section-${Math.random().toString(36).substr(2, 9)}`;
    const uniqueThemesId = `themes-section-${Math.random().toString(36).substr(2, 9)}`;
    const uniqueActorsId = `actors-section-${Math.random().toString(36).substr(2, 9)}`;
    const uniqueCrewsId = `crews-section-${Math.random().toString(36).substr(2, 9)}`;
    const uniqueReleasesId = `releases-section-${Math.random().toString(36).substr(2, 9)}`;
    const uniqueAwardsId = `awards-section-${Math.random().toString(36).substr(2, 9)}`;
    const uniqueReviewId = `review-section-${Math.random().toString(36).substr(2, 9)}`;

    const title = data.name || "Titolo sconosciuto";
    const year = data.date || "Anno sconosciuto";
    const description = data.description || "Nessuna descrizione disponibile.";
    const tagline = data.tagline || "";
    const duration = data.minute ? `${data.minute} min` : "Durata sconosciuta";
    const rating = data.rating !== undefined ? data.rating : "N/A";

    const genres = Array.isArray(data.genres)
        ? data.genres
            .filter(g => g && g.genre)
            .map(g => g.genre)
            .join(", ")
        : "Nessun genere";

    const languages = Array.isArray(data.languages)
        ? data.languages
            .filter(l => l && l.language)
            .map(l => l.language)
            .join(", ")
        : "Nessuna lingua";

    const country = Array.isArray(data.countries) && data.countries.length > 0 && data.countries[0]
        ? data.countries[0].country || "Paese sconosciuto"
        : "Paese sconosciuto";

    const theme = Array.isArray(data.themes)
        ? data.themes
            .filter(t => t && t.theme)
            .map(t => t.theme)
            .join(", ")
        : "Nessun tema";

    const actors = Array.isArray(data.actors)
        ? data.actors
            .filter(a => a && a.name)
            .map(a => a.name)
            .join(", ")
        : "Nessun attore";

    const crew = Array.isArray(data.crew)
        ? data.crew
            .filter(c => c && c.name)
            .map(c => `${c.name} (${c.job || c.role || "ruolo sconosciuto"})`)
            .join(", ")
        : "Nessuna crew";

    const awards = Array.isArray(data.oscars) && data.oscars.length > 0
        ? data.oscars
            .map(a => {
                const category = a.category || "Categoria sconosciuta";
                const winnerName = a.name || "Vincitore sconosciuto";
                const yearCeremony = a.yearCeremony || "?";
                return `<li>${category} per <em>${winnerName}</em> (${yearCeremony})</li>`;
            })
            .join("")
        : "<li>Nessun premio</li>";

    const reviews = Array.isArray(data.reviews) && data.reviews.length > 0
        ? data.reviews
            .filter(r => r)
            .map(r => {
                const author = r.critic_name || "Anonimo";
                const content = r.review_content || "Nessun contenuto";
                const score = r.review_score && r.review_score.trim() !== "" ? r.review_score : "?";
                const date = r.review_date ? ` - ${new Date(r.review_date).toLocaleDateString()}` : "";
                return `<li><strong>${author}</strong>${date}: ${content} (Score: ${score})</li>`;
            })
            .join("")
        : "<li>Nessuna recensione</li>";

    const studios = Array.isArray(data.studios) && data.studios.length > 0
        ? data.studios
            .filter(s => s && s.studio)
            .map(s => s.studio)
            .join(", ")
        : "Nessuno studio";

    const releases = Array.isArray(data.releases) && data.releases.length > 0
        ? data.releases
            .filter(r => r)  // filtro semplice
            .map(r => {
                const country = r.country || "Paese sconosciuto";
                const date = r.date ? new Date(r.date).toLocaleDateString() : "Data sconosciuta";
                return `<li>${country}: ${date}</li>`;
            })
            .join("")
        : "<li>Nessuna release</li>";


    container.innerHTML = `
        <div id="movie-content" role="dialog" aria-modal="true" aria-labelledby="movie-title" tabindex="0">
            <button id="close-movie-btn" aria-label="Chiudi dettagli film">✕</button>
            <h2>Dettagli film</h2>
            <h3 id="movie-title">${title} (${year})</h3>
            ${data.poster ? `<img src="${data.poster}" alt="Poster" style="max-width:200px;">` : ""}
            <p><strong>Studios:</strong> ${studios}</p>
            <p><strong>Tagline:</strong> ${tagline}</p>
            <div>
                <button class="toggle-btn" data-target="${uniqueReleasesId}">Mostra/Nascondi Release</button>
                <ul id="${uniqueReleasesId}" style="display: none;">
                    ${releases}
                </ul>
            </div>         
            <div>
                <button class="toggle-btn" data-target="${uniqueDescriptionId}">Mostra/Nascondi Descrizione</button>
                <ul id="${uniqueDescriptionId}" style="display: none;">
                    ${description}
                </ul>
            </div>        
            <p><strong>Durata:</strong> ${duration}</p>
            <p><strong>Rating:</strong> ${rating}</p>
            <p><strong>Generi:</strong> ${genres}</p>
            <div>
                <button class="toggle-btn" data-target="${uniqueLanguagesId}">Mostra/Nascondi Lingue</button>
                <ul id="${uniqueLanguagesId}" style="display: none;">
                    ${languages}
                </ul>
            </div>         
            <p><strong>Paese:</strong> ${country}</p>
            <div>
                <button class="toggle-btn" data-target="${uniqueThemesId}">Mostra/Nascondi Temi</button>
                <ul id="${uniqueThemesId}" style="display: none;">
                    ${theme}
                </ul>
            </div>        
            <div>
                <button class="toggle-btn" data-target="${uniqueActorsId}">Mostra/Nascondi Cast</button>
                <ul id="${uniqueActorsId}" style="display: none;">
                    ${actors}
                </ul>
            </div> 
            <div>
                <button class="toggle-btn" data-target="${uniqueCrewsId}">Mostra/Nascondi Crew</button>
                <ul id="${uniqueCrewsId}" style="display: none;">
                    ${crew}
                </ul>
            </div> 
            <div>
                <button class="toggle-btn" data-target="${uniqueAwardsId}">Mostra/Nascondi Premi</button>
                <ul id="${uniqueAwardsId}" style="display: none;">
                    ${awards}
                </ul>
            </div> 

            <div>
                <button class="toggle-btn" data-target="${uniqueReviewId}">Mostra/Nascondi Recensioni</button>
                <ul id="${uniqueReviewId}" style="display: none;">
                    ${reviews}
                </ul>
            </div>
        </div>
    `;

    setupToggle();

    container.style.display = "flex";
    container.classList.add('modal-overlay');
    container.setAttribute('aria-hidden', 'false');

    document.getElementById("movie-content").focus();

    document.getElementById("close-movie-btn").addEventListener('click', () => {
        container.style.display = "none";
        container.classList.remove('modal-overlay');
        container.setAttribute('aria-hidden', 'true');
    });

    container.addEventListener('click', (event) => {
        if (event.target === container) {
            container.style.display = "none";
            container.classList.remove('modal-overlay');
            container.setAttribute('aria-hidden', 'true');
        }
    });


    const toggleButtons = container.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const target = document.getElementById(targetId);
            if (target.style.display === 'none') {
                target.style.display = 'block';
            } else {
                target.style.display = 'none';
            }
        });
    });

}

function setupModalClose() {
    const modal = document.getElementById("movie-details");
    if (!modal) return;
    const closeBtn = document.getElementById("close-movie-btn");

    closeBtn.onclick = () => {
        modal.style.display = "none";
        modal.innerHTML = "";
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            modal.innerHTML = "";
        }
    };

    document.onkeydown = (e) => {
        if (e.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
            modal.innerHTML = "";
        }
    };
}

