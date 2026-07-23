export const colors = {
  // Brand
  primary: '#1A5FA8',
  primaryDark: '#0F4169',
  primaryLight: '#EBF2FB',

  // Surfaces
  background: '#F4F6F9',
  surface: '#FFFFFF',

  // Text
  text: '#1A202C',
  textMuted: '#64748B',
  textLight: '#94A3B8',
  textOnPrimary: '#FFFFFF',

  // Border
  border: '#E2E8F0',

  // Semantic
  success: '#22A85A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',

  // Risk levels
  risk: {
    raro: '#22C55E',
    baixo: '#84CC16',
    atencao: '#D97706',
    alto: '#F97316',
    extremo: '#DC2626',
  },
} as const;

export const typography = {
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 28,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 7,
  },
} as const;

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

const theme = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  iconSize,
} as const;

export default theme;