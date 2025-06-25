async function loadNavbar() {
    const navbarContainer = document.getElementById("navbar-container");

    if (navbarContainer) {
        try {
            const response = await fetch("/components/navbar.html");
            if (!response.ok) throw new Error("Errore nel caricamento della navbar");
            const navbarHtml = await response.text();
            navbarContainer.innerHTML = navbarHtml;

            attachNavbarEvents();
        } catch (error) {
            console.error("Errore nel caricamento della navbar:", error);
        }
    }
}

function attachNavbarEvents() {
    console.log("Navbar caricata, aggiungo gli event listener...");

    // Pulsante Indietro
    const backButton = document.getElementById("back-button");
    if (backButton) {
        if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
            backButton.style.display = "none"; // Nasconde il tasto "Indietro" in home
        } else {
            backButton.addEventListener("click", () => {
                if (document.referrer) {
                    window.history.back();
                } else {
                    window.location.href = "/index.html"; // Modifica se necessario
                }
            });
        }
    }

    // Pulsante Dark Mode
    const darkModeButton = document.getElementById("dark-mode-toggle");
    if (darkModeButton) {
        darkModeButton.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            document.body.classList.remove("high-contrast"); // Evita conflitti con High Contrast
            localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark-mode" : "light-mode");
        });
    }

    // Pulsante Alto Contrasto
    const highContrastButton = document.getElementById("high-contrast-toggle");
    if (highContrastButton) {
        highContrastButton.addEventListener("click", () => {
            document.body.classList.toggle("high-contrast");
            document.body.classList.remove("dark-mode"); // Evita conflitti con Dark Mode
            localStorage.setItem("theme", document.body.classList.contains("high-contrast") ? "high-contrast" : "normal");
        });
    }

    // Applica il tema salvato al caricamento
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
}

document.addEventListener("DOMContentLoaded", loadNavbar);
