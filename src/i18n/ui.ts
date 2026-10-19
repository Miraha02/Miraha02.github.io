/**
 * @file    ui.ts
 * @brief   Textes d'interface (FR/EN) et utilitaires de langue.
 * @details Contient uniquement les libellés d'interface (navigation, boutons, intitulés).
 *          Les textes de présentation et de projets sont rédigés par Hana et vivent dans
 *          src/content/. Pour ajouter une langue : l'ajouter à `languages`, compléter `ui`,
 *          puis à `locales` dans astro.config.mjs.
 */

export const languages = { fr: 'Français', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'fr';
export const langs = Object.keys(languages) as Lang[];

export const ui = {
  fr: {
    'site.title': 'Hana Delcourt · Développeuse de jeux vidéo',
    'site.role': 'Game Developer · Gameplay Programmer',
    'nav.label': 'Navigation principale',
    'nav.projects': 'Projets',
    'nav.background': 'Parcours',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.skip': 'Aller au contenu',
    'lang.label': 'Langue',
    'hero.projects': 'Voir les projets',
    'cv': 'CV (PDF)',
    'projects.title': 'Projets',
    'projects.main': 'Projet principal',
    'projects.others': 'Autres projets',
    'projects.archives': 'Archives',
    'projects.archivesCount': '{n} projets plus anciens',
    'projects.see': 'Voir le projet',
    'projects.all': 'Tous les projets',
    'projects.prev': 'Précédent',
    'projects.next': 'Suivant',
    'projects.inProgress': 'En développement',
    'background.title': 'Parcours',
    'background.education': 'Formation',
    'background.experience': 'Expériences',
    'contact.title': 'Contact',
    'team.solo': 'Solo',
    'team.pair': 'Binôme',
    'team.n': 'Équipe de {n}',
    'tech.engine': 'Moteur',
    'tech.languages': 'Langages',
    'tech.team': 'Équipe',
    'tech.duration': 'Durée',
    'tech.dates': 'Dates',
    'tech.systems': 'Systèmes clés',
    'tech.label': 'Fiche technique',
    'links.code': 'Code source',
    'links.build': 'Télécharger le build',
    'links.play': 'Jouer en ligne',
    'code.title': 'Code à consulter',
    'media.label': 'Médias du projet',
    'media.all': 'Tout',
    'media.video': 'Vidéos',
    'media.gif': 'GIF',
    'media.image': 'Images',
    'media.one.video': 'Vidéo',
    'media.one.gif': 'GIF',
    'media.one.image': 'Image',
    'media.prev': 'Média précédent',
    'media.next': 'Média suivant',
    'media.play': 'Lire la vidéo',
    'media.youtube': 'La vidéo se charge depuis YouTube (mode confidentialité renforcée) au clic.',
    'footer.analytics': 'Mesure d’audience anonyme, sans cookie (GoatCounter).',
    'notfound.title': 'Page introuvable',
    'notfound.back': 'Retour à l’accueil',
  },
  en: {
    'site.title': 'Hana Delcourt · Video Game Developer',
    'site.role': 'Game Developer · Gameplay Programmer',
    'nav.label': 'Main navigation',
    'nav.projects': 'Projects',
    'nav.background': 'Background',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.skip': 'Skip to content',
    'lang.label': 'Language',
    'hero.projects': 'See projects',
    'cv': 'Resume (PDF)',
    'projects.title': 'Projects',
    'projects.main': 'Main project',
    'projects.others': 'Other projects',
    'projects.archives': 'Archives',
    'projects.archivesCount': '{n} older projects',
    'projects.see': 'See project',
    'projects.all': 'All projects',
    'projects.prev': 'Previous',
    'projects.next': 'Next',
    'projects.inProgress': 'In development',
    'background.title': 'Background',
    'background.education': 'Education',
    'background.experience': 'Experience',
    'contact.title': 'Contact',
    'team.solo': 'Solo',
    'team.pair': 'Pair',
    'team.n': 'Team of {n}',
    'tech.engine': 'Engine',
    'tech.languages': 'Languages',
    'tech.team': 'Team',
    'tech.duration': 'Duration',
    'tech.dates': 'Dates',
    'tech.systems': 'Key systems',
    'tech.label': 'Technical sheet',
    'links.code': 'Source code',
    'links.build': 'Download build',
    'links.play': 'Play online',
    'code.title': 'Code to read',
    'media.label': 'Project media',
    'media.all': 'All',
    'media.video': 'Videos',
    'media.gif': 'GIF',
    'media.image': 'Images',
    'media.one.video': 'Video',
    'media.one.gif': 'GIF',
    'media.one.image': 'Image',
    'media.prev': 'Previous media',
    'media.next': 'Next media',
    'media.play': 'Play video',
    'media.youtube': 'The video loads from YouTube (privacy-enhanced mode) when clicked.',
    'footer.analytics': 'Anonymous, cookie-free audience measurement (GoatCounter).',
    'notfound.title': 'Page not found',
    'notfound.back': 'Back to home',
  },
} as const;

export type UiKey = keyof (typeof ui)['fr'];

/** @brief Retourne la fonction de traduction pour une langue ; `{n}` est remplacé par `vars.n`. */
export function useTranslations(lang: Lang) {
  return (key: UiKey, vars: Record<string, string | number> = {}): string => {
    let s: string = ui[lang][key] ?? ui[defaultLang][key];
    for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
    return s;
  };
}

/** @brief Vérifie qu'une chaîne est une langue supportée. */
export function isLang(value: string | undefined): value is Lang {
  return !!value && value in languages;
}

/** @brief Construit un chemin interne préfixé par la langue, avec slash final. */
export function localePath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${lang}/${clean}/` : `/${lang}/`;
}

/** @brief Remplace la langue d'un chemin courant (ex. /fr/projets/x/ → /en/projets/x/). */
export function switchLangPath(pathname: string, target: Lang): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && isLang(parts[0])) parts[0] = target;
  else parts.unshift(target);
  return `/${parts.join('/')}/`;
}

const monthFmt: Record<Lang, Intl.DateTimeFormat> = {
  fr: new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric', timeZone: 'UTC' }),
  en: new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }),
};
const dayFmt: Record<Lang, Intl.DateTimeFormat> = {
  fr: new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }),
  en: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }),
};

/**
 * @brief Formate une date ISO partielle : « AAAA », « AAAA-MM » ou « AAAA-MM-JJ ».
 * @return Chaîne localisée, à la précision fournie.
 */
export function formatDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!m) return String(y);
  const date = new Date(Date.UTC(y, m - 1, d || 1));
  return d ? dayFmt[lang].format(date) : monthFmt[lang].format(date);
}

/** @brief Formate une période « début – fin » ; la fin est omise si absente ou identique. */
export function formatPeriod(start: string, end: string | undefined, lang: Lang): string {
  const a = formatDate(start, lang);
  if (!end) return a;
  const b = formatDate(end, lang);
  return a === b ? a : `${a} – ${b}`;
}

/** @brief Libellé de taille d'équipe. */
export function teamLabel(n: number, lang: Lang): string {
  const t = useTranslations(lang);
  if (n <= 1) return t('team.solo');
  if (n === 2) return t('team.pair');
  return t('team.n', { n });
}

/** @brief Nom court d'un moteur pour les métadonnées (« Unreal Engine 5.5 » → « UE5 »). */
export function shortEngine(engine: string): string {
  return engine.replace(/^Unreal Engine (\d+)(\.\d+)?$/, 'UE$1');
}
