/**
 * @file    vitest.config.ts
 * @brief   Configuration des tests unitaires (Vitest), avec la configuration Vite d'Astro
 *          pour que import.meta.glob et les alias fonctionnent comme au build.
 */
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
