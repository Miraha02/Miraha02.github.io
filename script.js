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

        // Alterne la classe pour chaque projet
        const isEven = index % 2 === 0;
        projectDiv.classList.add(isEven ? "left-align" : "right-align");

        // Créer le titre du projet
        const title = document.createElement("h3");
        title.textContent = nom;

        // Créer le lien avec l'image
        const link = document.createElement("a");
        link.href = lienGit;
        link.target = "_blank"; // Ouvrir le lien dans un nouvel onglet

        const img = document.createElement("img");
        img.src = "assets/"+lienImage;
        img.alt = nom;
        img.className = "project-image";

        // Ajouter l'image au lien, puis le lien à la div
        link.appendChild(img);

        // Créer la description
        const desc = document.createElement("p");
        desc.textContent = description;

        // Ajouter les éléments dans l'ordre souhaité en fonction de `isEven`
        if (isEven) {
            projectDiv.appendChild(link); // Image à gauche
            projectDiv.appendChild(title);
            projectDiv.appendChild(desc);
        } else {
            projectDiv.appendChild(title);
            projectDiv.appendChild(desc);
            projectDiv.appendChild(link); // Image à droite
        }

        // Ajouter le projet à la section
        section.appendChild(projectDiv);
    });
}


smoothScroll();
afficherProjets(projets);