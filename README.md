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
| `npm run check:projects` | État de chaque projet (visible ou masqué, problèmes détectés), sans build |
| `npm run build` | Vérification TypeScript, tests, build, contrôle du site généré, puis état des projets |
| `npm run preview` | Sert le site construit (`dist/`) en local |
| `./newProject Nom_du_projet` | Crée un projet (voir plus bas) ; équivalent : `npm run new -- Nom_du_projet` |

Le déploiement est automatique à chaque push sur `main` (`.github/workflows/deploy.yml`). Il lance `npm run build` : si un test ou un contrôle échoue, rien n'est publié. L'état des projets ne bloque jamais la publication. Sur les autres branches et les pull requests, `.github/workflows/check.yml` lance le même build sans publier.

## Tester en local

1. **Rendu** : `npm run dev`, puis <http://localhost:4321/fr/>. Le site local applique les mêmes règles de visibilité que le site en ligne. Page d'un projet : `/fr/projets/<slug>/`. Si une modification de `projet.json` ou d'un `.md` n'apparaît pas, relancer le serveur. Un projet masqué pour une erreur de texte est signalé dans le terminal.
2. **État des projets** : `npm run check:projects`, après chaque modification d'un `projet.json` ou d'une description.
3. **Avant un push** : `npm run build`. S'il passe en local, le déploiement passera aussi ; `npm run preview` montre alors le site tel qu'il sera publié.

## Ajouter ou modifier un projet

### Créer un projet

```bash
./newProject Nom_du_projet        # Git Bash, Linux, macOS
npm run new -- Nom_du_projet      # n'importe quel terminal
```

La commande crée :

- `src/content/projets/<slug>/projet.json`, `fr.md`, `en.md` ;
- `src/assets/projets/<slug>/image/`, `gif/`, `video/`.

`<slug>` est tiré du nom (`Mon_Projet` donne `mon-projet`) et devient l'adresse `/fr/projets/<slug>/`. La commande refuse un nom déjà utilisé. Le projet est créé en `"etat": "incomplet"`, avec un `projet.json` qui contient **tous les champs, vides**, et le gabarit de texte vide dans `fr.md` et `en.md` : il reste masqué tant que les champs obligatoires et les textes ne sont pas remplis.

### Remplir `projet.json`

Le fichier créé par la commande contient déjà tous les champs ; il suffit de remplir les valeurs. **Une valeur vide (`""`) est ignorée** : un champ facultatif vide n'apparaît pas sur le site, un champ obligatoire vide masque le projet (signalé par `npm run check:projects`). Le schéma complet est dans `src/content.config.ts`.

```json
{
  "ordre": 5,
  "categorie": "secondaire",
  "etat": "incomplet",
  "titre": { "fr": "Nom du projet", "en": "Project name" },
  "moteur": "",
  "langages": [""],
  "equipe": 1,
  "debut": "2026-10",
  "fin": "",
  "duree": { "fr": "", "en": "" },
  "systemes": { "fr": [""], "en": [""] },
  "couverture": "",
  "liens": [
    { "type": "code",  "url": "", "label": { "fr": "", "en": "" } },
    { "type": "build", "url": "", "label": { "fr": "", "en": "" } }
  ],
  "youtube": [{ "id": "", "titre": { "fr": "", "en": "" } }],
  "code": [{ "chemin": "", "url": "", "note": { "fr": "", "en": "" } }]
}
```

| Champ | Obligatoire | Rôle et affichage | Si vide |
|---|---|---|---|
| `ordre` | Oui | Position dans la catégorie (croissant). Le projet `principal` visible au plus petit `ordre` est la grande carte de l'accueil. | – |
| `categorie` | Oui | `principal` (cartes mises en avant), `secondaire` ou `archive` (bloc replié, page « Tous les projets »). | – |
| `etat` | Oui | `complet`, `a-mettre-a-jour` ou `incomplet` (voir « État d'un projet »). | – |
| `titre` | Oui | Nom du projet, FR et EN : titre de la page, cartes, listes, onglet du navigateur. | Projet masqué |
| `moteur` | Oui | Tuile « Moteur » ; sert aussi aux filtres UE5 / Unity / Autre. Ex. `"Unreal Engine 5.5"`. | Projet masqué |
| `langages` | Oui | Tuile « Langages », une entrée par langage : `["C++", "Blueprint"]`. | Projet masqué |
| `equipe` | Oui | Nombre de personnes : `1` affiche « Solo », `2` « Binôme », plus « Équipe de N ». | – |
| `debut` | Oui | Date de début : `AAAA`, `AAAA-MM` ou `AAAA-MM-JJ`. Sert au tri (du plus récent au plus ancien). | Projet masqué |
| `fin` | Non | Date de fin, même format. | Projet considéré **en cours** : seule la date de début s'affiche, et la grande carte de l'accueil ajoute « En développement » |
| `duree` | Non | Durée lisible, FR et EN : `{ "fr": "3 jours", "en": "3 days" }`. Remplace les dates dans la tuile (les dates passent en dessous). | Tuile « Dates » à la place |
| `systemes` | Non | Tuile « Systèmes clés », une entrée par système, FR et EN. | Tuile absente |
| `couverture` | Non | Nom d'un fichier de `image/` utilisé comme vignette (cartes, listes, partage sur les réseaux). | Première image du dossier |
| `liens` | Non | Boutons sous le titre (voir ci-dessous). | Lien ignoré |
| `youtube` | Non | Vidéos YouTube de la visionneuse : `id` = les 11 caractères après `watch?v=` ou `youtu.be/`, `titre` = libellé FR et EN. | Vidéo ignorée ; sans `titre`, le nom du projet |
| `code` | Non | Section « Code à consulter » (voir ci-dessous). | Ligne ignorée |

**Liens (`liens`)** : un bouton par entrée, dans l'ordre (le premier est mis en avant). Autant d'entrées que nécessaire : pour deux builds, mettre deux entrées `"type": "build"` et les distinguer avec `label`.

| `type` | Icône | Libellé par défaut (si `label` vide) |
|---|---|---|
| `code` | Code | « Code source » / « Source code » |
| `build` | Téléchargement | « Télécharger le build » / « Download build » |
| `play` | Lien externe | « Jouer en ligne » / « Play online » |
| `other` | Lien externe | l'adresse elle-même (remplir `label`) |

**Code à consulter (`code`)** : des fichiers précis à lire, affichés en liste en bas de la page projet, pour guider un recruteur dans un dépôt. Le bouton `liens` de type `code` ouvre le dépôt entier ; `code` pointe vers un fichier et dit ce qu'il montre.

- `chemin` : chemin affiché, ex. `Source/ShadowSteps/AI/ShadowStepAIController.cpp`.
- `url` : lien direct vers le fichier sur GitHub (ouvrir le fichier sur github.com et copier l'adresse).
- `note` : une phrase FR et EN sur ce que montre le fichier (facultatif).
- Une ligne n'apparaît que si `chemin` et `url` sont remplis ; la section entière n'apparaît que si au moins une ligne est complète.

**Ajouter une entrée** (lien, vidéo, fichier de code, système, langage) : copier l'entrée existante, la coller après une virgule, puis la remplir. Les entrées vides peuvent rester.

**Texte traduit rempli dans une seule langue** (ex. `duree.fr` rempli, `duree.en` vide) : avertissement au build, le projet reste visible.

### Remplir les autres fichiers

- `fr.md` et `en.md` : les textes dans chaque langue, au format décrit ci-dessous.
- Bande « Autres projets » de l'accueil (défilement continu, pause au survol, au clavier et par bouton) : tous les autres projets visibles, archives exclues, dans l'ordre des catégories puis de `"ordre"`. Les archives restent visibles sur la page « Tous les projets ».

### Écrire les textes (`fr.md`, `en.md`)

Chaque texte se place entre les accolades d'une balise :

```
[TAGLINE] {Une ligne affichée sous le titre du projet et sur sa carte}

[SECTION] {Titre de la section}
[PARAGRAPH] {Premier paragraphe}
[PARAGRAPH] {Deuxième paragraphe}

[SECTION] {}
[PARAGRAPH] {}
```

| Balise | Affichage | Si rien entre `{}` |
|---|---|---|
| `[TAGLINE]` | Sous le titre de la page projet et sur la carte de l'accueil ; sert aussi de description pour les moteurs de recherche. Une seule par fichier | Ignorée ; la description des moteurs de recherche reprend alors le premier paragraphe |
| `[SECTION]` | Intertitre | Les paragraphes qui suivent s'affichent sans intertitre |
| `[PARAGRAPH]` | Paragraphe | Ignoré |

- Ajouter des sections ou des paragraphes : copier une ligne. Les blocs vides peuvent rester, ils n'apparaissent pas.
- Un texte peut tenir sur plusieurs lignes ; une ligne vide à l'intérieur des `{}` commence un nouveau paragraphe.
- Texte simple : pas de gras ni de lien. Pour écrire `}`, taper `\}` (et `\\` pour `\`).
- Les balises s'écrivent en majuscules ou en minuscules, sans accent.
- Une balise inconnue, une `{` ou une `}` manquante, ou du texte hors des `{}` : le projet est masqué et l'erreur est signalée avec le fichier et le numéro de ligne (`npm run check:projects`, et dans le terminal de `npm run dev`).
- Un fichier dont tous les blocs sont vides compte comme une description absente : le projet est masqué.

Le format est lu par `src/lib/description.mjs` (tests : `tests/description.test.ts`).

### Page « Tous les projets »

`/fr/projects/` et `/en/projects/` listent automatiquement tous les projets visibles, du plus récent au plus ancien (date de `"debut"`), avec leur catégorie. Le lien « Projets » du menu y mène. Filtres par moteur, d'après `"moteur"` : `UE5` (Unreal Engine 5.x), `Unity`, `Autre` (tout le reste). Un filtre sans projet n'est pas affiché. Rien à déclarer : un projet visible y apparaît de lui-même.

### État d'un projet

`"etat"` est obligatoire et se règle à la main :

| État | Sur le site | Au build |
|---|---|---|
| `complet` | Visible | Rien, sauf si un critère « à mettre à jour » est détecté |
| `a-mettre-a-jour` | Visible | Avertissement |
| `incomplet` | Masqué | Avertissement |

Contrôles automatiques (`npm run check:projects`, lancé aussi à la fin de `npm run build`) :

- **Textes à compléter** : un champ obligatoire de `projet.json` vide (`titre`, `moteur`, `langages`, `debut`), un `[À COMPLÉTER]` restant (ancien marqueur, toujours détecté), un `fr.md` / `en.md` absent ou sans aucun texte, ou une erreur de format. Le projet est **masqué quel que soit son état déclaré**. S'il était déclaré visible, une erreur est signalée.
- **À mettre à jour** : aucun média, `couverture` introuvable, aucun lien rempli, un texte traduit rempli dans une seule langue.

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
- Animations : apparition au défilement (classe `reveal`, script dans `src/layouts/Base.astro`), transitions entre pages (`@view-transition` dans `src/styles/global.css`, nom `project-<slug>` partagé entre vignettes et page projet). Toutes sont coupées quand le système demande de réduire les animations.

## Mise en ligne (une seule fois)

Dans GitHub : *Settings › Pages › Build and deployment › Source* = **GitHub Actions**.
