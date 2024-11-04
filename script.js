const projets = [
    {
        nom : "github",
        lienGit : "https://github.com/Miraha02/Miraha02.github.io",
        lienImage : "assets/images.png",
        desc : "Une petite description test, pas si petite que ca pcq c'est important d'avoir plein de ligne pour tester les paragraphes assez complets,si le site réagit correctement ou non"
    },
    {
        nom : "github",
        lienGit : "https://github.com/Miraha02/Miraha02.github.io",
        lienImage : "assets/images.png",
        desc : "Une petite description test, pas si petite que ca pcq c'est important d'avoir plein de ligne pour tester les paragraphes assez complets,si le site réagit correctement ou non"
    },
    {
        nom : "Sokoban",
        lienGit : "https://github.com/Miraha02/ihmprojet-Hana/tree/master",
        lienImage : "assets/sokoban.png",
        desc : "Premier projet de jeu vidéo réalisé en Python dans le cadre de ma première année de DUT, ce Sokoban propose une version revisitée du jeu classique. Les joueurs doivent compléter trois niveaux successifs, chacun devenant accessible une fois le précédent terminé. Une fonction de réinitialisation permet de rebloquer l'accès aux noveau, ajoutant un élément de flexibilité et de défi."
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
        // Créer le lien qui englobe toute la div du projet
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

        // Ajouter `projectDiv` à `link`, puis `link` à `section`
        link.appendChild(projectDiv);
        section.appendChild(link);
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
            <h3>${item.school}</h3>
            <p>${item.startYear} - ${item.endYear}</p>
            <p>${item.degree}</p>
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