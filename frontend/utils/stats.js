console.log("stats.js caricato");

import {
    getRuntimeVsRating,
    getTopActors,
    getLanguagesOverTime,
    getGenresOverTime,
    getThemesOverTime
} from "./api.js";

const filters = {
    runtimeRating: rows =>
        rows.filter(
            d =>
                typeof d.runtime === "number" &&
                d.runtime >= 30 &&
                d.runtime <= 300 &&
                typeof d.rating === "number" &&
                d.rating >= 0 &&
                d.rating <= 5
        ),

    topActors: rows =>
        rows
            .map(d => ({
                name: d.name,
                count: parseInt(d.appearances || d.count || 0)
            }))
            .filter(d => d.count >= 3)
            .sort((a, b) => b.count - a.count),


    languagesOverTime(rows) {
        const currentYear = new Date().getFullYear();
        const filteredRows = rows.filter(r => {
            const year = parseInt(r.year);
            return year >= 1870 && year <= currentYear;
        });
        return buildTimeSeries(filteredRows, "language");
    },

    genresOverTime(rows) {
        const currentYear = new Date().getFullYear();
        const filteredRows = rows.filter(r => {
            const year = parseInt(r.year);
            return year >= 1870 && year <= currentYear;
        });
        return buildTimeSeries(filteredRows, "genre");
    },

    themesOverTime(rows) {
        const currentYear = new Date().getFullYear();
        const filteredRows = rows
            .map(r => {
                const year = parseInt(r.year);
                return {
                    ...r,
                    decade: Math.floor(year / 10) * 10,
                    year
                };
            })
            .filter(r => r.year >= 1870 && r.year <= currentYear);

        const result = buildTimeSeries(filteredRows, "theme", "decade");
        return {
            decades: result.years,
            themes: result.series
        };
    }
};

function buildTimeSeries(rows, itemKey, yearKey = "year") {
    const yearSet = new Set();
    const itemMap = new Map(); // item -> Map(year -> count)

    rows.forEach(r => {
        const item = r[itemKey];
        const year = parseInt(r[yearKey]);
        const count = parseInt(r.count || r.cnt || 1);

        yearSet.add(year);
        if (!itemMap.has(item)) itemMap.set(item, new Map());
        itemMap.get(item).set(year, count);
    });

    const years = [...yearSet].sort((a, b) => a - b);

    const series = [...itemMap.entries()].map(([name, yMap]) => ({
        name,
        counts: years.map(y => yMap.get(y) || 0)
    }));

    return { years, series };
}

document.addEventListener("DOMContentLoaded", () => {
    const statsSelect = document.getElementById("statsSelect");
    const statsContent = document.getElementById("stats-content");
    const loadingMessage = document.getElementById("loadingMessage");
    const showBtn = document.getElementById("showStatBtn");
    const backButton = document.getElementById("backButton");

    if (!statsSelect || !statsContent || !loadingMessage || !showBtn || !backButton) {
        console.error("❌ Elementi mancanti nella pagina.");
        return;
    }

    showBtn.addEventListener("click", async () => {
        const selected = statsSelect.value;
        if (!selected) {
            statsContent.innerHTML = "<p>Seleziona una statistica prima di procedere.</p>";
            return;
        }

        toggleUI(true);

        try {
            switch (selected) {
                case "runtime-rating":
                    await showRuntimeVsRating();
                    break;
                case "top-actors":
                    await showTopActors();
                    break;
                case "languages-over-time":
                    await showLanguagesOverTime();
                    break;
                case "genres-over-time":
                    await showGenresOverTime();
                    break;
                case "themes-over-time":
                    await showThemesOverTime();
                    break;
                default:
                    statsContent.innerHTML = "<p>Statistica non riconosciuta.</p>";
            }
        } catch (err) {
            statsContent.innerHTML =
                "<p style='color:red;'>Errore nel caricamento dei dati.</p>";
            console.error(err);
        } finally {
            loadingMessage.style.display = "none";
            backButton.style.display = "inline-block";
        }
    });

    backButton.addEventListener("click", () => {
        toggleUI(false);
        statsContent.innerHTML = "";
    });

    function toggleUI(loading) {
        statsSelect.style.display = loading ? "none" : "inline-block";
        showBtn.style.display = loading ? "none" : "inline-block";
        statsSelect.disabled = loading;
        backButton.style.display = loading ? "inline-block" : "none";
        loadingMessage.style.display = loading ? "block" : "none";
    }


    /**
     * Visualizza un grafico che confronta la durata dei film con il loro rating.
     * @returns {Promise<void>}
     */
    async function showRuntimeVsRating() {
        const raw = await getRuntimeVsRating();
        const data = filters.runtimeRating(raw);

        statsContent.innerHTML = `
      <h2>Runtime vs Rating</h2>
      <canvas id="chart-runtime-rating" width="900" height="600"></canvas>
    `;

        new Chart(document.getElementById("chart-runtime-rating"), {
            type: "scatter",
            data: {
                datasets: [
                    {
                        label: "Runtime vs Rating",
                        data: data.map(d => ({ x: d.runtime, y: d.rating })),
                        backgroundColor: "rgba(75, 192, 192, 0.6)"
                    }
                ]
            },
            options: {
                responsive: false,
                scales: {
                    x: { title: { display: true, text: "Runtime (min)" }, min: 30, max: 300 },
                    y: { title: { display: true, text: "Rating" }, min: 0, max: 5 }
                }
            }
        });
    }

    /**
     * Visualizza gli attori più presenti in un grafico.
     * @returns {Promise<void>}
     */
    async function showTopActors() {
        const raw = await getTopActors();
        const data = filters.topActors(raw);

        statsContent.innerHTML = `
      <h2>Top Attori</h2>
      <canvas id="chart-top-actors" width="900" height="600"></canvas>
    `;

        new Chart(document.getElementById("chart-top-actors"), {
            type: "bar",
            data: {
                labels: data.map(d => d.name),
                datasets: [
                    {
                        label: "Numero di Film",
                        data: data.map(d => d.count),
                        backgroundColor: "rgba(153, 102, 255, 0.6)"
                    }
                ]
            },
            options: {
                responsive: false,
                indexAxis: "y",
                scales: { x: { beginAtZero: true } }
            }
        });
    }

    /**
     * Visualizza le lingue nel tempo in un grafico.
     * @returns {Promise<void>}
     */
    async function showLanguagesOverTime() {
        const raw = await getLanguagesOverTime();
        const { years, series } = filters.languagesOverTime(raw);

        statsContent.innerHTML = `
      <h2>Lingue nel tempo</h2>
      <canvas id="chart-languages" width="1300" height="600"></canvas>
    `;

        new Chart(document.getElementById("chart-languages"), {
            type: "line",
            data: {
                labels: years,
                datasets: series.map(s => ({
                    label: s.name,
                    data: s.counts,
                    borderColor: randomColor(),
                    fill: false
                }))
            },
            options: {
                responsive: false,
                plugins: { legend: { position: "right" } },
                scales: {
                    x: { title: { display: true, text: "Anno" } },
                    y: { title: { display: true, text: "Numero di Film" }, beginAtZero: true }
                }
            }
        });
    }

    /**
     * Visualizza i generi nel tempo in un grafico.
     * @returns {Promise<void>}
     */
    async function showGenresOverTime() {
        const raw = await getGenresOverTime();
        const { years, series } = filters.genresOverTime(raw);

        statsContent.innerHTML = `
      <h2>Generi nel tempo</h2>
      <canvas id="chart-genres" width="900" height="600"></canvas>
    `;

        new Chart(document.getElementById("chart-genres"), {
            type: "line",
            data: {
                labels: years,
                datasets: series.map(s => ({
                    label: s.name,
                    data: s.counts,
                    borderColor: randomColor(),
                    fill: false
                }))
            },
            options: {
                responsive: false,
                plugins: { legend: { position: "right" } },
                scales: {
                    x: { title: { display: true, text: "Anno" } },
                    y: { title: { display: true, text: "Numero di Film" }, beginAtZero: true }
                }
            }
        });
    }


    /**
     * Visualizza le tematiche per decade in un grafico.
     * @returns {Promise<void>}
     */
    async function showThemesOverTime() {
        const raw = await getThemesOverTime();
        const { decades, themes } = filters.themesOverTime(raw);

        statsContent.innerHTML = `
      <h2>Tematiche per decade</h2>
      <canvas id="chart-themes" width="1200" height="600"></canvas>
    `;

        new Chart(document.getElementById("chart-themes"), {
            type: "line",
            data: {
                labels: decades,
                datasets: themes.map(t => ({
                    label: t.name,
                    data: t.counts,
                    borderColor: randomColor(),
                    fill: false
                }))
            },
            options: {
                responsive: false,
                plugins: { legend: { position: "right" } },
                scales: {
                    x: { title: { display: true, text: "Decade" } },
                    y: { title: { display: true, text: "Numero di Film" }, beginAtZero: true }
                }
            }
        });
    }

    function randomColor() {
        const r = Math.floor(Math.random() * 200);
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 200);
        return `rgb(${r},${g},${b})`;
    }
});
