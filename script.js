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
        // Créer le lien qui englobe toute la div du projet
        const link = document.createElement("a");
        link.href = lienGit;
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
        title.textContent = nom;

        // Créer le conteneur pour l'image et la description
        const contentDiv = document.createElement("div");
        contentDiv.className = "project-content";

        // Ajouter l'image
        const img = document.createElement("img");
        img.src = "assets/" + lienImage;
        img.alt = nom;
        img.className = "project-image";

        // Ajouter la description
        const desc = document.createElement("p");
        desc.textContent = description;

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



smoothScroll();
afficherProjets(projets);