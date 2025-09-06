/**
 * Modern fintech-inspired color palette for EagerInvoice
 * Based on NeoPOP design principles with clean, professional colors
 * Light Blue Theme
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
    
    // Neutral colors - Light Blue Theme
    text: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#64748b',
    background: '#f0f8ff', // Alice Blue - main background
    backgroundSecondary: '#e6f3ff', // Lighter blue for secondary backgrounds
    border: '#bfdbfe', // Light blue border
    borderLight: '#dbeafe', // Very light blue border
    
    // Card & Surface colors - Light Blue Theme
    card: '#ffffff',
    cardSecondary: '#f8fbff', // Very light blue tint
    cardBorder: '#bfdbfe',
    
    // Status colors
    success: '#10b981',
    pending: '#f59e0b',
    paid: '#10b981',
    overdue: '#ef4444',
    
    // Legacy colors (keeping for compatibility)
    tint: tintColorLight,
    icon: '#475569',
    tabIconDefault: '#64748b',
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
    
    // Neutral colors - Dark Blue Theme
    text: 'white',
    textSecondary: 'lightgray',
    textMuted: '#94a3b8',
    background: '#0f172a', // Dark blue background
    backgroundSecondary: '#1e293b', // Slightly lighter dark blue
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

// Gradient presets for modern UI - Updated with light blue theme
export const Gradients = {
  primary: ['#2563eb', '#1d4ed8'],
  secondary: ['#8b5cf6', '#7c3aed'],
  success: ['#10b981', '#059669'],
  warning: ['#f59e0b', '#d97706'],
  error: ['#ef4444', '#dc2626'],
  card: ['#ffffff', '#f8fbff'], // Light blue card gradient
  cardDark: ['#1e293b', '#334155'],
  background: ['#f0f8ff', '#e6f3ff'], // Light blue background gradient
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
