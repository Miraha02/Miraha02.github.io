const projets = [
    {
        nom : "MMO (En cours)",
        lienGit : "https://github.com/Miraha02/MMOAT",
        lienImage : "assets/MMOAT.png",
        desc : "Projet de MMO réalisé en binôme sur Unreal Engine 5 en tant que projet de Master 2 pour le premier et deuxième semetre. Il implémente un système d'inventaire et une gestion des sorts dynamique à l'aide du GAS (Gameplay Ability System) de Unreal Engine. Un système de pêche va prochainement être implémenté ainsi qu'une amélioration de la structure du projet.\
        (Tous les assets ne sont pas présents dans le dépôt github pour des économies d'espace disque)"
    },
    {
        nom : "Librairie de pilotage pour IA",
        lienGit : "https://drive.google.com/drive/folders/1qLOS4fmYUd-EfaoaE3n3brSwwo5OTjpA?hl=fr",
        lienImage : "assets/steering.png",
        desc : "Projet d'implémentation d'une bibliothèque de \"Steering Behaviors\" sur Unreal Engine 5, simulant des comportements de déplacement pour une IA sous forme de cône. L'IA peut poursuivre, fuir, suivre un chemin ou s'arrêter progressivement, avec des cibles dynamiques et des contrôles interactifs. Le projet à été réalisé pour la prmière partie du deuxième semestre de Master 2."
    },
    {
        nom : "Éditeur de Point&Click",
        lienImage : "assets/PointAndClick.png",
        desc : "Projet réalisé en trinôme sur Unity en tant que projet de Master 1 pour le premier semestre. Il s'agit d'un éditeur de jeu de type Point&Click où l'utilisateur peut créer son propre jeu en plaçant des objets et en créant des interactions entre eux. Le projet permet la création et la lecture de jeux personnalisés grâce à une structure de données en JSON, ainqi qu'un éditeur intuitif pour concevoir personnages, objets, dialogues et quêtes. Il a été implémenté collaborativement via Plastic SCM"
    },
    {
        nom : "Pachinko Unity",
        lienGit : "https://play.unity.com/fr/games/8f4ad9a4-d96d-46af-a4df-53fcf1327cdf/pachinkov3",
        lienImage : "assets/pachinko.png",
        desc : "Projet réalisé lors de ma formation en ligne sur Unity durant le parcours Unity Essentials. Il s'agit d'un jeu de Pachinko où le joueur doit faire apparaître une bille en haut d'un plateau pour obtenir un maximum de points. Le jeu est composé d'un système de score et est jouable en ligne."
    },
    {
        nom : "Application android qui indique les différentes maraudes présentes dans la région",
        lienImage : "assets/mandelaApp.png",
        desc : "Application réalisée dans le cadre de mon stage de Licence 3. Elle a été réalisée en même temps qu'un site internet. Elle permettait d'enregistrer les différentes maraudes présentes dans la région à condition d'être acceptées par un membre de l'association \"Les Amis de Mandela\" basée à l'AFERTES d'Avion. Elle implémentait un système de compte pour les partenaires désirant proposer leurs maraudes sur l'application. Le projet a été abandonné par la suite."
    },
    {
        nom : "Sokoban",
        lienGit : "https://github.com/Miraha02/ihmprojet-Hana/tree/master",
        lienImage : "assets/sokoban.png",
        desc : "Premier projet de jeu vidéo réalisé en Python dans le cadre de ma première année de DUT, ce Sokoban propose une version revisitée du jeu classique. Les joueurs doivent compléter trois niveaux successifs, et chaque niveau ne devient accessible qu'une fois le précédent terminé. Une fonction de réinitialisation permet de bloquer de nouveau l'accès aux niveaux, ce qui ajoute un élément de flexibilité et de défi."
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
        const link = document.createElement("a");
        link.href = projet.lienGit;
        link.target = "_blank"; // Ouvrir le lien dans un nouvel onglet
        link.className = "project-link"; // Ajouter une classe pour styliser

        // Créer une div pour chaque projet
        const projectDiv = document.createElement("div");
        projectDiv.className = "project";

        // Alterne la classe pour chaque projet
        const isEven = index % 2 === 0;
        projectDiv.classList.add(isEven ? "left-align" : "right-align");

        // Créer le titre du projet
        const title = document.createElement("h3");
        title.textContent = projet.nom;

        // Créer le conteneur pour l'image et la description
        const contentDiv = document.createElement("div");
        contentDiv.className = "project-content";

        // Ajouter l'image
        const img = document.createElement("img");
        img.src = projet.lienImage;
        img.alt = projet.nom;
        img.className = "project-image";

        // Ajouter la description
        const desc = document.createElement("p");
        desc.textContent = projet.desc;

        // Ajouter les éléments dans l'ordre souhaité en fonction de `isEven`
        contentDiv.appendChild(img); // Ajouter l'image dans le conteneur
        if (isEven) {
            contentDiv.appendChild(desc); // Ajouter la description pour la disposition alternée
        } else {
            contentDiv.insertBefore(desc, img); // Inverser l'ordre pour l'alternance
        }

        // Ajouter les éléments au projet
        projectDiv.appendChild(title); // Ajouter le titre en haut
        projectDiv.appendChild(contentDiv); // Ajouter le conteneur d'image et description

         // Si le projet a un lien, encapsuler dans un lien <a>
         if (projet.lienGit) {
            const link = document.createElement("a");
            link.href = projet.lienGit;
            link.target = "_blank"; // Ouvrir le lien dans un nouvel onglet
            link.className = "project-link"; // Ajouter une classe pour styliser
            link.appendChild(projectDiv);
            section.appendChild(link);
        } else {
            // Sinon, ajouter directement la div non cliquable
            section.appendChild(projectDiv);
        }
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