/**
 * @file    i18n.test.ts
 * @brief   Tests des utilitaires de langue : chemins localisés, bascule FR/EN, dates, équipes,
 *          et parité des clés d'interface entre les langues.
 */
import { describe, expect, it } from 'vitest';
import { formatDate, formatPeriod, isLang, langs, localePath, shortEngine, switchLangPath, teamLabel, ui } from '../src/i18n/ui';

describe('chemins localisés', () => {
  it('préfixe la langue et termine par un slash', () => {
    expect(localePath('fr')).toBe('/fr/');
    expect(localePath('en', 'projets/shadowsteps')).toBe('/en/projets/shadowsteps/');
    expect(localePath('fr', '/projets/x/')).toBe('/fr/projets/x/');
  });

  it('bascule de langue en conservant la page', () => {
    expect(switchLangPath('/fr/projets/gas/', 'en')).toBe('/en/projets/gas/');
    expect(switchLangPath('/en/', 'fr')).toBe('/fr/');
    expect(switchLangPath('/', 'en')).toBe('/en/');
  });

  it('reconnaît uniquement les langues supportées', () => {
    expect(isLang('fr')).toBe(true);
    expect(isLang('de')).toBe(false);
    expect(isLang(undefined)).toBe(false);
  });
});

describe('dates', () => {
  it('respecte la précision fournie', () => {
    expect(formatDate('2025', 'fr')).toBe('2025');
    expect(formatDate('2025-04-14', 'fr')).toBe('14/04/2025');
    expect(formatDate('2024-09', 'en')).toMatch(/Sept? 2024/);
  });

  it('omet la fin absente ou identique', () => {
    expect(formatPeriod('2024-04', undefined, 'fr')).toBe(formatDate('2024-04', 'fr'));
    expect(formatPeriod('2024-04', '2024-04', 'fr')).toBe(formatDate('2024-04', 'fr'));
    expect(formatPeriod('2025-04-14', '2025-04-17', 'fr')).toBe('14/04/2025 – 17/04/2025');
  });
});

describe('libellés', () => {
  it('équipe', () => {
    expect(teamLabel(1, 'fr')).toBe('Solo');
    expect(teamLabel(2, 'fr')).toBe('Binôme');
    expect(teamLabel(3, 'en')).toBe('Team of 3');
  });

  it('moteur abrégé', () => {
    expect(shortEngine('Unreal Engine 5.5')).toBe('UE5');
    expect(shortEngine('Unity')).toBe('Unity');
  });
});

describe('traductions', () => {
  it('chaque langue a exactement les mêmes clés, non vides', () => {
    const ref = Object.keys(ui.fr).sort();
    for (const lang of langs) {
      expect(Object.keys(ui[lang]).sort()).toEqual(ref);
      for (const value of Object.values(ui[lang])) expect(value.trim()).not.toBe('');
    }
  });
});
