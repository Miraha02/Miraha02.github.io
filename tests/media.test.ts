/**
 * @file    media.test.ts
 * @brief   Tests de la détection automatique des médias (dossiers image/gif/video par projet).
 */
import { describe, expect, it } from 'vitest';
import { getCoverImage, getProjectMedia, parseMediaPath, sortMedia } from '../src/lib/media';

describe('parseMediaPath', () => {
  it('extrait le projet, le type et le fichier', () => {
    expect(parseMediaPath('/src/assets/projets/shadowsteps/image/a.png')).toEqual({ slug: 'shadowsteps', kind: 'image', name: 'a.png' });
    expect(parseMediaPath('/src/assets/projets/x/video/demo.mp4')?.kind).toBe('video');
  });

  it('ignore les dossiers non reconnus', () => {
    expect(parseMediaPath('/src/assets/projets/x/autre/a.png')).toBeNull();
  });
});

describe('sortMedia', () => {
  it('trie par type puis par nom en ordre naturel', () => {
    const list = [
      { kind: 'image' as const, name: 'img10.png' },
      { kind: 'image' as const, name: 'img2.png' },
      { kind: 'gif' as const, name: 'b.gif' },
      { kind: 'video' as const, name: 'z.mp4' },
      { kind: 'youtube' as const, name: 'abc' },
    ];
    expect(sortMedia(list).map((m) => m.name)).toEqual(['abc', 'z.mp4', 'b.gif', 'img2.png', 'img10.png']);
  });
});

describe('getProjectMedia', () => {
  it('trouve les images d’un projet existant', () => {
    const media = getProjectMedia('shadowsteps');
    expect(media.length).toBeGreaterThan(0);
    expect(media.every((m) => m.slug === 'shadowsteps')).toBe(true);
  });

  it('ajoute les vidéos YouTube en tête', () => {
    const media = getProjectMedia('gas', [{ id: 'tsQcxoMZ6NQ', title: 'POC' }]);
    expect(media[0]).toMatchObject({ kind: 'youtube', id: 'tsQcxoMZ6NQ' });
  });

  it('renvoie une liste vide pour un projet sans médias', () => {
    expect(getProjectMedia('projet-inexistant')).toEqual([]);
    expect(getCoverImage('projet-inexistant')).toBeUndefined();
  });

  it('respecte la vignette choisie', () => {
    const cover = getCoverImage('shadowsteps', 'ShadowSteps3.png');
    expect(cover?.src).toContain('ShadowSteps3');
  });
});
