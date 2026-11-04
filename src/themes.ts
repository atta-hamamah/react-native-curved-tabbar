import type { TabBarColors, TabBarThemeName } from './types';

export const THEMES: Record<TabBarThemeName, TabBarColors> = {
  ocean: {
    bar: '#FFFFFF',
    glow: '#33B8D2',
    active: '#0072BB',
    inactive: '#86A8BC',
    centerActive: '#0072BB',
    centerInactive: '#86A8BC',
    centerIcon: '#FFFFFF',
    badge: '#FF6600',
    badgeText: '#FFFFFF',
    sparkle: '#FFD700',
  },
  dark: {
    bar: '#12121A',
    glow: '#A855F7',
    active: '#EC4899',
    inactive: '#6B7280',
    centerActive: '#EC4899',
    centerInactive: '#6B7280',
    centerIcon: '#FFFFFF',
    badge: '#EF4444',
    badgeText: '#FFFFFF',
    sparkle: '#FFD700',
  },
  emerald: {
    bar: '#FFFFFF',
    glow: '#10B981',
    active: '#059669',
    inactive: '#9CA3AF',
    centerActive: '#059669',
    centerInactive: '#9CA3AF',
    centerIcon: '#FFFFFF',
    badge: '#F59E0B',
    badgeText: '#FFFFFF',
    sparkle: '#FFD700',
  },
  sunset: {
    bar: '#FFFFFF',
    glow: '#FB923C',
    active: '#EA580C',
    inactive: '#9CA3AF',
    centerActive: '#EA580C',
    centerInactive: '#9CA3AF',
    centerIcon: '#FFFFFF',
    badge: '#DC2626',
    badgeText: '#FFFFFF',
    sparkle: '#FFD700',
  },
};

/** Theme colors with any defined overrides applied on top. */
export function resolveColors(
  theme: TabBarThemeName | undefined,
  overrides: Partial<TabBarColors> | undefined
): TabBarColors {
  const base = (theme && THEMES[theme]) || THEMES.ocean;
  if (!overrides) return base;

  const merged = { ...base };
  (Object.keys(overrides) as (keyof TabBarColors)[]).forEach((key) => {
    const value = overrides[key];
    if (value !== undefined) merged[key] = value;
  });
  return merged;
}
