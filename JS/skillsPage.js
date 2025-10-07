fetch("listOfSkills.json")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("skills-container");

        // Map JSON keys to section classes
        const categoryMap = {
            physical: "physicalSkill",
            gun: "gunSkill",
            fire: "fireSkill",
            ice: "iceSkill",
            wind: "windSkill",
            electricity: "electricitySkill",
            psychic: "psychicSkill",
            nuke: "nukeSkill",
            bless: "blessSkill",
            curse: "curseSkill",
            almighty: "almightySkill",
            ailment: "ailmentSkill",
            recarm: "recarmSkill",
            support: "supportSkill",
            passive: "passiveSkill"
        };

        Object.keys(categoryMap).forEach(category => {
            if (!data[category]) return; // skip if JSON missing category

            const section = document.querySelector(`.${categoryMap[category]}`);
            if (!section) return;

            // Wrapper div
            const wrapper = document.createElement("div");
            wrapper.classList.add("skill-section");

            // Toggle button
            const btn = document.createElement("button");
            btn.classList.add("skill-toggle");
            btn.textContent = category.charAt(0).toUpperCase() + category.slice(1) + " Skills";

            // Table wrapper
            const content = document.createElement("div");
            content.classList.add("skill-content");

            // Table
            const table = document.createElement("table");
            table.classList.add("skill-table");

            // Head
            const thead = document.createElement("thead");
            thead.innerHTML = `
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Cost</th>
          <th>Effect</th>
          <th>Target</th>
          <th>Learned By</th>
          <th>Skill Card</th>
        </tr>
      `;
            table.appendChild(thead);

            // Body
            const tbody = document.createElement("tbody");

            data[category].forEach(skill => {
                const tr = document.createElement("tr");

                // symbol placeholder 
                const symbolTd = document.createElement("td");
                const img = document.createElement("img");
                img.src = `../MEDIA/affinities/${category}.png`;
                img.alt = category + " icon";
                img.classList.add("skill-icon");
                symbolTd.appendChild(img);
                tr.appendChild(symbolTd);

                // Other fields
                tr.innerHTML += `
          <td>${skill.name}</td>
          <td>${skill.cost}</td>
          <td>${skill.effect}</td>
          <td>${skill.target}</td>
          <td>${skill.learned_by ? skill.learned_by.join(", ") : ""}</td>
          <td>${skill.skill_card || ""}</td>
        `;

                tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            content.appendChild(table);
            wrapper.appendChild(btn);
            wrapper.appendChild(content);
            section.appendChild(wrapper);

            // Toggle collapse
            btn.addEventListener("click", () => {
                content.classList.toggle("collapsed");
            });
        });
    })
    .catch(err => console.error("Error loading skills:", err));