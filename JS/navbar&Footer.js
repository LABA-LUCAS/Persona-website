function loadHTML(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            if (id === "navbar") {
                const toggleBtn = document.querySelector(".menu-toggle");
                const navLinks = document.querySelector(".navbar-links");
                toggleBtn.addEventListener("click", () => {
                    navLinks.classList.toggle("show");
                });

                document.body.classList.add("dark-mode");

                const darkModeToggle = document.getElementById("darkModeToggle");

                darkModeToggle.addEventListener("click", () => {
                    document.body.classList.toggle("dark-mode");
                    const isDark = document.body.classList.contains("dark-mode");
                    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
                    darkModeToggle.textContent = isDark ? "Dark🌓Light" : "Light☀️Dark";
                });

                // Dit herstelt darkmode bij herladen
                const savedMode = localStorage.getItem("darkMode");
                if (savedMode === "enabled") {
                    document.body.classList.add("dark-mode");
                    darkModeToggle.textContent = "Dark🌓Light";
                } else if (savedMode === "disabled") {
                    document.body.classList.remove("dark-mode");
                    darkModeToggle.textContent = "Light☀️Dark";
                }
            }
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadHTML("navbar", "navbar.html");
    loadHTML("footer", "footer.html");
});