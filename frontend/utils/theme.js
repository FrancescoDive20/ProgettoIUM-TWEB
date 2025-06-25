function initTheme() {
    const darkMode = localStorage.getItem("dark-mode") === "enabled";
    const highContrast = localStorage.getItem("high-contrast") === "enabled";

    if (darkMode) {
        document.body.classList.add("dark-mode");
    }

    if (highContrast) {
        document.body.classList.add("high-contrast");
    }
}

/**
 * Attiva/Disattiva la Dark Mode
 */
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle("dark-mode");

    if (isDarkMode) {
        localStorage.setItem("dark-mode", "enabled");
    } else {
        localStorage.setItem("dark-mode", "disabled");
    }
}

/**
 * Attiva/Disattiva l'Alto Contrasto
 */
function toggleHighContrast() {
    const isHighContrast = document.body.classList.toggle("high-contrast");

    if (isHighContrast) {
        localStorage.setItem("high-contrast", "enabled");
    } else {
        localStorage.setItem("high-contrast", "disabled");
    }
}

document.getElementById("toggle-darkmode")?.addEventListener("click", toggleDarkMode);
document.getElementById("toggle-highcontrast")?.addEventListener("click", toggleHighContrast);
