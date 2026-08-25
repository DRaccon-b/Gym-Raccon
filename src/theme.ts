export type ColorScheme = 'light' | 'dark';

export type Colors = {
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentDim: string;
  accentGlow: string;
  success: string;
  danger: string;
};

export const DARK_COLORS: Colors = {
  background: '#0b0d12',
  surface: '#161922',
  surfaceRaised: '#1c202b',
  surfaceSunken: '#0d0f15',
  border: '#242938',
  borderStrong: '#ff5a3c',
  textPrimary: '#f5f6f8',
  textSecondary: '#9aa0ac',
  textMuted: '#5b6272',
  accent: '#ff5a3c',
  accentDim: '#c8452e',
  accentGlow: 'rgba(255, 90, 60, 0.18)',
  success: '#22c55e',
  danger: '#ef4444',
};

export const LIGHT_COLORS: Colors = {
  background: '#f4f5f7',
  surface: '#ffffff',
  surfaceRaised: '#ffffff',
  surfaceSunken: '#eceef2',
  border: '#e1e4ea',
  borderStrong: '#ff5a3c',
  textPrimary: '#14161c',
  textSecondary: '#5b6272',
  textMuted: '#8a90a0',
  accent: '#ff5a3c',
  accentDim: '#c8452e',
  accentGlow: 'rgba(255, 90, 60, 0.14)',
  success: '#16a34a',
  danger: '#dc2626',
};

export function getColors(scheme: ColorScheme): Colors {
  return scheme === 'light' ? LIGHT_COLORS : DARK_COLORS;
}

/** @deprecated Use useTheme()/useSettings().colors instead — this is a static dark fallback. */
export const colors = DARK_COLORS;

export const gradients = {
  accent: ['#ff7a52', '#ff5a3c', '#e2431f'] as const,
  success: ['#34d976', '#22c55e', '#16a34a'] as const,
  surface: ['#1f2330', '#161922'] as const,
};

export type AccentKey =
  | 'orange'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'red'
  | 'purple'
  | 'pink'
  | 'teal'
  | 'cyan'
  | 'indigo'
  | 'lime'
  | 'brown';

export type AccentTheme = {
  key: AccentKey;
  label: string;
  swatch: string;
  color: string;
  dim: string;
  glow: string;
  gradient: readonly [string, string, string];
};

export const ACCENT_THEMES: Record<AccentKey, AccentTheme> = {
  orange: {
    key: 'orange',
    label: 'Orange',
    swatch: '#ff5a3c',
    color: '#ff5a3c',
    dim: '#c8452e',
    glow: 'rgba(255, 90, 60, 0.18)',
    gradient: ['#ff7a52', '#ff5a3c', '#e2431f'],
  },
  blue: {
    key: 'blue',
    label: 'Blau',
    swatch: '#3b82f6',
    color: '#3b82f6',
    dim: '#2563eb',
    glow: 'rgba(59, 130, 246, 0.18)',
    gradient: ['#60a5fa', '#3b82f6', '#1d4ed8'],
  },
  green: {
    key: 'green',
    label: 'Grün',
    swatch: '#22c55e',
    color: '#22c55e',
    dim: '#16a34a',
    glow: 'rgba(34, 197, 94, 0.18)',
    gradient: ['#4ade80', '#22c55e', '#15803d'],
  },
  yellow: {
    key: 'yellow',
    label: 'Gelb',
    swatch: '#eab308',
    color: '#eab308',
    dim: '#ca8a04',
    glow: 'rgba(234, 179, 8, 0.18)',
    gradient: ['#facc15', '#eab308', '#a16207'],
  },
  red: {
    key: 'red',
    label: 'Rot',
    swatch: '#ef4444',
    color: '#ef4444',
    dim: '#dc2626',
    glow: 'rgba(239, 68, 68, 0.18)',
    gradient: ['#f87171', '#ef4444', '#b91c1c'],
  },
  purple: {
    key: 'purple',
    label: 'Lila',
    swatch: '#a78bfa',
    color: '#a78bfa',
    dim: '#8b5cf6',
    glow: 'rgba(167, 139, 250, 0.18)',
    gradient: ['#c4b5fd', '#a78bfa', '#7c3aed'],
  },
  pink: {
    key: 'pink',
    label: 'Pink',
    swatch: '#ec4899',
    color: '#ec4899',
    dim: '#db2777',
    glow: 'rgba(236, 72, 153, 0.18)',
    gradient: ['#f472b6', '#ec4899', '#be185d'],
  },
  teal: {
    key: 'teal',
    label: 'Türkis',
    swatch: '#14b8a6',
    color: '#14b8a6',
    dim: '#0d9488',
    glow: 'rgba(20, 184, 166, 0.18)',
    gradient: ['#2dd4bf', '#14b8a6', '#0f766e'],
  },
  cyan: {
    key: 'cyan',
    label: 'Cyan',
    swatch: '#22d3ee',
    color: '#22d3ee',
    dim: '#0891b2',
    glow: 'rgba(34, 211, 238, 0.18)',
    gradient: ['#67e8f9', '#22d3ee', '#0e7490'],
  },
  indigo: {
    key: 'indigo',
    label: 'Indigo',
    swatch: '#6366f1',
    color: '#6366f1',
    dim: '#4338ca',
    glow: 'rgba(99, 102, 241, 0.18)',
    gradient: ['#818cf8', '#6366f1', '#4338ca'],
  },
  lime: {
    key: 'lime',
    label: 'Limette',
    swatch: '#a3e635',
    color: '#a3e635',
    dim: '#65a30d',
    glow: 'rgba(163, 230, 53, 0.18)',
    gradient: ['#bef264', '#a3e635', '#4d7c0f'],
  },
  brown: {
    key: 'brown',
    label: 'Braun',
    swatch: '#a8734a',
    color: '#a8734a',
    dim: '#7c5334',
    glow: 'rgba(168, 115, 74, 0.18)',
    gradient: ['#c99a6e', '#a8734a', '#7c5334'],
  },
};

export const DEFAULT_ACCENT_KEY: AccentKey = 'orange';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export type Typography = {
  screenTitle: { fontSize: number; fontWeight: '800'; letterSpacing: number; color: string };
  title: { fontSize: number; fontWeight: '700'; letterSpacing: number; color: string };
  subtitle: { fontSize: number; fontWeight: '600'; color: string };
  body: { fontSize: number; fontWeight: '400'; color: string };
  label: { fontSize: number; fontWeight: '700'; color: string; letterSpacing: number };
  button: { fontSize: number; fontWeight: '800'; letterSpacing: number };
};

export function getTypography(c: Colors): Typography {
  return {
    screenTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, color: c.textPrimary },
    title: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3, color: c.textPrimary },
    subtitle: { fontSize: 15, fontWeight: '600', color: c.textSecondary },
    body: { fontSize: 14, fontWeight: '400', color: c.textSecondary },
    label: { fontSize: 12, fontWeight: '700', color: c.textMuted, letterSpacing: 0.6 },
    button: { fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
  };
}

/** @deprecated Use useTheme()/useSettings().typography instead — this is a static dark fallback. */
export const typography = getTypography(DARK_COLORS);

export function getShadow(c: Colors) {
  return {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 6,
    },
    glow: {
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 14,
      elevation: 8,
    },
  };
}

/** @deprecated Use useTheme()/useSettings().shadow instead — this is a static dark fallback. */
export const shadow = getShadow(DARK_COLORS);
