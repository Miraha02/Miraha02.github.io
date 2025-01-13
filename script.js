const projets = [
    {
        nom : "MMO (En cours)",
        lienGit : "https://github.com/Miraha02/MMOAT",
        lienImage : "assets/MMOAT.png",
        desc : "Projet de MMO réalisé en binôme sur Unreal Engine 5 en tant que projet de Master 2 pour le premier et deuxième semetre. Il implémente un système d'inventaire et une gestion des sorts dynamique à l'aide du GAS (Gameplay Ability System) de Unreal Engine. Un système de pêche va prochainement être implémenté ainsi qu'une amélioration de la structure du projet.\
        (Tous les assets ne sont pas présents dans le dépôt github pour des économies d'espaces disque)"
    },
    {
        nom : "Application android qui indique les différentes maraudes présente dans la région",
        lienImage : "assets/mandelaApp.png",
        desc : "Application réalisé dans le cadre de mon stage de Licence 3. Elle à été réalisé en même temps qu'un site internet. Elle permettait d'enregistrer les différentes maraudes présentes dans la région après avoir été accepté par un membre de l'association \"Les Amis de Mandela\" basé à l'AFERTES d'Avion. Elle implémentait un système de compte pour les acteurs désirant proposer leurs maraudes sur l'application."
    },
    {
        nom : "Sokoban",
        lienGit : "https://github.com/Miraha02/ihmprojet-Hana/tree/master",
        lienImage : "assets/sokoban.png",
        desc : "Premier projet de jeu vidéo réalisé en Python dans le cadre de ma première année de DUT, ce Sokoban propose une version revisitée du jeu classique. Les joueurs doivent compléter trois niveaux successifs, chacun devenant accessible une fois le précédent terminé. Une fonction de réinitialisation permet de rebloquer l'accès aux niveaux, ajoutant un élément de flexibilité et de défi."
    }
];

// Tableau contenant les informations sur le parcours
const educationData = [
    {
        image: "assets/jeanPerrin.JPG", // Remplacez par l'URL de votre image
        school: "Faculté des Sciences Jean Perrin",
        startYear: 2023,
        endYear: "Aujourd'hui",
        degree: "Master Informatique - Parcours Ingénierie Logicielle des Jeux"
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