/**
 * @file    media.ts
 * @brief   Détection automatique des médias de chaque projet.
 * @details Parcourt au build src/assets/projets/<slug>/{image,gif,video}/ : aucun média n'est
 *          déclaré à la main. Les images (png, jpg, webp, avif) sont optimisées par Astro ;
 *          les GIF et vidéos (mp4, webm) sont copiés tels quels. Les vidéos YouTube déclarées
 *          dans projet.json sont ajoutées à la liste (type « youtube »).
 *          Tri : vidéos, puis GIF, puis images ; ordre alphabétique « naturel » dans chaque type
 *          (préfixer les fichiers 01-, 02-… pour imposer un ordre).
 */
import type { ImageMetadata } from 'astro';

export type MediaKind = 'video' | 'gif' | 'image';

export type Media =
  | { kind: 'image'; slug: string; name: string; image: ImageMetadata }
  | { kind: 'gif'; slug: string; name: string; src: string }
  | { kind: 'video'; slug: string; name: string; src: string; type: string }
  | { kind: 'youtube'; slug: string; name: string; id: string; title: string };

// Les motifs doivent être des littéraux (contrainte de import.meta.glob).
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/projets/*/image/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}',
  { eager: true },
);
const gifs = import.meta.glob<string>('/src/assets/projets/*/gif/*.{gif,GIF}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const videos = import.meta.glob<string>('/src/assets/projets/*/video/*.{mp4,webm,MP4,WEBM}', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** @brief Découpe un chemin /src/assets/projets/<slug>/<kind>/<fichier>. */
export function parseMediaPath(path: string): { slug: string; kind: string; name: string } | null {
  const m = path.match(/\/projets\/([^/]+)\/(image|gif|video)\/([^/]+)$/);
  return m ? { slug: m[1], kind: m[2], name: m[3] } : null;
}

const collator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' });
const order: Record<Media['kind'], number> = { youtube: 0, video: 1, gif: 2, image: 3 };

/** @brief Trie des médias : par type, puis par nom de fichier (ordre naturel). */
export function sortMedia<T extends { kind: Media['kind']; name: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => order[a.kind] - order[b.kind] || collator.compare(a.name, b.name));
}

/**
 * @brief  Liste les médias d'un projet.
 * @param  slug    Nom du dossier du projet.
 * @param  youtube Vidéos YouTube déclarées dans projet.json (titre déjà traduit).
 */
export function getProjectMedia(slug: string, youtube: { id: string; title: string }[] = []): Media[] {
  const list: Media[] = [];
  for (const [path, mod] of Object.entries(images)) {
    const p = parseMediaPath(path);
    if (p?.slug === slug) list.push({ kind: 'image', slug, name: p.name, image: mod.default });
  }
  for (const [path, src] of Object.entries(gifs)) {
    const p = parseMediaPath(path);
    if (p?.slug === slug) list.push({ kind: 'gif', slug, name: p.name, src });
  }
  for (const [path, src] of Object.entries(videos)) {
    const p = parseMediaPath(path);
    if (p?.slug === slug) {
      const type = p.name.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4';
      list.push({ kind: 'video', slug, name: p.name, src, type });
    }
  }
  for (const y of youtube) list.push({ kind: 'youtube', slug, name: y.id, id: y.id, title: y.title });
  return sortMedia(list);
}

/**
 * @brief Image de vignette d'un projet (cartes et partage) : le fichier `preferred` s'il existe,
 *        sinon la première image ; undefined si le projet n'a aucune image.
 */
export function getCoverImage(slug: string, preferred?: string): ImageMetadata | undefined {
  const imgs = getProjectMedia(slug).filter((m): m is Extract<Media, { kind: 'image' }> => m.kind === 'image');
  return (imgs.find((m) => m.name === preferred) ?? imgs[0])?.image;
}
