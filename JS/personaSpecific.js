document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("main");

    const card = document.createElement("div");
    card.classList.add("card");

    const front = document.querySelector(".frontContainer");
    const back = document.querySelector(".backContainer");

    if (front && back) {
        card.appendChild(front);
        card.appendChild(back);
        main.appendChild(card);
    } else {
        console.error("FrontContainer of BackContainer niet gevonden.");
        return;
    }

    card.addEventListener("click", () => {
        card.classList.toggle("flipped");
    });

    const urlParams = new URLSearchParams(window.location.search);
    const personaId = urlParams.get("id");

    if (personaId) {
        fetch('P5Strikers.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Netwerkfout bij het ophalen van JSON, status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const allPersonas = Array.isArray(data) ? data : (data.personas || []);

                const persona = allPersonas.find(p => p.id === Number(personaId));
                if (persona) {
                    buildCard(persona);
                } else {
                    buildDefaultCard(`Persona met ID ${personaId} niet gevonden in JSON`);
                }
            })
            .catch(error => {
                console.error('Fout bij het laden of verwerken van JSON:', error);
                buildDefaultCard("Fetch mislukt of JSON verwerkingsfout");
            });
    } else {
        buildDefaultCard("Geen ID opgegeven");
    }

    function buildCard(p) {
        // FRONT
        document.querySelector(".frontTopCardContainer").innerHTML = `
            <div class="frontTopRow">
                <h2>${p.name}</h2>
                <p class="persona-id">ID: ${p.id}</p>
            </div>
            <div class="frontTopRow details-row">
                <p>Level: ${p.level}</p>
                <p>Arcana: ${p.arcana}</p>
            </div>
        `;

        document.querySelector(".frontMiddleCardContainer1").innerHTML = `
            <img src="${p.image}" alt="${p.name}" class="personaImage">
        `;

        const standardSkills = p.skills.standard
            .flatMap(s => (Array.isArray(s.name) ? s.name : [s.name]))
            .join(", ");

        const learnedSkills = p.skills.learned
            .flatMap(s => (Array.isArray(s.name) ? s.name : [s.name]))
            .join(", ");

        const specialSkills = p.skills.special ?
            p.skills.special.map(s => `${s.name} (Lv.${s.level || "?"})`).join(", ") :
            "None";

        document.querySelector(".frontMiddleCardContainer2").innerHTML = `
            <h3>Skills</h3>
            <p><strong>Standard:</strong> ${standardSkills || "None"}</p>
            <p><strong>Learned:</strong> ${learnedSkills || "None"}</p>
            <p><strong>Special:</strong> ${specialSkills}</p>
        `;

        document.querySelector(".frontBottomCardContainer").innerHTML = `
            <p><strong>Price:</strong> ${p.statistics.price}¥</p>
            <p class="flipHint">Click to flip!</p>
        `;

        // BACK
        document.querySelector(".backTopCardContainer").innerHTML = `
            <h3>Statistics</h3>
            <p>Strength: ${p.statistics.strength}</p>
            <p>Magic: ${p.statistics.magic}</p>
            <p>Endurance: ${p.statistics.endurance}</p>
            <p>Agility: ${p.statistics.agility}</p>
            <p>Luck: ${p.statistics.luck}</p>
        `;

        const backMiddle1 = document.querySelector(".backMiddleCardContainer1");
        if (p.skills.comboSkills && p.skills.comboSkills.length > 0) {
            backMiddle1.innerHTML = `
                <h3>Combo Skills</h3>
                <ul>
                    ${p.skills.comboSkills.map(skill => `
                        <li>
                            <strong>${skill.name}</strong><br>
                            <span class="comboInput">Input: ${skill.input}</span>
                        </li>
                    `).join("")}
                </ul>
            `;
        } else {
            backMiddle1.innerHTML = `
                <h3>Combo Skills</h3><p>None</p>
            `;
        }

        const res = p.elementResistances;
        let resistHTML = "";

        for (const type in res) {
            const el = res[type].element;
            const formatted = Array.isArray(el) ? el.join(", ") : el;
            resistHTML += `<p><strong>${type.toUpperCase()}:</strong> ${formatted}</p>`;
        }

        document.querySelector(".backMiddleCardContainer2").innerHTML = `
            <h3>Element Resistances</h3>
            ${resistHTML}
        `;

        document.querySelector(".backBottomCardContainer").innerHTML = `
            <p class="flipHint">Click to flip back!</p>
        `;

        front.classList.remove("defaultCard");
        back.classList.remove("defaultCard");
    }

    function buildDefaultCard(reason = "Unknown") {
        console.warn("Default card loaded:", reason);

        const placeholder = {
            id: "000",
            name: "Unknown Persona",
            level: 0,
            arcana: "???",
            image: "MEDIA/placeholderPersona.png",
            statistics: {
                price: "N/A",
                strength: "-",
                magic: "-",
                endurance: "-",
                agility: "-",
                luck: "-"
            },
            elementResistances: {
                weak: {
                    element: ["-"]
                },
                resist: {
                    element: ["-"]
                }
            },
            skills: {
                standard: [{
                    name: ["None"]
                }],
                learned: [{
                    name: ["None"]
                }],
                special: [{
                    name: "None",
                    level: "?"
                }],
                comboSkills: [{
                    name: "None",
                    input: "----"
                }]
            }
        };

        buildCard(placeholder);
        front.classList.add("defaultCard");
        back.classList.add("defaultCard");
        document.querySelector(".frontTopCardContainer h2").textContent = "ERROR / DEFAULT";
    }
});