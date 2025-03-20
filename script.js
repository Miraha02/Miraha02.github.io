const projets = [
    {
        nom : "MMO (En cours)",
        lienGit : "https://github.com/Miraha02/MMOAT",
        lienBuild : "",
        lienAutre : "",
        lienImage : "assets/MMOAT.png",
        desc : "Projet de MMO réalisé en binôme sur Unreal Engine 5 en tant que projet de Master 2 pour le premier et deuxième semetre. Il implémente un système d'inventaire et une gestion des sorts dynamique à l'aide du GAS (Gameplay Ability System) de Unreal Engine. Un système de pêche va prochainement être implémenté ainsi qu'une amélioration de la structure du projet.\
        (Tous les assets ne sont pas présents dans le dépôt github pour des économies d'espace disque)",
        nbPersonnes: 2,
        envDev: "Unreal Engine 5",
        langage: "c++, blueprint",
        dateDebut: "Septembre 2024",
        dateFin: "En cours"
    },
    {
        nom : "Librairie de pilotage pour IA",
        lienGit : "https://drive.google.com/drive/folders/1qLOS4fmYUd-EfaoaE3n3brSwwo5OTjpA?hl=fr",
        lienBuild : "",
        lienAutre : "",
        lienImage : "assets/steering.png",
        desc : "Projet d'implémentation d'une bibliothèque de \"Steering Behaviors\" sur Unreal Engine 5, simulant des comportements de déplacement pour une IA sous forme de cône. L'IA peut poursuivre, fuir, suivre un chemin ou s'arrêter progressivement, avec des cibles dynamiques et des contrôles interactifs. Le projet à été réalisé pour la première partie du deuxième semestre de Master 2.",
        nbPersonnes: 2,
        envDev: "",
        langage: "",
        dateDebut: "",
        dateFin: ""
    },
    {
        nom : "Éditeur de Point&Click",
        lienGit : "",
        lienBuild : "",
        lienAutre : "",
        lienImage : "assets/PointAndClick.png",
        desc : "Projet réalisé en trinôme sur Unity en tant que projet de Master 1 pour le premier semestre. Il s'agit d'un éditeur de jeu de type Point&Click où l'utilisateur peut créer son propre jeu en plaçant des objets et en créant des interactions entre eux. Le projet permet la création et la lecture de jeux personnalisés grâce à une structure de données en JSON, ainqi qu'un éditeur intuitif pour concevoir personnages, objets, dialogues et quêtes. Il a été implémenté collaborativement via Plastic SCM",
        nbPersonnes: 2,
        envDev: "",
        langage: "",
        dateDebut: "",
        dateFin: ""
    },
    {
        nom : "Pachinko Unity",
        lienGit : "https://play.unity.com/fr/games/8f4ad9a4-d96d-46af-a4df-53fcf1327cdf/pachinkov3",
        lienBuild : "",
        lienAutre : "",
        lienImage : "assets/pachinko.png",
        desc : "Projet réalisé lors de ma formation en ligne sur Unity durant le parcours Unity Essentials. Il s'agit d'un jeu de Pachinko où le joueur doit faire apparaître une bille en haut d'un plateau pour obtenir un maximum de points. Le jeu est composé d'un système de score et est jouable en ligne.",
        nbPersonnes: 2,
        envDev: "",
        langage: "",
        dateDebut: "",
        dateFin: ""
    },
    {
        nom : "Application android qui indique les différentes maraudes présentes dans la région",
        lienGit : "",
        lienBuild : "",
        lienAutre : "",
        lienImage : "assets/mandelaApp.png",
        desc : "Application réalisée dans le cadre de mon stage de Licence 3. Elle a été réalisée en même temps qu'un site internet. Elle permettait d'enregistrer les différentes maraudes présentes dans la région à condition d'être acceptées par un membre de l'association \"Les Amis de Mandela\" basée à l'AFERTES d'Avion. Elle implémentait un système de compte pour les partenaires désirant proposer leurs maraudes sur l'application. Le projet a été abandonné par la suite.",
        nbPersonnes: 2,
        envDev: "",
        langage: "",
        dateDebut: "",
        dateFin: ""
    },
    {
        nom : "Sokoban",
        lienGit : "https://github.com/Miraha02/ihmprojet-Hana/tree/master",
        lienBuild : "",
        lienAutre : "",
        lienImage : "assets/sokoban.png",
        desc : "Premier projet de jeu vidéo réalisé en Python dans le cadre de ma première année de DUT, ce Sokoban propose une version revisitée du jeu classique. Les joueurs doivent compléter trois niveaux successifs, et chaque niveau ne devient accessible qu'une fois le précédent terminé. Une fonction de réinitialisation permet de bloquer de nouveau l'accès aux niveaux, ce qui ajoute un élément de flexibilité et de défi.",
        nbPersonnes: 2,
        envDev: "",
        langage: "",
        dateDebut: "",
        dateFin: ""
    }
];

// Tableau contenant les informations sur le parcours
const educationData = [
    {
        image: "assets/jeanPerrin.JPG", // Remplacez par l'URL de votre image
        school: "Faculté des Sciences Jean Perrin",
        startYear: 2023,
        endYear: "Aujourd'hui",
        degree: "Master Informatique - Parcours Ingénierie Logicielle pour les Jeux"
    },
    {
        image: "assets/jeanPerrin.JPG", // Remplacez par l'URL de votre image
        school: "Faculté des Sciences Jean Perrin",
        startYear: 2022,
        endYear: 2023,
        degree: "Licence Informatique"
    },
    {
        image: "assets/iut.jpg", // Remplacez par l'URL de votre image
        school: "IUT de Lens",
        startYear: 2020,
        endYear: 2022,
        degree: "DUT Informatique"
    }
];

// Tableau contenant les informations sur les expériences professionnelles
const experienceData = [
    {
        poste: "Développeuse Unity en TER (Travail d'Etude et de Recherche)",
        entreprise: "Faculté des Sciences Jean Perrin",
        date: "Avril 2024 - Juillet 2024",
        description: "Développement d'un éditeur de Point & Click en trinôme afin de se familiariser sur Unity pour le Master 2."
    },
    {
        poste: "Stagiaire Développeuse Android",
        entreprise: "Les Amis de Mandela - AFERTES d'Avion",
        date: "Avril 2023 - Juin 2023",
        description: "Développement d'une application Android liée à un site web, permettant d'enregistrer et de gérer les maraudes dans la région. J'ai aussi pu participer aux activités de l'association et de l'école afin de venir en aide aux personnes en situation de handicap et/ou de précarité. De plus, je me suis impliquée dans la vie administratif de l'association en allant au contact des partenaires et des acteurs locaux et régionaux."
    },
    {
        poste: "Stagiaire au LML (Laboratoire de Mathématiques de Lens)",
        entreprise: "LML - Université d'Artois",
        date: "Avril 2022 - Juillet 2022",
        description: "Développement d'une application IOS permettant de filmer un individu en marche et stocker ses mouvements en JSON. Une visualisation des mouvements est disponible sur un site web et sur l'application. Le but est de filmer des patients afin de déterminer s'il est atteint d'hydrocéphalie, une maladie neurodégénérative que l'on peut diagnostiquer en analysant la démarche du patient. Les données seraient donc ensuite transmises à un modèle de machine learning pour déterminer si le patient est atteint de la maladie."
    },
    {
        poste: "Agent technique aux espaces verts",
        entreprise: "Mairie de Sallaumines",
        date: "Juillet 2019 - Août 2019",
        description: "Entretien des espaces verts de la ville de Sallaumines."
    }
];

function displayExperience() {
    const experienceList = document.getElementById('experience-list');
    
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

function afficherProjets(projets) {
    const section = document.getElementById("project-section");
    
    projets.forEach((projet, index) => {
        const projectDiv = document.createElement("div");
        projectDiv.className = "project";
        const isEven = index % 2 === 0;
        projectDiv.classList.add(isEven ? "left-align" : "right-align");

        const title = document.createElement("h3");
        title.textContent = projet.nom;

        const contentDiv = document.createElement("div");
        contentDiv.className = "project-content";

        const img = document.createElement("img");
        img.src = projet.lienImage;
        img.alt = projet.nom;
        img.className = "project-image";

        // Liste des informations additionnelles
        const infoList = document.createElement("ul");
        infoList.className = "project-info-list";

        const infoFields = {
            "Nombre de personnes": projet.nbPersonnes,
            "Environnement de développement": projet.envDev,
            "Langage": projet.langage,
            "Date de début": projet.dateDebut,
            "Date de fin": projet.dateFin
        };

        for (const [key, value] of Object.entries(infoFields)) {
            if (value) { // On n'affiche que les champs renseignés
                const listItem = document.createElement("li");
                listItem.textContent = `${key} : ${value}`;
                infoList.appendChild(listItem);
            }
        }

        const desc = document.createElement("p");
        desc.textContent = projet.desc;

        contentDiv.appendChild(img);
        if (isEven) {
            contentDiv.appendChild(infoList);
            contentDiv.appendChild(desc);
        } else {
            contentDiv.appendChild(infoList);
            contentDiv.insertBefore(desc, infoList);
        }

        const table = document.createElement("table");
        table.className = "project-links";
        const row = document.createElement("tr");

        if (projet.lienGit) {
            const gitCell = document.createElement("td");
            const gitLink = document.createElement("a");
            gitLink.href = projet.lienGit;
            gitLink.target = "_blank";
            gitLink.innerHTML = "<img src='assets/GitHub.png' alt='GitHub' class='icon'>";
            gitCell.appendChild(gitLink);
            row.appendChild(gitCell);
        }
        if (projet.lienBuild) {
            const buildCell = document.createElement("td");
            const buildLink = document.createElement("a");
            buildLink.href = projet.lienBuild;
            buildLink.target = "_blank";
            buildLink.innerHTML = "<img src='assets/build-icon.png' alt='Build' class='icon'>";
            buildCell.appendChild(buildLink);
            row.appendChild(buildCell);
        }
        if (projet.lienAutre) {
            const otherCell = document.createElement("td");
            const otherLink = document.createElement("a");
            otherLink.href = projet.lienAutre;
            otherLink.target = "_blank";
            otherLink.innerHTML = "<img src='assets/other-icon.png' alt='Autre' class='icon'>";
            otherCell.appendChild(otherLink);
            row.appendChild(otherCell);
        }

        table.appendChild(row);
        projectDiv.appendChild(title);
        projectDiv.appendChild(contentDiv);
        projectDiv.appendChild(table);
        section.appendChild(projectDiv);
    });
}



// Fonction pour générer la section du parcours
function displayEducation() {
    const educationList = document.getElementById('education-list');

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

// Appeler la fonction pour afficher le parcours
displayEducation();


smoothScroll();
afficherProjets(projets);

displayExperience();