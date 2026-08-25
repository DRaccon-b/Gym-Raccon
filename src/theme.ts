export const colors = {
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

export const gradients = {
  accent: ['#ff7a52', '#ff5a3c', '#e2431f'] as const,
  success: ['#34d976', '#22c55e', '#16a34a'] as const,
  surface: ['#1f2330', '#161922'] as const,
};

export type AccentKey = 'orange' | 'blue' | 'green' | 'yellow' | 'red';

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

export const typography = {
  screenTitle: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5, color: colors.textPrimary },
  title: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3, color: colors.textPrimary },
  subtitle: { fontSize: 15, fontWeight: '600' as const, color: colors.textSecondary },
  body: { fontSize: 14, fontWeight: '400' as const, color: colors.textSecondary },
  label: { fontSize: 12, fontWeight: '700' as const, color: colors.textMuted, letterSpacing: 0.6 },
  button: { fontSize: 16, fontWeight: '800' as const, letterSpacing: 0.2 },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
};
