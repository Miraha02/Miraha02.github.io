/**
 * @file    project-template.mjs
 * @brief   Pure helpers of the project generator: slug, default files, folder layout.
 * @details Kept free of file-system access so that they can be unit tested.
 *          A generated project is always declared "incomplet" and contains every projet.json
 *          field with an empty value, plus empty text templates in fr.md / en.md: it stays hidden
 *          until Hana fills in the required fields and the texts.
 */
import { DESCRIPTION_TEMPLATE } from '../../src/lib/description.mjs';

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

/** Empty translated text. */
const emptyText = () => ({ fr: '', en: '' });

/**
 * @brief  Empty projet.json fields, in display order; also used to complete existing projects.
 * @return {Record<string, unknown>}
 */
export function emptyProjectFields() {
  return {
    moteur: '',
    langages: [''],
    equipe: 1,
    debut: '',
    fin: '',
    duree: emptyText(),
    systemes: { fr: [''], en: [''] },
    couverture: '',
    liens: [
      { type: 'code', url: '', label: emptyText() },
      { type: 'build', url: '', label: emptyText() },
    ],
    youtube: [{ id: '', titre: emptyText() }],
    code: [{ chemin: '', url: '', note: emptyText() }],
  };
}

/**
 * @brief  Builds the default projet.json content: every field present, empty values to fill in.
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
    ...emptyProjectFields(),
    debut: month,
  };
}

/**
 * @brief  Serialises projet.json for hand editing: one field per line, short objects and lists
 *         of plain values kept on one line (e.g. `"titre": { "fr": "", "en": "" }`).
 * @param  {unknown} value JSON value.
 * @param  {string} [indent] Current indentation (used for recursion).
 * @return {string}
 */
export function formatProjectJson(value, indent = '') {
  const inner = `${indent}  `;
  const flat = (v) => v === null || typeof v !== 'object';
  if (Array.isArray(value)) {
    if (value.every(flat)) return `[${value.map((v) => JSON.stringify(v)).join(', ')}]`;
    return `[\n${value.map((v) => inner + formatProjectJson(v, inner)).join(',\n')}\n${indent}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    const oneLine = `{ ${entries.map(([k, v]) => `${JSON.stringify(k)}: ${formatProjectJson(v, inner)}`).join(', ')} }`;
    if (entries.every(([, v]) => flat(v) || (Array.isArray(v) && v.every(flat))) && oneLine.length <= 100 && indent !== '' && entries.length <= 3) {
      return oneLine;
    }
    return `{\n${entries.map(([k, v]) => `${inner}${JSON.stringify(k)}: ${formatProjectJson(v, inner)}`).join(',\n')}\n${indent}}`;
  }
  return JSON.stringify(value);
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
    { path: `${content}/projet.json`, content: `${formatProjectJson(buildProjectJson({ name, ordre, today }))}\n` },
    { path: `${content}/fr.md`, content: DESCRIPTION_TEMPLATE },
    { path: `${content}/en.md`, content: DESCRIPTION_TEMPLATE },
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
