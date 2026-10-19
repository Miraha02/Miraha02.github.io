/**
 * @file    projects.ts
 * @brief   Accès aux projets publiés, triés et associés à leur texte dans une langue donnée.
 * @details Combine la collection « projets » (données communes) et « descriptions »
 *          (texte rédigé par Hana, un fichier par langue). Les projets `publie: false`
 *          sont exclus partout (pages, listes, navigation).
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Project = CollectionEntry<'projets'>;
export type Category = Project['data']['categorie'];

const categoryOrder: Record<Category, number> = { principal: 0, secondaire: 1, archive: 2 };

/** @brief Trie par catégorie puis par `ordre`. */
export function sortProjects(list: Project[]): Project[] {
  return [...list].sort(
    (a, b) => categoryOrder[a.data.categorie] - categoryOrder[b.data.categorie] || a.data.ordre - b.data.ordre,
  );
}

/** @brief Projets publiés, triés. */
export async function getPublishedProjects(): Promise<Project[]> {
  return sortProjects(await getCollection('projets', ({ data }) => data.publie));
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
