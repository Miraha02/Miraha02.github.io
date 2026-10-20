/**
 * @file    content.config.ts
 * @brief   Définition et validation (Zod) des collections de contenu du portfolio.
 * @details - projets     : src/content/projets/<slug>/projet.json (données communes aux langues)
 *          - descriptions: src/content/projets/<slug>/<lang>.md (texte rédigé par Hana,
 *                          format à balises lu par src/lib/description.mjs)
 *          - profil      : src/content/profil/<lang>.md (texte de présentation)
 *          - formation, experiences : src/content/parcours/*.json (champs traduits fr/en)
 *          Un champ obligatoire manquant fait échouer le build avec un message explicite.
 */
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { PROJECT_STATES } from './lib/completeness.mjs';

/** Date ISO partielle : AAAA, AAAA-MM ou AAAA-MM-JJ. */
const isoDate = z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'Format attendu : AAAA, AAAA-MM ou AAAA-MM-JJ');
/** Texte traduit : une valeur par langue. */
const t = z.object({ fr: z.string(), en: z.string() });

const projets = defineCollection({
  loader: glob({
    pattern: '*/projet.json',
    base: './src/content/projets',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    /** Ordre d'affichage dans sa catégorie (croissant). */
    ordre: z.number().int(),
    categorie: z.enum(['principal', 'secondaire', 'archive']),
    /** Declared state: "incomplet" hides the project (rules in src/lib/completeness.mjs). */
    etat: z.enum(PROJECT_STATES),
    titre: t,
    /** Nom du fichier image de vignette (dossier image/) ; par défaut la première image. */
    couverture: z.string().optional(),
    moteur: z.string(),
    langages: z.array(z.string()).min(1),
    equipe: z.number().int().min(1),
    debut: isoDate,
    fin: isoDate.optional(),
    enCours: z.boolean().default(false),
    duree: t.optional(),
    systemes: z.object({ fr: z.array(z.string()), en: z.array(z.string()) }).optional(),
    liens: z
      .array(
        z.object({
          type: z.enum(['code', 'build', 'play', 'other']),
          url: z.url(),
          label: t.optional(),
        }),
      )
      .default([]),
    /** Vidéos YouTube (identifiant seul), chargées au clic via youtube-nocookie.com. */
    youtube: z.array(z.object({ id: z.string().regex(/^[\w-]{11}$/), titre: t })).default([]),
  }),
});

const descriptions = defineCollection({
  loader: glob({ pattern: '*/{fr,en}.md', base: './src/content/projets' }),
});

const profil = defineCollection({
  loader: glob({ pattern: '{fr,en}.md', base: './src/content/profil' }),
});

const formation = defineCollection({
  loader: file('./src/content/parcours/formation.json'),
  schema: z.object({
    ordre: z.number().int(),
    diplome: t,
    etablissement: t,
    debut: isoDate,
    fin: isoDate.optional(),
    /** Libellé libre quand la fin n'est pas une date (ex. « Aujourd'hui »). */
    finTexte: t.optional(),
  }),
});

const experiences = defineCollection({
  loader: file('./src/content/parcours/experiences.json'),
  schema: z.object({
    ordre: z.number().int(),
    poste: t,
    structure: t,
    debut: isoDate,
    fin: isoDate.optional(),
    description: t,
  }),
});

export const collections = { projets, descriptions, profil, formation, experiences };
