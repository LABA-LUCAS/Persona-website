document.addEventListener("DOMContentLoaded", () => {
    const arcanaTypes = [
        "Fool", "Magician", "Priestess", "Empress", "Emperor", "Hierophant",
        "Lovers", "Chariot", "Justice", "Hermit", "Fortune", "Strength",
        "Hanged Man", "Death", "Temperance", "Devil", "Tower", "Star",
        "Moon", "Sun", "Judgment"
    ];

    const filterOptions = document.getElementById('filterOptions');
    const arcanaFilter = document.getElementById("arcanaFilter");

    let renderArcanaCheckboxes = [];

    arcanaTypes.forEach(type => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" value="${type}" checked /> ${type}`;
        arcanaFilter.appendChild(label);
        renderArcanaCheckboxes.push(label.querySelector("input"));
    });

    const elementSelect = document.getElementById('elementType');
    const resistanceTypeSelect = document.getElementById('resistanceType');
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');
    const filterToggle = document.getElementById('filterToggle');
    const searchBar = document.getElementById('searchBar');
    const personaListEl = document.getElementById('personaList');
    const countNumber = document.getElementById('countNumber');
    const sortNameSelect = document.getElementById('sortName');
    const sortLevelSelect = document.getElementById('sortLevel');


    let allPersonas = [];

    function renderPersonas(personas) {
        const personaListEl = document.getElementById('personaList');
        const countNumber = document.getElementById('countNumber');

        personaListEl.innerHTML = '';

        if (!personas || personas.length === 0) {
            personaListEl.innerHTML = '<div class="no-results">Geen persona\'s gevonden.</div>';
            countNumber.textContent = '0';
            return;
        }

        countNumber.textContent = String(personas.length);

        personas.forEach(p => {
            const card = document.createElement('div');
            card.classList.add('persona-card');

            const img = document.createElement('img');

            let imagePath = p.image || p.img || p.icon || '';

            if (!imagePath || imagePath.startsWith('http')) {} else {
                if (imagePath.startsWith('./')) {
                    imagePath = imagePath.substring(2);
                }
            }

            const finalImagePath = imagePath || `MEDIA/placeholderPersona.png`;
            img.src = finalImagePath;
            img.alt = p.name || 'persona image';

            img.onerror = () => {
                img.src = `MEDIA/placeholderPersona.png`;
            };

            const info = document.createElement('div');
            info.classList.add('info');

            const nameEl = document.createElement('div');
            nameEl.classList.add('name');
            nameEl.textContent = p.name || 'Unknown';

            const metaEl = document.createElement('div');
            metaEl.classList.add('meta');
            metaEl.textContent = `Arcana: ${p.arcana || '—'} • Level: ${p.level ?? '—'} `;

            info.appendChild(nameEl);
            info.appendChild(metaEl);

            card.appendChild(img);
            card.appendChild(info);

            card.addEventListener('click', () => {
                const personaId = encodeURIComponent(p.id);
                window.location.href = `personaSpecific.html?id=${personaId}`;
            });

            personaListEl.appendChild(card);
        });
    }

    function applyFilters() {
        let filtered = [...allPersonas];

        const searchTerm = searchBar.value.trim().toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(p => (p.name || '').toLowerCase().includes(searchTerm));
        }

        const selectedArcana = renderArcanaCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
        if (selectedArcana.length > 0 && selectedArcana.length < renderArcanaCheckboxes.length) {
            filtered = filtered.filter(p => selectedArcana.includes(p.arcana));
        }

        const selectResistance = resistanceTypeSelect.value;
        const selectElement = elementSelect.value;

        if (selectResistance && selectElement) {
            filtered = filtered.filter(p => {
                const resistObj = p.elementResistances || p.resistances || p.elementResistance;

                if (!resistObj || !resistObj[selectResistance]) return false;

                const arr = resistObj[selectResistance];
                return Array.isArray(arr) && arr.map(x => String(x).toLowerCase()).includes(selectElement.toLowerCase());
            });
        }

        const nameSort = sortNameSelect.value;
        const levelSort = sortLevelSelect.value;

        if (levelSort && levelSort !== 'none') {
            filtered.sort((a, b) => (Number(a.level) || 0) - (Number(b.level) || 0));
            if (levelSort === 'desc') filtered.reverse();
        }

        if (nameSort && nameSort !== 'none') {
            filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            if (nameSort === 'desc') filtered.reverse();
        }

        renderPersonas(filtered);
    }

    function resetFilters() {
        searchBar.value = '';
        sortNameSelect.value = 'none';
        sortLevelSelect.value = 'none';
        resistanceTypeSelect.value = '';
        elementSelect.value = '';
        renderArcanaCheckboxes.forEach(cb => cb.checked = true);
        renderPersonas(allPersonas);
    }

    filterToggle.addEventListener('click', () => {
        filterOptions.classList.toggle('hidden');
    });

    applyBtn.addEventListener('click', applyFilters);
    resetBtn.addEventListener('click', resetFilters);
    searchBar.addEventListener('input', applyFilters);
    // sortNameSelect hoort direct te filteren maar de filters moeten nog wat getuned worden
    sortNameSelect.addEventListener('change', applyFilters);
    sortLevelSelect.addEventListener('change', applyFilters);
    renderArcanaCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));

    // Alleen filteren als Resistance en Element allebei zijn geselecteerd
    resistanceTypeSelect.addEventListener('change', () => {
        if (elementSelect.value) applyFilters();
    });
    elementSelect.addEventListener('change', () => {
        if (resistanceTypeSelect.value) applyFilters();
    });

    fetch('P5Strikers.json')
        .then(response => {
            if (!response.ok) throw new Error('Netwerkfout bij het ophalen van JSON');
            return response.json();
        })
        .then(data => {
            allPersonas = Array.isArray(data) ? data : (data.personas || []);
            renderPersonas(allPersonas);
        })
        .catch(err => {
            console.error('Fout bij het laden van JSON:', err);
            personaListEl.innerHTML = '<div class="no-results">Kon persona JSON niet laden.</div>';
        });
});