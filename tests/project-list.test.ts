/**
 * @file    project-list.test.ts
 * @brief   Unit tests of the project list helpers: engine families, ordering, counts, home page split.
 */
import { describe, expect, it } from 'vitest';
import { compareNewestFirst, countByFamily, engineFamily, splitHomeProjects } from '../src/lib/project-list';

describe('engineFamily', () => {
  it('groups Unreal Engine 5 versions, Unity and the rest', () => {
    expect(engineFamily('Unreal Engine 5')).toBe('ue5');
    expect(engineFamily('Unreal Engine 5.5')).toBe('ue5');
    expect(engineFamily('Unity')).toBe('unity');
    expect(engineFamily('Android Studio')).toBe('other');
    expect(engineFamily('Unreal Engine 4.27')).toBe('other');
  });
});

describe('compareNewestFirst', () => {
  it('orders by start date, then end date, then title', () => {
    const list = [
      { title: 'B', start: '2024-04', end: '2024-07' },
      { title: 'A', start: '2025-01', end: '2025-03' },
      { title: 'C', start: '2024-04' },
      { title: 'D', start: '2024-04', end: '2024-07' },
    ];
    expect([...list].sort(compareNewestFirst).map((p) => p.title)).toEqual(['A', 'C', 'B', 'D']);
  });
});

describe('countByFamily', () => {
  it('counts each family, including empty ones', () => {
    expect(countByFamily(['Unity', 'Unity', 'Python'])).toEqual({ ue5: 0, unity: 2, other: 1 });
  });
});

describe('splitHomeProjects', () => {
  it('features the first main project and puts the other non-archived ones in the band', () => {
    const p = (id: string, categorie: 'principal' | 'secondaire' | 'archive') => ({ id, data: { categorie } });
    const list = [p('a', 'principal'), p('b', 'principal'), p('c', 'secondaire'), p('d', 'archive')];
    const { featured, band } = splitHomeProjects(list);
    expect(featured?.id).toBe('a');
    expect(band.map((x) => x.id)).toEqual(['b', 'c']);
  });

  it('has no featured project when no main project is visible', () => {
    const { featured, band } = splitHomeProjects([{ id: 'c', data: { categorie: 'secondaire' as const } }]);
    expect(featured).toBeUndefined();
    expect(band).toHaveLength(1);
  });
});
