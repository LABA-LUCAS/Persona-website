// function loadHTML(id, file) {
//     fetch(file)
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById(id).innerHTML = data;

//             if (id === "navbar") {
//                 document.addEventListener("click", (e) => {
//                     const toggleBtn = document.querySelector(".menu-toggle");
//                     const navLinks = document.querySelector(".navbar-links");
//                     if (toggleBtn && navLinks && e.target === toggleBtn) {
//                         navLinks.classList.toggle("show");
//                     }
//                 });
//             }
//         });
// }

document.addEventListener("DOMContentLoaded", () => {
    // loadHTML("navbar", "navbar.html");
    // loadHTML("footer", "footer.html");

    // const filterToggle = document.getElementById("filterToggle");
    // const filterOptions = document.getElementById("filterOptions");
    // if (filterToggle && filterOptions) {
    //     filterToggle.addEventListener("click", () => {
    //         filterOptions.classList.toggle("hidden");
    //     });
    // }

    const arcanaTypes = [
         "Chariot", "Death", "Devil", "Emperor", "Empress", "Fool", 
         "Fortune", "Hanged Man", "Hermit", "Hierophant", "Judgment", "Justice", 
         "Lovers", "Magician", "Moon", "Priestess", "Star", "Strength",
         "Sun", "Temperance", "Tower", 
    ];

    const arcanaFilter = document.getElementById("arcanaFilter");
    const arcanaToggleBtn = document.createElement("button");
    arcanaToggleBtn.textContent = "Selecteer/Deselecteer Alles";
    arcanaToggleBtn.style.marginBottom = "1rem";
    arcanaFilter.parentElement.insertBefore(arcanaToggleBtn, arcanaFilter);

    let arcanaCheckboxes = [];

    arcanaTypes.forEach(type => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" value="${type}" checked /> ${type}`;
        arcanaFilter.appendChild(label);
        arcanaCheckboxes.push(label.querySelector("input"));
    });

    arcanaToggleBtn.addEventListener("click", () => {
        const allChecked = arcanaCheckboxes.every(cb => cb.checked);
        arcanaCheckboxes.forEach(cb => cb.checked = !allChecked);
        applyFilters();
    });

    // Element filtering setup
    const elementSelect = document.createElement("select");
    elementSelect.id = "elementType";
    elementSelect.innerHTML = `
        <option value="">Element (All)</option>
        <option value="fire">Fire</option>
        <option value="ice">Ice</option>
        <option value="wind">Wind</option>
        <option value="electric">Electric</option>
        <option value="bless">Bless</option>
        <option value="curse">Curse</option>
        <!-- Voeg hier meer elementen toe indien nodig -->
    `;
    const resistanceTypeSelect = document.createElement("select");
    resistanceTypeSelect.id = "resistanceType";
    resistanceTypeSelect.innerHTML = `
        <option value="">Type (All)</option>
        <option value="weak">Weak</option>
        <option value="resist">Resist</option>
        <option value="null">Null</option>
        <option value="absorb">Absorb</option>
        <option value="repel">Repel</option>
    `;
    filterOptions.appendChild(elementSelect);
    filterOptions.appendChild(resistanceTypeSelect);

    let allPersonas = [];

    function renderPersonas(personas) {
        const container = document.getElementById("personaList");
        container.innerHTML = "";

        personas.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("persona-card");

            const left = document.createElement("div");
            left.classList.add("left");
            left.textContent = `Arcana: ${p.arcana}`;

            const right = document.createElement("div");
            right.classList.add("right");
            right.textContent = `Name: ${p.name}`;

            card.appendChild(left);
            card.appendChild(right);
            container.appendChild(card);
        });
    }

    function applyFilters() {
        let filtered = [...allPersonas];

        const searchTerm = document.getElementById("searchBar").value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        const nameSort = document.getElementById("sortName").value;
        if (nameSort === "asc") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        const levelSort = document.getElementById("sortLevel").value;
        if (levelSort === "asc") {
            filtered.sort((a, b) => a.level - b.level);
        } else {
            filtered.sort((a, b) => b.level - a.level);
        }

        // ID sort (optioneel: voeg aparte dropdown toe als je dit wilt scheiden)
        // filtered.sort((a, b) => a.id - b.id); // of b.id - a.id

        const selectedArcana = arcanaCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
        if (selectedArcana.length > 0) {
            filtered = filtered.filter(p => selectedArcana.includes(p.arcana));
            filtered.sort((a, b) => a.arcana.localeCompare(b.arcana));
        }

        const selectedElement = elementSelect.value;
        const selectedType = resistanceTypeSelect.value;
        if (selectedElement && selectedType) {
            filtered = filtered.filter(p => {
                const resistObj = p.elementResistances ?. [selectedType];
                return resistObj ?.element ?.includes(selectedElement);
            });
        }

        renderPersonas(filtered);
    }

    fetch('P5Strikers.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Netwerkfout bij het ophalen van JSON");
            }
            return response.json();
        })
        .then(data => {
            allPersonas = data;
            renderPersonas(allPersonas);
        })
        .catch(error => {
            console.error("Fout bij het laden van JSON:", error);
        });

    document.getElementById("searchBar").addEventListener("input", applyFilters);
    document.getElementById("sortName").addEventListener("change", applyFilters);
    document.getElementById("sortLevel").addEventListener("change", applyFilters);
    elementSelect.addEventListener("change", applyFilters);
    resistanceTypeSelect.addEventListener("change", applyFilters);
    arcanaCheckboxes.forEach(cb => cb.addEventListener("change", applyFilters));
});