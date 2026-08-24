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
