/**
 * @file    astro.config.mjs
 * @brief   Configuration Astro du portfolio.
 * @details Site statique publié sur GitHub Pages (dépôt Miraha02.github.io, donc sans `base`).
 *          Langues : français par défaut et anglais, toutes deux préfixées (/fr/, /en/) ;
 *          la racine `/` redirige immédiatement vers `/fr/` via src/pages/index.astro
 *          (la redirection intégrée d'Astro attend 2 secondes, d'où redirectToDefaultLocale: false).
 */
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://miraha02.github.io',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
