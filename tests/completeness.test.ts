/**
 * @file    completeness.test.ts
 * @brief   Unit tests of the project completeness rules and of the project generator helpers.
 */
import { describe, expect, it } from 'vitest';
import { findTextIssues, findUpdateIssues, hasTodoMarker, isVisible, TODO_MARKER } from '../src/lib/completeness.mjs';
import { buildProjectFiles, buildProjectJson, nextOrder, toSlug, toTitle } from '../scripts/lib/project-template.mjs';

const complete = { fr: 'Texte.', en: 'Text.' };

describe('hasTodoMarker', () => {
  it('detects the marker with or without accents and hint', () => {
    expect(hasTodoMarker('[À COMPLÉTER]')).toBe(true);
    expect(hasTodoMarker('x [a completer : nom] y')).toBe(true);
  });

  it('ignores Markdown links and ordinary brackets', () => {
    expect(hasTodoMarker('[GitHub](https://github.com) [x]')).toBe(false);
  });
});

describe('findTextIssues', () => {
  it('finds markers in nested projet.json strings', () => {
    const issues = findTextIssues({ data: { titre: { fr: 'Ok', en: TODO_MARKER } }, descriptions: complete });
    expect(issues).toEqual([`projet.json : « titre.en » contient ${TODO_MARKER}`]);
  });

  it('flags missing and empty descriptions', () => {
    expect(findTextIssues({ data: {}, descriptions: { fr: undefined, en: '  \n' } })).toEqual(['fr.md manquant', 'en.md vide']);
  });

  it('returns nothing for complete texts', () => {
    expect(findTextIssues({ data: { langages: ['C++'] }, descriptions: complete })).toEqual([]);
  });
});

describe('findUpdateIssues', () => {
  it('lists media, cover, link and code problems', () => {
    const issues = findUpdateIssues({ mediaCount: 0, imageNames: [], couverture: 'a.png', liens: [], code: [{ chemin: 'A.cpp' }] });
    expect(issues).toHaveLength(4);
  });

  it('accepts a project with media, links and code urls', () => {
    const issues = findUpdateIssues({
      mediaCount: 1,
      imageNames: ['a.png'],
      couverture: 'a.png',
      liens: [{}],
      code: [{ chemin: 'A.cpp', url: 'https://example.com' }],
    });
    expect(issues).toEqual([]);
  });
});

describe('isVisible', () => {
  it('hides incomplete projects and projects with text issues', () => {
    expect(isVisible('incomplet', [])).toBe(false);
    expect(isVisible('complet', ['fr.md vide'])).toBe(false);
  });

  it('shows complete and to-update projects', () => {
    expect(isVisible('complet', [])).toBe(true);
    expect(isVisible('a-mettre-a-jour', [])).toBe(true);
  });
});

describe('project generator', () => {
  it('builds slugs and titles', () => {
    expect(toSlug('Mon_Projet Été 2')).toBe('mon-projet-ete-2');
    expect(toSlug('___')).toBe('');
    expect(toTitle('Mon__Projet')).toBe('Mon Projet');
  });

  it('creates an incomplete, hidden project', () => {
    const json = buildProjectJson({ name: 'Test', ordre: 4, today: new Date(2026, 9, 19) });
    expect(json).toMatchObject({ etat: 'incomplet', ordre: 4, debut: '2026-10' });
    const files = buildProjectFiles({ name: 'Test', slug: 'test', ordre: 4 }).map((f) => f.path);
    expect(files).toContain('src/content/projets/test/fr.md');
    expect(files).toContain('src/assets/projets/test/video/.gitkeep');
    const descriptions = { fr: TODO_MARKER, en: TODO_MARKER };
    expect(isVisible('incomplet', findTextIssues({ data: json, descriptions }))).toBe(false);
  });

  it('computes the next order in a category', () => {
    expect(nextOrder([{ categorie: 'secondaire', ordre: 3 }, { categorie: 'principal', ordre: 9 }])).toBe(4);
    expect(nextOrder([])).toBe(1);
  });
});
