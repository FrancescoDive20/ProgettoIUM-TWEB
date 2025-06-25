document.addEventListener("keydown", (e) => {
    if (e.altKey) {
        switch (e.key.toLowerCase()) {
            case "s":
                document.getElementById("search-bar").focus();
                break;
            case "h":
                window.location.href = "/index.html";
                break;
        }
    }
});

document.getElementById("contrast-toggle").addEventListener("click", () => {
    document.body.classList.toggle("high-contrast");
});
