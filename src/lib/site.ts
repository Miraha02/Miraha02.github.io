/**
 * @file    site.ts
 * @brief   Paramètres généraux du site : contact, statistiques, CV.
 * @details Aucune donnée secrète ici : tout ce fichier est public (dépôt et pages publiées).
 *          - goatcounterCode : code du compteur GoatCounter (ex. « hanadelcourt » pour
 *            hanadelcourt.goatcounter.com). Vide = aucun script de statistiques chargé.
 *          - cv : chemins dans public/ ; le bouton n'apparaît que si le fichier existe au build.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Lang } from '../i18n/ui';

export const site = {
  name: 'Hana Delcourt',
  email: 'hanadelcourt@gmail.com',
  github: { user: 'Miraha02', url: 'https://github.com/Miraha02' },
  goatcounterCode: '',
  cv: { fr: '/cv/CV-Hana-Delcourt-FR.pdf', en: '/cv/CV-Hana-Delcourt-EN.pdf' } satisfies Record<Lang, string>,
} as const;

/** @brief Chemin public du CV dans une langue, ou undefined si le fichier n'est pas dans public/. */
export function cvPath(lang: Lang): string | undefined {
  const rel = site.cv[lang];
  // Le build est lancé depuis la racine du projet (npm run build).
  return existsSync(join(process.cwd(), 'public', rel)) ? rel : undefined;
}
