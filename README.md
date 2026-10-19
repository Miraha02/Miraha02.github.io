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

### Créer un projet

```bash
./newProject Nom_du_projet        # Git Bash, Linux, macOS
npm run new -- Nom_du_projet      # n'importe quel terminal
```

La commande crée :

- `src/content/projets/<slug>/projet.json`, `fr.md`, `en.md` ;
- `src/assets/projets/<slug>/image/`, `gif/`, `video/`.

`<slug>` est tiré du nom (`Mon_Projet` donne `mon-projet`) et devient l'adresse `/fr/projets/<slug>/`. La commande refuse un nom déjà utilisé. Le projet est créé en `"etat": "incomplet"` avec des marqueurs `[À COMPLÉTER]` : il reste masqué tant qu'il n'est pas rempli.

### Remplir un projet

- `projet.json` : données communes (le schéma est dans `src/content.config.ts`).
- `fr.md` et `en.md` : la description dans chaque langue, en Markdown.
- `"categorie"` : `principal` (cartes en avant, le premier en grand), `secondaire` ou `archive` ; `"ordre"` règle l'ordre dans la catégorie.

### État d'un projet

`"etat"` est obligatoire et se règle à la main :

| État | Sur le site | Au build |
|---|---|---|
| `complet` | Visible | Rien, sauf si un critère « à mettre à jour » est détecté |
| `a-mettre-a-jour` | Visible | Avertissement |
| `incomplet` | Masqué | Avertissement |

Contrôles automatiques (`npm run check:projects`, lancé aussi à la fin de `npm run build`) :

- **Textes à compléter** : un `[À COMPLÉTER]` restant, ou un `fr.md` / `en.md` absent ou vide. Le projet est **masqué quel que soit son état déclaré**. S'il était déclaré visible, une erreur est signalée.
- **À mettre à jour** : aucun média, `couverture` introuvable, aucun lien, fichier de `code` sans `url`.

Ces contrôles ne bloquent jamais le build. Sur GitHub, chaque problème apparaît comme une annotation dans l'onglet *Actions*, avec un tableau récapitulatif dans le résumé du job. Le workflow `check.yml` lance le même build sur toutes les branches sauf `main`, sans publier.

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
