/**
 * @file    check-projects.mjs
 * @brief   Reports the completeness state of every project; never fails the build (exit code 0).
 * @details Reads src/content/projets/<slug>/ (projet.json, fr.md, en.md) and
 *          src/assets/projets/<slug>/{image,gif,video}/, then applies the rules of
 *          src/lib/completeness.mjs:
 *          - "complet" with no problem       : silent;
 *          - "complet" with update problems  : warning (declared state does not match);
 *          - "a-mettre-a-jour"               : warning, project visible;
 *          - "incomplet"                     : warning, project hidden;
 *          - texts not written (marker, missing language) while declared visible:
 *            error annotation, project hidden by the site.
 *          Locally: coloured summary. In GitHub Actions: one annotation per project
 *          (::warning / ::error) and a table in the job summary.
 */
import { appendFileSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PROJECT_STATES,
  findTextIssues,
  findUpdateIssues,
  isVisible,
} from '../src/lib/completeness.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT = join(ROOT, 'src/content/projets');
const ASSETS = join(ROOT, 'src/assets/projets');
const LANGS = ['fr', 'en'];
const MEDIA_EXT = {
  image: /\.(png|jpe?g|webp|avif)$/i,
  gif: /\.gif$/i,
  video: /\.(mp4|webm)$/i,
};

/**
 * @brief  Lists the media files of one kind for a project.
 * @param  {string} slug Project folder name.
 * @param  {'image' | 'gif' | 'video'} kind Media sub-folder.
 * @return {string[]} File names.
 */
function listMedia(slug, kind) {
  const dir = join(ASSETS, slug, kind);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => MEDIA_EXT[kind].test(f));
}

/**
 * @brief  Reads a text file, or returns undefined when it does not exist.
 * @param  {string} path Absolute path.
 * @return {string | undefined}
 */
function readOptional(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : undefined;
}

/**
 * @brief  Evaluates one project folder.
 * @param  {string} slug Project folder name.
 * @return {{ slug: string; file: string; state: string; visible: boolean; level: 'ok' | 'warning' | 'error'; title: string; issues: string[] }}
 */
function evaluateProject(slug) {
  const jsonPath = join(CONTENT, slug, 'projet.json');
  const file = relative(ROOT, jsonPath).split('\\').join('/');
  let data;
  try {
    data = JSON.parse(readFileSync(jsonPath, 'utf8'));
  } catch (e) {
    return { slug, file, state: '?', visible: false, level: 'error', title: 'projet.json illisible', issues: [String(e)] };
  }

  const state = data.etat;
  const descriptions = Object.fromEntries(LANGS.map((l) => [l, readOptional(join(CONTENT, slug, `${l}.md`))]));
  const textIssues = findTextIssues({ data, descriptions });
  const images = listMedia(slug, 'image');
  const updateIssues = findUpdateIssues({
    mediaCount: images.length + listMedia(slug, 'gif').length + listMedia(slug, 'video').length + (data.youtube ?? []).length,
    imageNames: images,
    couverture: data.couverture,
    liens: data.liens ?? [],
    code: data.code ?? [],
  });
  const issues = [...textIssues, ...updateIssues];

  if (!PROJECT_STATES.includes(state)) {
    return { slug, file, state: String(state), visible: false, level: 'error', title: `état invalide (attendu : ${PROJECT_STATES.join(', ')})`, issues };
  }
  const visible = isVisible(state, textIssues);
  if (state === 'incomplet') return { slug, file, state, visible, level: 'warning', title: 'incomplet : masqué du site', issues };
  if (textIssues.length) return { slug, file, state, visible, level: 'error', title: `déclaré « ${state} » mais textes à compléter : masqué du site`, issues };
  if (state === 'a-mettre-a-jour') return { slug, file, state, visible, level: 'warning', title: 'à mettre à jour : visible', issues };
  if (updateIssues.length) return { slug, file, state, visible, level: 'warning', title: 'déclaré « complet » mais à mettre à jour : visible', issues };
  return { slug, file, state, visible, level: 'ok', title: 'complet', issues };
}

/**
 * @brief  Escapes a message for a GitHub workflow command.
 * @param  {string} s Raw text.
 * @return {string}
 */
function escapeData(s) {
  return s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

/**
 * @brief  Escapes a workflow command property (file, title).
 * @param  {string} s Raw text.
 * @return {string}
 */
function escapeProperty(s) {
  return escapeData(s).replace(/:/g, '%3A').replace(/,/g, '%2C');
}

/**
 * @brief  Prints the report locally and, in GitHub Actions, as annotations and job summary.
 * @param  {ReturnType<typeof evaluateProject>[]} results Evaluated projects.
 */
function report(results) {
  const ci = process.env.GITHUB_ACTIONS === 'true';
  const color = !ci && process.stdout.isTTY;
  const paint = (code, s) => (color ? `\x1b[${code}m${s}\x1b[0m` : s);
  const style = { ok: (s) => paint('32', s), warning: (s) => paint('33;1', s), error: (s) => paint('31;1', s) };
  const label = { ok: 'OK', warning: 'AVERTISSEMENT', error: 'ERREUR' };

  const flagged = results.filter((r) => r.level !== 'ok');
  console.log('');
  console.log(paint('1', `État des projets : ${results.length} projets, ${results.filter((r) => r.visible).length} visibles, ${flagged.length} à traiter`));
  for (const r of results) {
    console.log(`  ${style[r.level](label[r.level].padEnd(13))} ${r.slug} : ${r.title}`);
    for (const i of r.issues) console.log(`  ${' '.repeat(13)}   - ${i}`);
    if (ci && r.level !== 'ok') {
      const body = r.issues.length ? r.issues.map((i) => `- ${i}`).join('\n') : 'aucun problème détecté automatiquement';
      console.log(`::${r.level} file=${escapeProperty(r.file)},title=${escapeProperty(`${r.slug} : ${r.title}`)}::${escapeData(body)}`);
    }
  }
  console.log('');

  if (ci && process.env.GITHUB_STEP_SUMMARY) {
    const rows = results.map((r) => `| ${label[r.level]} | \`${r.slug}\` | ${r.state} | ${r.visible ? 'oui' : 'non'} | ${r.issues.join('<br>') || '-'} |`);
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      ['## État des projets', '', '| Niveau | Projet | État déclaré | Visible | Problèmes |', '|---|---|---|---|---|', ...rows, ''].join('\n'),
    );
  }
}

/** @brief Entry point: evaluates every project folder, sorted by name. */
function main() {
  const slugs = readdirSync(CONTENT, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort();
  report(slugs.map(evaluateProject));
}

main();
