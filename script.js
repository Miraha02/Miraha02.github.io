projets = [["github","https://github.com/Miraha02/Miraha02.github.io","images.png","Une petite description test, pas si petite que ca pcq c'est important d'avoir plein de ligne pour tester les paragraphes assez complets,si le site réagit correctement ou non"],
["github","https://github.com/Miraha02/Miraha02.github.io","images.png","Une petite description test, pas si petite que ca pcq c'est important d'avoir plein de ligne pour tester les paragraphes assez complets,si le site réagit correctement ou non"]];


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

    projets.forEach(([nom, lienGit, lienImage, description], index) => {
        // Créer une div pour chaque projet
        const projectDiv = document.createElement("div");
        projectDiv.className = "project";

        // Créer le titre du projet et le centrer en haut
        const title = document.createElement("h3");
        title.className = "project-title";
        title.textContent = nom;
        projectDiv.appendChild(title);

        // Créer un conteneur pour l'image et la description
        const contentDiv = document.createElement("div");
        contentDiv.className = "project-content";

        // Créer le lien avec l'image
        const link = document.createElement("a");
        link.href = lienGit;
        link.target = "_blank";

        const img = document.createElement("img");
        img.src = "assets/" + lienImage;
        img.alt = nom;
        img.className = "project-image";

        // Ajouter l'image au lien
        link.appendChild(img);

        // Créer la description
        const desc = document.createElement("p");
        desc.className = "project-description";
        desc.textContent = description;

        // Ajouter l'image et la description dans l'ordre basé sur `index`
        if (index % 2 === 0) {
            contentDiv.appendChild(link); // Image à gauche
            contentDiv.appendChild(desc); // Description à droite
        } else {
            contentDiv.appendChild(desc); // Description à gauche
            contentDiv.appendChild(link); // Image à droite
        }

        // Ajouter le conteneur de contenu au projet
        projectDiv.appendChild(contentDiv);

        // Ajouter le projet à la section
        section.appendChild(projectDiv);
    });
}


smoothScroll();
afficherProjets(projets);