/**
 * @file    completeness.test.ts
 * @brief   Unit tests of the project completeness rules and of the project generator helpers.
 */
import { describe, expect, it } from 'vitest';
import {
  findHalfTranslated,
  findTextIssues,
  findUpdateIssues,
  hasTodoMarker,
  isBlank,
  isVisible,
  TODO_MARKER,
} from '../src/lib/completeness.mjs';
import { DESCRIPTION_TEMPLATE } from '../src/lib/description.mjs';
import { buildProjectFiles, buildProjectJson, formatProjectJson, nextOrder, toSlug, toTitle } from '../scripts/lib/project-template.mjs';

const complete = { fr: '[PARAGRAPH] {Texte.}', en: '[PARAGRAPH] {Text.}' };
const filled = { titre: { fr: 'Titre', en: 'Title' }, moteur: 'Unity', langages: ['C#'], debut: '2025' };

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
    const issues = findTextIssues({ data: { ...filled, titre: { fr: 'Ok', en: TODO_MARKER } }, descriptions: complete });
    expect(issues).toEqual([`projet.json : « titre.en » contient ${TODO_MARKER}`]);
  });

  it('flags empty required fields', () => {
    const issues = findTextIssues({ data: { ...filled, moteur: '', langages: [''], titre: { fr: 'T', en: ' ' } }, descriptions: complete });
    expect(issues).toEqual(['projet.json : « titre.en » vide', 'projet.json : « moteur » vide', 'projet.json : « langages » vide']);
  });

  it('flags missing and empty descriptions', () => {
    expect(findTextIssues({ data: filled, descriptions: { fr: undefined, en: '  \n' } })).toEqual(['fr.md manquant', 'en.md : aucun texte']);
    expect(findTextIssues({ data: filled, descriptions: { fr: DESCRIPTION_TEMPLATE, en: '[SECTION] {Titre}' } })).toEqual([
      'fr.md : aucun texte',
      'en.md : aucun texte',
    ]);
  });

  it('flags format errors with their line', () => {
    expect(findTextIssues({ data: filled, descriptions: { fr: '[PARAGRAPH] {ok}\n[PARAGRAF] {x}', en: complete.en } })).toEqual([
      'fr.md ligne 2 : balise inconnue [PARAGRAF] (attendu : [TAGLINE], [SECTION], [PARAGRAPH])',
    ]);
  });

  it('still detects the placeholder marker inside a block', () => {
    expect(findTextIssues({ data: filled, descriptions: { fr: `[PARAGRAPH] {${TODO_MARKER}}`, en: complete.en } })).toEqual([
      `fr.md contient ${TODO_MARKER}`,
    ]);
  });

  it('returns nothing for complete texts', () => {
    expect(findTextIssues({ data: filled, descriptions: complete })).toEqual([]);
  });
});

describe('findUpdateIssues', () => {
  it('lists media, cover and link problems', () => {
    const issues = findUpdateIssues({ mediaCount: 0, imageNames: [], couverture: 'a.png', liens: [] });
    expect(issues).toHaveLength(3);
  });

  it('accepts a project with media and links', () => {
    const issues = findUpdateIssues({ mediaCount: 1, imageNames: ['a.png'], couverture: 'a.png', liens: [{ url: 'https://x.dev' }] });
    expect(issues).toEqual([]);
  });

  it('ignores links left empty and reports half-translated texts', () => {
    const data = { duree: { fr: '3 jours', en: '' }, liens: [{ url: '', label: { fr: '', en: '' } }] };
    const issues = findUpdateIssues({ mediaCount: 1, imageNames: [], liens: data.liens, data });
    expect(issues).toEqual(['aucun lien (code, build ou version jouable)', 'projet.json : « duree.en » vide alors que « duree.fr » est rempli']);
  });
});

describe('isBlank and findHalfTranslated', () => {
  it('treats empty strings and lists of empty strings as blank', () => {
    expect(isBlank('')).toBe(true);
    expect(isBlank([''])).toBe(true);
    expect(isBlank(['C++'])).toBe(false);
    expect(isBlank(1)).toBe(false);
  });

  it('finds pairs filled in one language, including lists', () => {
    expect(findHalfTranslated({ systemes: { fr: ['IA'], en: [''] }, titre: { fr: '', en: '' } })).toEqual([
      'projet.json : « systemes.en » vide alors que « systemes.fr » est rempli',
    ]);
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

  it('creates an incomplete, hidden project with every field empty', () => {
    const json = buildProjectJson({ name: 'Test', ordre: 4, today: new Date(2026, 9, 19) });
    expect(json).toMatchObject({ etat: 'incomplet', ordre: 4, debut: '2026-10', moteur: '', fin: '' });
    expect(Object.keys(json)).toEqual([
      'ordre', 'categorie', 'etat', 'titre', 'moteur', 'langages', 'equipe', 'debut', 'fin',
      'duree', 'systemes', 'couverture', 'liens', 'youtube', 'code',
    ]);
    expect(json).not.toHaveProperty('enCours');
    expect(JSON.stringify(json)).not.toContain('COMPL');
    const files = buildProjectFiles({ name: 'Test', slug: 'test', ordre: 4 });
    const paths = files.map((f) => f.path);
    expect(paths).toContain('src/content/projets/test/fr.md');
    expect(paths).toContain('src/assets/projets/test/video/.gitkeep');
    const fr = files.find((f) => f.path.endsWith('/fr.md'))?.content;
    const en = files.find((f) => f.path.endsWith('/en.md'))?.content;
    expect(fr).toBe(DESCRIPTION_TEMPLATE);
    expect(en).toBe(DESCRIPTION_TEMPLATE);
    const issues = findTextIssues({ data: json, descriptions: { fr, en } });
    expect(issues).toContain('fr.md : aucun texte');
    expect(issues).toContain('projet.json : « moteur » vide');
    expect(isVisible('complet', issues)).toBe(false);
  });

  it('formats projet.json readably and losslessly', () => {
    const json = buildProjectJson({ name: 'Test', ordre: 4 });
    const text = formatProjectJson(json);
    expect(JSON.parse(text)).toEqual(json);
    expect(text).toContain('"titre": { "fr": "Test", "en": "Test" }');
    expect(text).toContain('"langages": [""]');
  });

  it('computes the next order in a category', () => {
    expect(nextOrder([{ categorie: 'secondaire', ordre: 3 }, { categorie: 'principal', ordre: 9 }])).toBe(4);
    expect(nextOrder([])).toBe(1);
  });
});
