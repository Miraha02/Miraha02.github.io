/**
 * @file    project-list.ts
 * @brief   Project list helpers: engine filter families, newest-first ordering, home page split.
 * @details Pure functions, unit tested in tests/project-list.test.ts.
 *          Families match the filter buttons of the validated mock-up: UE5, Unity, other.
 */

/** Filter family of a project, derived from its `moteur` field. */
export type EngineFamily = 'ue5' | 'unity' | 'other';

/** Families in the order of the filter buttons. */
export const ENGINE_FAMILIES: readonly EngineFamily[] = ['ue5', 'unity', 'other'];

/**
 * @brief  Maps an engine name to its filter family.
 * @param  engine Value of `moteur` (e.g. "Unreal Engine 5.5", "Unity", "Android Studio").
 * @return "ue5" for Unreal Engine 5.x, "unity" for Unity, "other" otherwise.
 */
export function engineFamily(engine: string): EngineFamily {
  const name = engine.trim();
  if (/^unreal engine 5(\.\d+)?$/i.test(name)) return 'ue5';
  if (/^unity\b/i.test(name)) return 'unity';
  return 'other';
}

/** Minimal shape needed to order projects. */
export interface Dated {
  /** Start date, ISO partial (YYYY, YYYY-MM or YYYY-MM-DD). */
  start: string;
  /** End date, same format; absent for an ongoing or single-date project. */
  end?: string;
  /** Title, used as the last tie-breaker. */
  title: string;
}

/**
 * @brief  Compares two projects for a newest-first list.
 * @details Start date descending, then end date descending (an ongoing project first), then title.
 *          ISO partial dates compare correctly as strings at equal precision.
 * @param  a First project.
 * @param  b Second project.
 * @return Negative when `a` comes first.
 */
export function compareNewestFirst(a: Dated, b: Dated): number {
  if (a.start !== b.start) return a.start < b.start ? 1 : -1;
  const endA = a.end ?? '9999';
  const endB = b.end ?? '9999';
  if (endA !== endB) return endA < endB ? 1 : -1;
  return a.title.localeCompare(b.title, 'fr');
}

/**
 * @brief  Counts items per engine family.
 * @param  engines Engine name of each project.
 * @return Number of projects for each family.
 */
export function countByFamily(engines: string[]): Record<EngineFamily, number> {
  const counts: Record<EngineFamily, number> = { ue5: 0, unity: 0, other: 0 };
  for (const e of engines) counts[engineFamily(e)] += 1;
  return counts;
}

/** Minimal project shape needed to build the home page sections. */
export interface Categorized {
  data: { categorie: 'principal' | 'secondaire' | 'archive' };
}

/**
 * @brief  Splits the visible projects for the home page.
 * @details The featured project is the first "principal" one (lowest `ordre`, list already sorted);
 *          the scrolling band shows every other non-archived project, in the same order.
 * @param  projects Visible projects, sorted by category then `ordre`.
 * @return The featured project (undefined when there is no "principal" project) and the band items.
 */
export function splitHomeProjects<T extends Categorized>(projects: T[]): { featured?: T; band: T[] } {
  const featured = projects.find((p) => p.data.categorie === 'principal');
  const band = projects.filter((p) => p !== featured && p.data.categorie !== 'archive');
  return { featured, band };
}
