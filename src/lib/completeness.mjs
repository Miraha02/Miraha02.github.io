/**
 * @file    completeness.mjs
 * @brief   Project completeness rules shared by the site (Astro) and the build check script (Node).
 * @details Each project declares an `etat` in projet.json:
 *          - "complet"         : visible, no warning;
 *          - "a-mettre-a-jour" : visible, warning;
 *          - "incomplet"       : hidden, warning.
 *          Independently of the declared state, a project whose texts are not written yet
 *          (a `[À COMPLÉTER]` marker left, a missing or empty description in one language, or a
 *          description that breaks the format of src/lib/description.mjs) is always hidden, so a
 *          placeholder can never reach the published site.
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

/**
 * @brief  Lists the text problems that make a project unpublishable.
 * @param  {{ data: unknown; descriptions: Record<string, string | undefined> }} project
 *         `data`: content of projet.json; `descriptions`: raw content of fr.md / en.md (undefined if the file is missing).
 * @return {string[]} One human-readable message per problem; empty when the texts are complete.
 */
export function findTextIssues({ data, descriptions }) {
  const issues = [];
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
 * @brief  Lists the problems that do not hide a project but call for an update.
 * @param  {{
 *           mediaCount: number;
 *           imageNames: string[];
 *           couverture?: string;
 *           liens: unknown[];
 *         }} project
 *         `mediaCount`: images + GIFs + videos + YouTube entries; `imageNames`: files of image/.
 * @return {string[]}
 */
export function findUpdateIssues({ mediaCount, imageNames, couverture, liens }) {
  const issues = [];
  if (mediaCount === 0) issues.push('aucun média (image, GIF, vidéo ou YouTube)');
  if (couverture && !imageNames.includes(couverture)) issues.push(`couverture « ${couverture} » introuvable dans image/`);
  if (liens.length === 0) issues.push('aucun lien (code, build ou version jouable)');
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
