/**
 * @file    verify-dist.mjs
 * @brief   Vérifie le site construit (dist/) avant publication ; code de sortie 1 en cas d'erreur.
 * @details Contrôles :
 *          - chaque page : <html lang>, <title>, meta description, canonical, og:title ;
 *          - liens et ressources internes (href, src, srcset) : le fichier cible existe ;
 *          - chaque <img> a un attribut alt (vide autorisé pour les images décoratives) ;
 *          - aucune trace de Google Analytics / Tag Manager ;
 *          - mêmes pages en français et en anglais ;
 *          - limites GitHub Pages : site ≤ 1 Go, aucun fichier ≥ 100 Mio.
 *          Les liens externes ne sont pas testés (dépendent du réseau).
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const errors = [];
const fail = (msg) => errors.push(msg);

/** @brief Liste récursive des fichiers d'un dossier. */
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}

/** @brief Résout un chemin d'URL interne vers un fichier de dist/, ou null. */
function resolveInternal(url) {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  if (!clean.startsWith('/')) return null;
  const candidates = clean.endsWith('/') ? [join(DIST, clean, 'index.html')] : [join(DIST, clean), join(DIST, clean, 'index.html')];
  return candidates.find((p) => existsSync(p)) ?? null;
}

if (!existsSync(DIST)) {
  console.error('dist/ introuvable : lancer « astro build » avant ce script.');
  process.exit(1);
}

const files = walk(DIST);
const pages = files.filter((f) => f.endsWith('.html'));
let totalSize = 0;

for (const f of files) {
  const size = statSync(f).size;
  totalSize += size;
  if (size >= 100 * 1024 * 1024) fail(`Fichier trop lourd pour GitHub (≥ 100 Mio) : ${relative(DIST, f)}`);
}
if (totalSize > 1024 ** 3) fail(`Site trop lourd pour GitHub Pages : ${(totalSize / 1024 ** 2).toFixed(0)} Mo (> 1 Go)`);

for (const page of pages) {
  const rel = relative(DIST, page).split(sep).join('/');
  const html = readFileSync(page, 'utf8');
  const isRedirect = /http-equiv="refresh"/.test(html);

  if (!/<html[^>]*\slang="(fr|en)"/.test(html)) fail(`${rel} : attribut lang manquant ou invalide`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${rel} : <title> manquant`);
  if (!isRedirect) {
    if (!/<meta name="description" content="[^"]+"/.test(html)) fail(`${rel} : meta description manquante ou vide`);
    if (!/<link rel="canonical"/.test(html)) fail(`${rel} : lien canonical manquant`);
    if (!/<meta property="og:title"/.test(html)) fail(`${rel} : og:title manquant`);
  }
  if (/googletagmanager|gtag\(|G-QHHG81Q6QV|GTM-WN78CK5V/.test(html)) fail(`${rel} : trace de Google Analytics / Tag Manager`);

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt(=|[\s>/])/.test(m[0])) fail(`${rel} : <img> sans attribut alt`);
  }

  const urls = new Set();
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) urls.add(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) m[1].split(',').forEach((part) => urls.add(part.trim().split(/\s+/)[0]));
  for (const url of urls) {
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    if (!resolveInternal(url)) fail(`${rel} : lien interne cassé → ${url}`);
  }
}

const routes = (lang) => pages.map((p) => relative(DIST, p).split(sep).join('/')).filter((p) => p.startsWith(`${lang}/`)).map((p) => p.slice(3)).sort();
const fr = routes('fr');
const en = routes('en');
for (const r of fr) if (!en.includes(r)) fail(`Page sans version anglaise : fr/${r}`);
for (const r of en) if (!fr.includes(r)) fail(`Page sans version française : en/${r}`);

if (errors.length) {
  console.error(`✗ ${errors.length} problème(s) dans dist/ :`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ dist/ vérifié : ${pages.length} pages, ${(totalSize / 1024 ** 2).toFixed(1)} Mo, aucun problème.`);
