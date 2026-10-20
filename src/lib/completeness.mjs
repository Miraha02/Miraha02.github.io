/**
 * @file    completeness.mjs
 * @brief   Project completeness rules shared by the site (Astro) and the build check script (Node).
 * @details Each project declares an `etat` in projet.json:
 *          - "complet"         : visible, no warning;
 *          - "a-mettre-a-jour" : visible, warning;
 *          - "incomplet"       : hidden, warning.
 *          Independently of the declared state, a project whose texts are not written yet
 *          (a required projet.json field left empty, a `[À COMPLÉTER]` marker left, a missing or
 *          empty description in one language, or a description that breaks the format of
 *          src/lib/description.mjs) is always hidden, so a placeholder can never reach the site.
 *          Optional projet.json fields left empty ("") are simply ignored.
 *          Plain JavaScript with JSDoc so that Node can run it without a build step.
 */

import { isEmptyDescription, parseDescription } from './description.mjs';

/** @typedef {'complet' | 'a-mettre-a-jour' | 'incomplet'} ProjectState */

/** @type {readonly ProjectState[]} */
export const PROJECT_STATES = ['complet', 'a-mettre-a-jour', 'incomplet'];

/** Placeholder written by the project generator: `[À COMPLÉTER]` or `[À COMPLÉTER : hint]`. */
export const TODO_MARKER = '[À COMPLÉTER]';

const MARKER_PATTERN = /\[\s*[AÀ]\s+COMPL[EÉ]TER\b[^\]]*\]/i;

/**
 * @brief  Tells whether a text contains the placeholder marker (accents and case ignored).
 * @param  {string} text Text to inspect.
 * @return {boolean}
 */
export function hasTodoMarker(text) {
  return MARKER_PATTERN.test(text);
}

/**
 * @brief  Collects every string value of a JSON-like value, with its dotted path.
 * @param  {unknown} value Value to walk.
 * @param  {string} [path] Path of `value` (used for recursion).
 * @return {{ path: string; text: string }[]}
 */
export function collectStrings(value, path = '') {
  if (typeof value === 'string') return [{ path, text: value }];
  if (Array.isArray(value)) return value.flatMap((v, i) => collectStrings(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => collectStrings(v, path ? `${path}.${k}` : k));
  }
  return [];
}

/** Required projet.json fields: an empty value hides the project. */
export const REQUIRED_FIELDS = ['titre.fr', 'titre.en', 'moteur', 'langages', 'debut'];

/**
 * @brief  Reads a dotted path in a JSON-like value.
 * @param  {unknown} value Root value.
 * @param  {string} path Dotted path (e.g. "titre.fr").
 * @return {unknown}
 */
function getPath(value, path) {
  return path.split('.').reduce((v, k) => (v && typeof v === 'object' ? /** @type {Record<string, unknown>} */ (v)[k] : undefined), value);
}

/**
 * @brief  Tells whether a value counts as "not filled": missing, blank string, or list of blank strings.
 * @param  {unknown} value Field value.
 * @return {boolean}
 */
export function isBlank(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.every(isBlank);
  return false;
}

/**
 * @brief  Lists the text problems that make a project unpublishable.
 * @param  {{ data: unknown; descriptions: Record<string, string | undefined> }} project
 *         `data`: content of projet.json; `descriptions`: raw content of fr.md / en.md (undefined if the file is missing).
 * @return {string[]} One human-readable message per problem; empty when the texts are complete.
 */
export function findTextIssues({ data, descriptions }) {
  const issues = [];
  for (const field of REQUIRED_FIELDS) {
    if (isBlank(getPath(data, field))) issues.push(`projet.json : « ${field} » vide`);
  }
  for (const { path, text } of collectStrings(data)) {
    if (hasTodoMarker(text)) issues.push(`projet.json : « ${path} » contient ${TODO_MARKER}`);
  }
  for (const [lang, body] of Object.entries(descriptions)) {
    if (body === undefined) {
      issues.push(`${lang}.md manquant`);
      continue;
    }
    const parsed = parseDescription(body);
    for (const error of parsed.errors) issues.push(`${lang}.md ${error}`);
    if (hasTodoMarker(body)) issues.push(`${lang}.md contient ${TODO_MARKER}`);
    else if (!parsed.errors.length && isEmptyDescription(parsed)) issues.push(`${lang}.md : aucun texte`);
  }
  return issues;
}

/**
 * @brief  Lists translated texts filled in one language only (e.g. "duree.fr" set, "duree.en" empty).
 * @param  {unknown} value Content of projet.json.
 * @param  {string} [path] Path of `value` (used for recursion).
 * @return {string[]} One message per half-filled pair.
 */
export function findHalfTranslated(value, path = '') {
  if (Array.isArray(value)) return value.flatMap((v, i) => findHalfTranslated(v, `${path}[${i}]`));
  if (!value || typeof value !== 'object') return [];
  const obj = /** @type {Record<string, unknown>} */ (value);
  const keys = Object.keys(obj);
  if (keys.length === 2 && 'fr' in obj && 'en' in obj) {
    const fr = isBlank(obj.fr);
    const en = isBlank(obj.en);
    if (fr !== en) return [`projet.json : « ${path}.${fr ? 'fr' : 'en'} » vide alors que « ${path}.${fr ? 'en' : 'fr'} » est rempli`];
    return [];
  }
  return keys.flatMap((k) => findHalfTranslated(obj[k], path ? `${path}.${k}` : k));
}

/**
 * @brief  Lists the problems that do not hide a project but call for an update.
 * @param  {{
 *           mediaCount: number;
 *           imageNames: string[];
 *           couverture?: string;
 *           liens: { url?: string }[];
 *           data?: unknown;
 *         }} project
 *         `mediaCount`: images + GIFs + videos + YouTube entries with an id; `imageNames`: files of
 *         image/; `liens`: entries of projet.json (those without url are ignored); `data`: whole
 *         projet.json, checked for half-translated texts.
 * @return {string[]}
 */
export function findUpdateIssues({ mediaCount, imageNames, couverture, liens, data }) {
  const issues = [];
  if (mediaCount === 0) issues.push('aucun média (image, GIF, vidéo ou YouTube)');
  if (couverture && !imageNames.includes(couverture)) issues.push(`couverture « ${couverture} » introuvable dans image/`);
  if (!liens.some((l) => !isBlank(l.url))) issues.push('aucun lien (code, build ou version jouable)');
  if (data !== undefined) issues.push(...findHalfTranslated(data));
  return issues;
}

/**
 * @brief  Decides whether a project appears on the site.
 * @param  {ProjectState} state      Declared state.
 * @param  {string[]}     textIssues Result of findTextIssues().
 * @return {boolean}
 */
export function isVisible(state, textIssues) {
  return state !== 'incomplet' && textIssues.length === 0;
}
