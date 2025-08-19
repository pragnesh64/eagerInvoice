/**
 * Typography system for EagerInvoice
 * Modern, clean typography with proper hierarchy
 */

export const Typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  
  // Font weights
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  
  // Line heights
  lineHeightTight: 1.25,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
  
  // Letter spacing
  letterSpacingTight: -0.5,
  letterSpacingNormal: 0,
  letterSpacingWide: 0.5,
};

// Predefined text styles for consistency
export const TextStyles = {
  // Headings
  h1: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    lineHeight: Typography.lineHeightTight,
    letterSpacing: Typography.letterSpacingTight,
  },
  h2: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    lineHeight: Typography.lineHeightTight,
    letterSpacing: Typography.letterSpacingTight,
  },
  h3: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.semibold,
    lineHeight: Typography.lineHeightTight,
    letterSpacing: Typography.letterSpacingNormal,
  },
  h4: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    lineHeight: Typography.lineHeightNormal,
    letterSpacing: Typography.letterSpacingNormal,
  },
  
  // Body text
  body: {
    fontSize: Typography.base,
    fontWeight: Typography.normal,
    lineHeight: Typography.lineHeightNormal,
    letterSpacing: Typography.letterSpacingNormal,
  },
  bodyLarge: {
    fontSize: Typography.lg,
    fontWeight: Typography.normal,
    lineHeight: Typography.lineHeightNormal,
    letterSpacing: Typography.letterSpacingNormal,
  },
  bodySmall: {
    fontSize: Typography.sm,
    fontWeight: Typography.normal,
    lineHeight: Typography.lineHeightNormal,
    letterSpacing: Typography.letterSpacingNormal,
  },
  
  // Caption and labels
  caption: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    lineHeight: Typography.lineHeightNormal,
    letterSpacing: Typography.letterSpacingWide,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    lineHeight: Typography.lineHeightNormal,
    letterSpacing: Typography.letterSpacingNormal,
  },
  
  // Special text styles
  display: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.extrabold,
    lineHeight: Typography.lineHeightTight,
    letterSpacing: Typography.letterSpacingTight,
  },
  monospace: {
    fontSize: Typography.base,
    fontWeight: Typography.normal,
    lineHeight: Typography.lineHeightNormal,
    letterSpacing: Typography.letterSpacingNormal,
    fontFamily: 'monospace',
  },
}; 