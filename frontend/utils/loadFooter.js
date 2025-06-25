async function loadFooter() {
    const footerContainer = document.getElementById("footer-container");

    if (footerContainer) {
        try {
            const response = await fetch("/components/footer.html");
            if (!response.ok) throw new Error("Errore nel caricamento del footer");
            const footerHtml = await response.text();
            footerContainer.innerHTML = footerHtml;
        } catch (error) {
            console.error("Errore nel caricamento del footer:", error);
        }
    }
}

document.addEventListener("DOMContentLoaded", loadFooter);
