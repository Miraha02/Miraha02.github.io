/**
 * @file    content.config.ts
 * @brief   Définition et validation (Zod) des collections de contenu du portfolio.
 * @details - projets     : src/content/projets/<slug>/projet.json (données communes aux langues)
 *          - descriptions: src/content/projets/<slug>/<lang>.md (texte rédigé par Hana,
 *                          format à balises lu par src/lib/description.mjs)
 *          - profil      : src/content/profil/<lang>.md (texte de présentation)
 *          - formation, experiences : src/content/parcours/*.json (champs traduits fr/en)
 *          Un champ obligatoire manquant fait échouer le build avec un message explicite.
 *          Empty values ("") are accepted everywhere: optional ones are ignored, required ones
 *          (moteur, langages, debut, titre) hide the project (src/lib/completeness.mjs).
 */
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { PROJECT_STATES } from './lib/completeness.mjs';

/** Date ISO partielle : AAAA, AAAA-MM ou AAAA-MM-JJ. */
const isoDate = z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'Format attendu : AAAA, AAAA-MM ou AAAA-MM-JJ');
/** Texte traduit : une valeur par langue. */
const t = z.object({ fr: z.string(), en: z.string() });

/** @brief Turns an empty string into undefined, so that an unfilled optional field is ignored. */
const emptyToUndefined = (v: unknown) => (v === '' ? undefined : v);
/** @brief Ignores a translated text whose two languages are empty. */
const emptyPairToUndefined = (v: unknown) =>
  v && typeof v === 'object' && Object.values(v as Record<string, unknown>).every((x) => x === '') ? undefined : v;
/** @brief Drops empty strings from a list. */
const dropEmpty = (list: string[]) => list.map((x) => x.trim()).filter(Boolean);

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
    /** Required; an empty value hides the project (see completeness.mjs). */
    moteur: z.string(),
    /** Required; empty entries are dropped, none left hides the project. */
    langages: z.array(z.string()).transform(dropEmpty),
    equipe: z.number().int().min(1),
    /** Required; an empty value hides the project. */
    debut: z.union([z.literal(''), isoDate]),
    /** Empty: the project is shown as in progress. */
    fin: z.preprocess(emptyToUndefined, isoDate.optional()),
    duree: z.preprocess(emptyPairToUndefined, t.optional()),
    systemes: z
      .object({ fr: z.array(z.string()), en: z.array(z.string()) })
      .optional()
      .transform((v) => (v && (dropEmpty(v.fr).length || dropEmpty(v.en).length) ? { fr: dropEmpty(v.fr), en: dropEmpty(v.en) } : undefined)),
    /** Nom du fichier image de vignette (dossier image/) ; vide : la première image. */
    couverture: z.preprocess(emptyToUndefined, z.string().optional()),
    /** Boutons sous le titre ; une entrée sans url est ignorée. */
    liens: z
      .array(
        z.object({
          type: z.enum(['code', 'build', 'play', 'other']),
          url: z.union([z.literal(''), z.url()]),
          label: t.partial().optional(),
        }),
      )
      .default([])
      .transform((list) => list.filter((l) => l.url !== '')),
    /** Vidéos YouTube (identifiant seul), chargées au clic ; une entrée sans id est ignorée. */
    youtube: z
      .array(z.object({ id: z.union([z.literal(''), z.string().regex(/^[\w-]{11}$/)]), titre: t.partial().optional() }))
      .default([])
      .transform((list) => list.filter((y) => y.id !== '')),
    /** Fichiers de code à lire (section « Code à consulter ») ; une entrée sans url est ignorée. */
    code: z
      .array(z.object({ chemin: z.string(), url: z.union([z.literal(''), z.url()]), note: t.partial().optional() }))
      .default([])
      .transform((list) => list.filter((c) => c.url !== '' && c.chemin.trim() !== '')),
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
