# Portfolio · Hana Delcourt

Site statique construit avec [Astro](https://astro.build) et publié sur GitHub Pages : <https://miraha02.github.io>.

## Prérequis

- Node.js 22.22.0 ou plus récent

## Commandes

| Commande | Rôle |
|---|---|
| `npm install` | Installe les dépendances |
| `npm run dev` | Serveur local avec rechargement : <http://localhost:4321> |
| `npm test` | Tests unitaires (Vitest) |
| `npm run build` | Vérification TypeScript, tests, build, puis contrôle du site généré |
| `npm run preview` | Sert le site construit (`dist/`) en local |

Le déploiement est automatique à chaque push sur `main` (`.github/workflows/deploy.yml`). Il lance `npm run build` : si un test ou un contrôle échoue, rien n'est publié.

## Ajouter ou modifier un projet

1. Créer `src/content/projets/<slug>/` (`<slug>` en minuscules, sans espace : il devient l'adresse `/fr/projets/<slug>/`).
2. Y placer :
   - `projet.json` : données communes (copier celui d'un projet existant ; le schéma est dans `src/content.config.ts`) ;
   - `fr.md` et `en.md` : la description dans chaque langue, en Markdown.
3. Mettre `"publie": false` pour préparer un projet sans le mettre en ligne.
4. `"categorie"` : `principal` (cartes en avant, le premier en grand), `secondaire` ou `archive` ; `"ordre"` règle l'ordre dans la catégorie.

## Ajouter des médias

Déposer les fichiers dans `src/assets/projets/<slug>/` :

| Dossier | Formats | Traitement |
|---|---|---|
| `image/` | png, jpg, webp, avif | Redimensionnées et converties automatiquement |
| `gif/` | gif | Copiés tels quels |
| `video/` | mp4, webm | Copiées telles quelles (garder des fichiers courts et légers) |

Aucune déclaration à faire : les médias sont détectés au build. Ordre d'affichage : vidéos, GIF, puis images, par nom de fichier (préfixer `01-`, `02-`… pour imposer un ordre). `"couverture"` dans `projet.json` choisit l'image des cartes.

Vidéos longues : les mettre sur YouTube et ajouter l'identifiant dans `"youtube"` de `projet.json`. Le lecteur ne se charge qu'au clic, via youtube-nocookie.com.

## Autres réglages

- Textes d'interface et ajout d'une langue : `src/i18n/ui.ts` (puis `locales` dans `astro.config.mjs`).
- Présentation (accueil) : `src/content/profil/fr.md` et `en.md`.
- Formation et expériences : `src/content/parcours/*.json`.
- E-mail, GitHub, statistiques GoatCounter : `src/lib/site.ts`.
- CV : déposer `public/cv/CV-Hana-Delcourt-FR.pdf` et `CV-Hana-Delcourt-EN.pdf` ; les boutons apparaissent automatiquement.
- Couleurs et polices : `src/styles/global.css`.

## Mise en ligne (une seule fois)

Dans GitHub : *Settings › Pages › Build and deployment › Source* = **GitHub Actions**.
