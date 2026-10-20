/**
 * @file    description.test.ts
 * @brief   Unit tests of the project text format parser (src/lib/description.mjs).
 */
import { describe, expect, it } from 'vitest';
import { DESCRIPTION_TEMPLATE, isEmptyDescription, parseDescription, summarize } from '../src/lib/description.mjs';

describe('parseDescription', () => {
  it('reads tagline, sections and paragraphs', () => {
    const d = parseDescription('[TAGLINE] {Court}\n\n[SECTION] {Titre}\n[PARAGRAPH] {Un}\n[PARAGRAPH] {Deux}\n');
    expect(d.errors).toEqual([]);
    expect(d.tagline).toBe('Court');
    expect(d.sections).toEqual([{ title: 'Titre', paragraphs: ['Un', 'Deux'] }]);
  });

  it('ignores empty blocks', () => {
    const d = parseDescription('[TAGLINE] {}\n[SECTION] {}\n[PARAGRAPH] {}\n[PARAGRAPH] {  }\n[SECTION] {}\n[PARAGRAPH] {Texte}');
    expect(d.errors).toEqual([]);
    expect(d.tagline).toBe('');
    expect(d.sections).toEqual([{ title: '', paragraphs: ['Texte'] }]);
  });

  it('puts paragraphs written before any section in an untitled section', () => {
    expect(parseDescription('[PARAGRAPH] {A}\n[SECTION] {S}\n[PARAGRAPH] {B}').sections).toEqual([
      { title: '', paragraphs: ['A'] },
      { title: 'S', paragraphs: ['B'] },
    ]);
  });

  it('joins single line breaks and splits on blank lines', () => {
    expect(parseDescription('[PARAGRAPH] {Ligne une\nligne deux\n\nAutre}').sections[0].paragraphs).toEqual([
      'Ligne une ligne deux',
      'Autre',
    ]);
  });

  it('handles escaped braces and Windows line endings', () => {
    const d = parseDescription('[PARAGRAPH] {a \\} b {c}\r\n[SECTION] {x}\r\n');
    expect(d.errors).toEqual([]);
    expect(d.sections[0].paragraphs).toEqual(['a } b {c']);
  });

  it('accepts lower-case tags', () => {
    expect(parseDescription('[tagline] {T}').tagline).toBe('T');
  });

  it('reports unknown tags, stray text, missing braces and duplicate taglines with line numbers', () => {
    const d = parseDescription('[PARAGRAF] {x}\ntexte libre\n[SECTION] titre\n[TAGLINE] {a}\n[TAGLINE] {b}\n[PARAGRAPH] {fin');
    expect(d.errors).toHaveLength(5);
    expect(d.errors[0]).toMatch(/^ligne 1 : balise inconnue \[PARAGRAF\]/);
    expect(d.errors[1]).toMatch(/^ligne 2 : texte hors d'une balise/);
    expect(d.errors[2]).toMatch(/^ligne 3 : \{ attendue/);
    expect(d.errors[3]).toMatch(/^ligne 5 : \[TAGLINE\] ne peut/);
    expect(d.errors[4]).toMatch(/^ligne 6 : \} manquante/);
  });
});

describe('isEmptyDescription', () => {
  it('treats the generator template as empty', () => {
    const d = parseDescription(DESCRIPTION_TEMPLATE);
    expect(d.errors).toEqual([]);
    expect(isEmptyDescription(d)).toBe(true);
  });

  it('treats a section title alone as empty, a tagline as text', () => {
    expect(isEmptyDescription(parseDescription('[SECTION] {Titre}'))).toBe(true);
    expect(isEmptyDescription(parseDescription('[TAGLINE] {Phrase}'))).toBe(false);
  });
});

describe('summarize', () => {
  it('prefers the tagline, then the first paragraph, and truncates', () => {
    expect(summarize(parseDescription('[TAGLINE] {T}\n[PARAGRAPH] {P}'))).toBe('T');
    expect(summarize(parseDescription('[PARAGRAPH] {P}'))).toBe('P');
    expect(summarize(parseDescription(`[PARAGRAPH] {${'a'.repeat(200)}}`))).toHaveLength(155);
    expect(summarize(parseDescription(''))).toBe('');
  });
});
