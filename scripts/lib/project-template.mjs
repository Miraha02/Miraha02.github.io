/**
 * @file    project-template.mjs
 * @brief   Pure helpers of the project generator: slug, default files, folder layout.
 * @details Kept free of file-system access so that they can be unit tested.
 *          A generated project is always declared "incomplet" and contains
 *          `[À COMPLÉTER]` markers: it stays hidden until Hana fills it in.
 */
import { TODO_MARKER } from '../../src/lib/completeness.mjs';

/** Media sub-folders created for each project. */
export const MEDIA_KINDS = ['image', 'gif', 'video'];

/** Category given to a new project (can be changed in projet.json). */
export const DEFAULT_CATEGORY = 'secondaire';

/**
 * @brief  Turns a project name into a URL slug: lowercase ASCII, words joined by hyphens.
 * @param  {string} name Name typed on the command line (e.g. "Mon_Projet Été").
 * @return {string} Slug (e.g. "mon-projet-ete"); empty string when nothing usable remains.
 */
export function toSlug(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * @brief  Turns a command-line name into a display title ("Mon_Projet" -> "Mon Projet").
 * @param  {string} name Raw name.
 * @return {string}
 */
export function toTitle(name) {
  return name.replace(/_+/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * @brief  Builds the default projet.json content.
 * @param  {{ name: string; ordre: number; today?: Date }} options
 *         `ordre`: position in the default category; `today`: start date (current month by default).
 * @return {Record<string, unknown>}
 */
export function buildProjectJson({ name, ordre, today = new Date() }) {
  const title = toTitle(name);
  const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  return {
    ordre,
    categorie: DEFAULT_CATEGORY,
    etat: 'incomplet',
    titre: { fr: title, en: title },
    accroche: { fr: `${TODO_MARKER} accroche courte`, en: `${TODO_MARKER} short tagline` },
    moteur: TODO_MARKER,
    langages: [TODO_MARKER],
    equipe: 1,
    debut: month,
    enCours: true,
    liens: [],
    youtube: [],
    code: [],
  };
}

/**
 * @brief  Builds every file of a new project, as paths relative to the repository root.
 * @param  {{ name: string; slug: string; ordre: number; today?: Date }} options
 * @return {{ path: string; content: string }[]}
 */
export function buildProjectFiles({ name, slug, ordre, today }) {
  const content = `src/content/projets/${slug}`;
  const assets = `src/assets/projets/${slug}`;
  return [
    { path: `${content}/projet.json`, content: `${JSON.stringify(buildProjectJson({ name, ordre, today }), null, 2)}\n` },
    { path: `${content}/fr.md`, content: `${TODO_MARKER} description en français\n` },
    { path: `${content}/en.md`, content: `${TODO_MARKER} English description\n` },
    ...MEDIA_KINDS.map((kind) => ({ path: `${assets}/${kind}/.gitkeep`, content: '' })),
  ];
}

/**
 * @brief  Next free `ordre` in a category.
 * @param  {{ categorie: string; ordre: number }[]} projects Existing projects.
 * @param  {string} [categorie] Category (default: DEFAULT_CATEGORY).
 * @return {number}
 */
export function nextOrder(projects, categorie = DEFAULT_CATEGORY) {
  const orders = projects.filter((p) => p.categorie === categorie).map((p) => p.ordre);
  return orders.length ? Math.max(...orders) + 1 : 1;
}
