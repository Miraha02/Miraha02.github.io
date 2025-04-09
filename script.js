const loadJSON = async (url) => {
    const response = await fetch(url);
    return await response.json();
};

async function changerLangue(langue) {
    const traductions = await loadJSON(`data/lang/${langue}.json`);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const cle = el.getAttribute('data-i18n');
        if (traductions[cle]) {
            el.textContent = traductions[cle];
        }
    });

    displayEducation(langue);
    chargerProjets(langue, traductions);
    displayExperience(langue);
}

// set le listener sur le chargement du DOM pour charger les infos relatifs à la langue
window.addEventListener('DOMContentLoaded', () => {
    const lang = getLangFromURL();
    changerLangue(lang); // C'est ici qu'on applique la langue depuis l'URL
    updateFlagIcon(lang);
});

const getLangFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("lang") || "fr";
};

const setLangInURL = (lang) => {
    const params = new URLSearchParams(window.location.search);
    params.set("lang", lang);
    window.location.search = params.toString(); // recharge avec la nouvelle langue
};

async function chargerProjets(langue = 'fr', traductionsFile = {}) {
    const [baseProjets, traductions] = await Promise.all([
        loadJSON('data/projets/projets.base.json'),
        loadJSON(`data/projets/projets.${langue}.json`)
    ]);

    // Convertir le tableau de traductions en un objet où les clés sont les `id` des projets
    const traductionsObj = traductions.reduce((acc, projet) => {
        acc[projet.id] = projet; // Associer chaque `id` à un objet de projet
        return acc;
    }, {});

    // Fusionner les données de base avec les traductions
    const projets = baseProjets.map(p => ({
        ...p,
        ...traductionsObj[p.id] // On ajoute nom/desc à chaque projet par son id
    }));

    afficherProjets(projets, traductionsFile);
}

async function displayExperience(langue = "fr") {
    const experienceList = document.getElementById('experience-list');
    
    const experienceData = await loadJSON(`data/exp/exp.${langue}.json`);

    experienceData.forEach(item => {
        const expContainer = document.createElement('div');
        expContainer.className = 'experience-item';
        
        expContainer.innerHTML = `
            <h3>${item.poste}</h3>
            <p><strong>${item.entreprise}</strong> - ${item.date}</p>
            <p>${item.description}</p>
        `;
        
        experienceList.appendChild(expContainer);
    });
}

// Smooth scroll for navigation links
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function createDiapo(projet, index) {
    const carouselContainer = document.createElement("div");
    carouselContainer.className = "carousel-container";
    carouselContainer.id = `carousel-${index}`;
    carouselContainer.dataset.images = JSON.stringify(projet.lienImages); // 💡 ici !

    const img = document.createElement("img");
    img.src = projet.lienImages[0];
    img.className = "project-image";
    img.dataset.index = 0;

    carouselContainer.appendChild(img);

    if (projet.lienImages.length > 1) {
        const prevButton = document.createElement("button");
        prevButton.className = "carousel-button prev";
        prevButton.innerHTML = "&#9664;";
        prevButton.onclick = () => changeImage(index, -1);

        const nextButton = document.createElement("button");
        nextButton.className = "carousel-button next";
        nextButton.innerHTML = "&#9654;";
        nextButton.onclick = () => changeImage(index, 1);

        carouselContainer.appendChild(prevButton);
        carouselContainer.appendChild(nextButton);
    }

    return carouselContainer;
}


// Fonction pour afficher les projets avec le diaporama
function afficherProjets(projets, traductions) {
    const section = document.getElementById("project-section");
    section.innerHTML = ""; // Nettoyer la section avant d'ajouter les projets
    
    projets.forEach((projet, index) => {
        const projectDiv = document.createElement("div");
        projectDiv.className = "project";

        const title = document.createElement("h3");
        title.textContent = projet.nom;
        
        // Liste des informations du projet
        const infoList = document.createElement("ul");
        infoList.className = "project-info-list";
        const infoFields = {
            [traductions.nbPeople]: projet.nbPersonnes,
            [traductions.devEnv]: projet.envDev,
            [traductions.language]: projet.langage,
            [traductions.startDate]: projet.dateDebut,
            [traductions.endDate]: projet.dateFin
        };
        for (const [key, value] of Object.entries(infoFields)) {
            if (value) {
                const listItem = document.createElement("li");
                listItem.textContent = `${key} : ${value}`;
                infoList.appendChild(listItem);
            }
        }

        // Description du projet
        const desc = document.createElement("p");
        desc.className = "project-description";
        desc.textContent = projet.desc;

        // Création du diaporama
        const carouselContainer = createDiapo(projet, index);

        // Icônes avec liens
        const linkContainer = document.createElement("div");
        linkContainer.className = "project-links";
        const links = [
            { url: projet.lienGit, img: "assets/GitHub.png", alt: "GitHub" },
            { url: projet.lienBuild, img: "assets/build.png", alt: "Build" },
            { url: projet.lienAutre, img: "assets/other-icon.png", alt: "Autre" }
        ];
        links.forEach(link => {
            if (link.url) {
                const a = document.createElement("a");
                a.href = link.url;
                a.target = "_blank";
                const img = document.createElement("img");
                img.src = link.img;
                img.alt = link.alt;
                img.className = "icon";
                a.appendChild(img);
                linkContainer.appendChild(a);
            }
        });

        // Ajout des éléments dans l'ordre demandé
        projectDiv.appendChild(title);
        projectDiv.appendChild(infoList);
        projectDiv.appendChild(desc);
        projectDiv.appendChild(carouselContainer);
        projectDiv.appendChild(linkContainer);
        
        section.appendChild(projectDiv);
    });
}

// Fonction pour changer l'image dans le diaporama
function changeImage(projectIndex, direction) {
    const carousel = document.getElementById(`carousel-${projectIndex}`);
    const img = carousel.querySelector(".project-image");
    const currentIndex = parseInt(img.dataset.index);
    
    const images = JSON.parse(carousel.dataset.images); // 💡 Récupère les images

    const newIndex = (currentIndex + direction + images.length) % images.length;
    img.src = images[newIndex];
    img.dataset.index = newIndex;
}



// Fonction pour générer la section du parcours
async function displayEducation(langue = "fr") {
    const educationList = document.getElementById('education-list');

    const educationData = await loadJSON(`data/etude/etude.${langue}.json`);

    educationData.forEach(item => {
        // Créer un conteneur pour chaque diplôme
        const eduContainer = document.createElement('div');
        eduContainer.className = 'education-item';

        // Créer et ajouter l'image
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.degree;
        img.className = 'education-image';

        // Créer un conteneur pour les informations
        const infoContainer = document.createElement('div');
        infoContainer.className = 'education-info';

        // Ajouter les informations
        infoContainer.innerHTML = `
            <h3>${item.degree}</h3>
            <p>${item.startYear} - ${item.endYear}</p>
            <p>${item.school}</p>
        `;

        // Ajouter l'image et les informations au conteneur
        eduContainer.appendChild(img);
        eduContainer.appendChild(infoContainer);
        educationList.appendChild(eduContainer);
    });
}

language = "fr";

document.querySelector("#btn-lang-fr").addEventListener("click", () => setLangInURL("fr"));
document.querySelector("#btn-lang-en").addEventListener("click", () => setLangInURL("en"));


function updateFlagIcon(lang) {
    const currentFlag = document.getElementById("current-flag");
    const flagPath = {
        fr: "assets/flags/fr.png",
        en: "assets/flags/en.png"
        // ajoute d'autres langues ici si besoin
    };
    currentFlag.src = flagPath[lang] || flagPath["fr"];
}

// À chaque clic sur un bouton de langue, met à jour le flag et l’URL
document.querySelectorAll(".dropdown button").forEach(btn => {
    btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        setLangInURL(lang); // Recharge avec la langue
    });
});


smoothScroll();