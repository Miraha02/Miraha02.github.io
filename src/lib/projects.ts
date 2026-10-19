/**
 * @file    projects.ts
 * @brief   Accès aux projets visibles, triés et associés à leur texte dans une langue donnée.
 * @details Combine la collection « projets » (données communes) et « descriptions »
 *          (texte rédigé par Hana, un fichier par langue). Visibility follows
 *          src/lib/completeness.mjs: projects declared "incomplet", or whose texts still contain
 *          a placeholder or miss a language, are excluded everywhere (pages, lists, navigation).
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { langs, type Lang } from '../i18n/ui';
import { findTextIssues, isVisible } from './completeness.mjs';

export type Project = CollectionEntry<'projets'>;
export type Category = Project['data']['categorie'];

const categoryOrder: Record<Category, number> = { principal: 0, secondaire: 1, archive: 2 };

/** @brief Trie par catégorie puis par `ordre`. */
export function sortProjects(list: Project[]): Project[] {
  return [...list].sort(
    (a, b) => categoryOrder[a.data.categorie] - categoryOrder[b.data.categorie] || a.data.ordre - b.data.ordre,
  );
}

/**
 * @brief  Tells whether a project is shown on the site (declared state and text completeness).
 * @param  project Project entry.
 * @return true when the project is visible.
 */
export async function isProjectVisible(project: Project): Promise<boolean> {
  const descriptions: Record<string, string | undefined> = {};
  for (const lang of langs) {
    descriptions[lang] = (await getEntry('descriptions', `${project.id}/${lang}`))?.body;
  }
  return isVisible(project.data.etat, findTextIssues({ data: project.data, descriptions }));
}

/** @brief Projets visibles, triés. */
export async function getPublishedProjects(): Promise<Project[]> {
  const all = await getCollection('projets');
  const visible = [];
  for (const p of all) if (await isProjectVisible(p)) visible.push(p);
  return sortProjects(visible);
}

/** @brief Description (Markdown) d'un projet dans une langue, ou undefined si absente. */
export async function getDescription(slug: string, lang: Lang) {
  return getEntry('descriptions', `${slug}/${lang}`);
}

/** @brief Projet précédent et suivant dans l'ordre d'affichage (hors archives). */
export function getNeighbours(list: Project[], slug: string): { prev?: Project; next?: Project } {
  const visible = list.filter((p) => p.data.categorie !== 'archive');
  const i = visible.findIndex((p) => p.id === slug);
  if (i === -1) return {};
  return { prev: visible[i - 1], next: visible[i + 1] };
}
