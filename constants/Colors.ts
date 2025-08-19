/**
 * Modern fintech-inspired color palette for EagerInvoice
 * Based on NeoPOP design principles with clean, professional colors
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    // Primary colors
    primary: '#2563eb', // Deep blue for trust & finance
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8',
    
    // Secondary colors
    secondary: '#8b5cf6', // Purple accent
    secondaryLight: '#a78bfa',
    secondaryDark: '#7c3aed',
    
    // Accent colors
    accent: '#10b981', // Green for success
    accentLight: '#34d399',
    accentDark: '#059669',
    
    // Warning & Error
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    
    // Neutral colors
    text: '#11181C',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    
    // Card & Surface colors
    card: '#ffffff',
    cardSecondary: '#f8fafc',
    cardBorder: '#e2e8f0',
    
    // Status colors
    success: '#10b981',
    pending: '#f59e0b',
    paid: '#10b981',
    overdue: '#ef4444',
    
    // Legacy colors (keeping for compatibility)
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    // Primary colors
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#2563eb',
    
    // Secondary colors
    secondary: '#a78bfa',
    secondaryLight: '#c4b5fd',
    secondaryDark: '#8b5cf6',
    
    // Accent colors
    accent: '#34d399',
    accentLight: '#6ee7b7',
    accentDark: '#10b981',
    
    // Warning & Error
    warning: '#fbbf24',
    error: '#f87171',
    
    // Neutral colors
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    border: '#334155',
    borderLight: '#475569',
    
    // Card & Surface colors
    card: '#1e293b',
    cardSecondary: '#334155',
    cardBorder: '#475569',
    
    // Status colors
    success: '#34d399',
    pending: '#fbbf24',
    paid: '#34d399',
    overdue: '#f87171',
    
    // Legacy colors (keeping for compatibility)
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Gradient presets for modern UI
export const Gradients = {
  primary: ['#2563eb', '#1d4ed8'],
  secondary: ['#8b5cf6', '#7c3aed'],
  success: ['#10b981', '#059669'],
  warning: ['#f59e0b', '#d97706'],
  error: ['#ef4444', '#dc2626'],
  card: ['#ffffff', '#f8fafc'],
  cardDark: ['#1e293b', '#334155'],
};

// Shadow presets for depth
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 16,
  },
};
