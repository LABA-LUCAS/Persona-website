document.addEventListener("DOMContentLoaded", function () {
    const introVideo = document.querySelector(".homePageIntro video");
    if (introVideo) {
        // introVideo.muted = true; // Als je wilt dat het geluid uit staat bij autoplay, dan doe je false of dit stukje weglaten
        introVideo.play().catch(err => console.warn("Autoplay geblokkeerd:", err));
    }

    const gameButtons = document.querySelectorAll(".gameButton button");
    gameButtons.forEach(button => {
        button.addEventListener("click", function () {
            const game = this.parentElement.classList.contains("P5RoyalButton") ?
                "P5Royal" :
                "P5Strikers";
            window.location.href = `allPersonaPage.html?game=${game}`;
        });
    });

    const siteButtons = document.querySelectorAll(".sitePageButtonsPart1 button, .sitePageButtonsPart2 button");
    siteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const pageMap = {
                "All Persona's": "allPersonaPage.html",
                "Requests": "requestPage.html",
                "T&T": "tipsPage.html",
                "Skills": "skillsPage.html",
                "FAQ": "faqPage.html"
            };
            const target = pageMap[this.textContent.trim()];
            if (target) window.location.href = target;
        });
    });

    // Herstelt het thema dat is opgeslagen bij start
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "enabled") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
});