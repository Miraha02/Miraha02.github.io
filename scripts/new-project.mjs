/**
 * @file    new-project.mjs
 * @brief   Creates the default structure of a new portfolio project.
 * @details Usage: `./newProject Nom_du_projet` (Git Bash) or `npm run new -- Nom_du_projet`.
 *          Creates src/content/projets/<slug>/ (projet.json, fr.md, en.md) and
 *          src/assets/projets/<slug>/{image,gif,video}/. The project is declared "incomplet",
 *          so it stays hidden from the site until its `[À COMPLÉTER]` markers are filled in.
 *          Refuses to overwrite an existing project.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildProjectFiles, nextOrder, toSlug } from './lib/project-template.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT = join(ROOT, 'src/content/projets');
const ASSETS = join(ROOT, 'src/assets/projets');

/**
 * @brief  Reads `categorie` and `ordre` of every existing project (unreadable files are skipped).
 * @return {{ categorie: string; ordre: number }[]}
 */
function readExistingProjects() {
  return readdirSync(CONTENT, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap((e) => {
      try {
        return [JSON.parse(readFileSync(join(CONTENT, e.name, 'projet.json'), 'utf8'))];
      } catch {
        return [];
      }
    });
}

/**
 * @brief  Prints an error and stops with exit code 1.
 * @param  {string} message Error text.
 */
function fail(message) {
  console.error(`Erreur : ${message}`);
  process.exit(1);
}

/** @brief Entry point. */
function main() {
  const name = process.argv.slice(2).join(' ').trim();
  if (!name) fail('nom du projet manquant.\nUsage : ./newProject Nom_du_projet');

  const slug = toSlug(name);
  if (!slug) fail(`« ${name} » ne contient aucune lettre ni chiffre utilisable.`);
  if (existsSync(join(CONTENT, slug)) || existsSync(join(ASSETS, slug))) {
    fail(`le projet « ${slug} » existe déjà (src/content/projets/${slug} ou src/assets/projets/${slug}).`);
  }

  const files = buildProjectFiles({ name, slug, ordre: nextOrder(readExistingProjects()) });
  for (const f of files) {
    const target = join(ROOT, f.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, f.content, { flag: 'wx' });
  }

  console.log(`Projet « ${slug} » créé (état : incomplet, masqué du site) :`);
  for (const f of files) console.log(`  ${f.path}`);
  console.log('\nÀ faire : remplacer chaque [À COMPLÉTER], ajouter les médias et les liens,');
  console.log('puis passer "etat" à "complet" ou "a-mettre-a-jour" dans projet.json.');
  console.log(`Adresse sur le site : /fr/projets/${slug}/`);
}

main();
