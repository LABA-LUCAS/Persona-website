function loadHTML(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            // Mobile menu toggle activeren
            if (id === "navbar") {
                const toggleBtn = document.querySelector(".menu-toggle");
                const navLinks = document.querySelector(".navbar-links");
                toggleBtn.addEventListener("click", () => {
                    navLinks.classList.toggle("show");
                });
            }
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadHTML("navbar", "navbar.html");
    loadHTML("footer", "footer.html");
});