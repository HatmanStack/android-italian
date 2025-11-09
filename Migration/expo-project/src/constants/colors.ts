/**
 * Color palette extracted from Android app
 * Source: app/src/main/res/values/colors.xml
 */

export const colors = {
  // Primary colors from Android app
  primary: '#3F51B5', // Indigo Blue
  primaryDark: '#303F9F', // Darker Indigo
  accent: '#e94142', // Red accent
  orange: '#e96929', // Orange accent

  // Base colors
  white: '#fcf8f6', // Off-white
  black: '#000000',
  grey: '#1E1D1D',

  // Extended palette for UI components
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  surface: '#FFFFFF',

  // Text colors
  text: '#212121',
  textSecondary: '#757575',
  textDisabled: '#9E9E9E',
  textInverse: '#FFFFFF',

  // Semantic colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',

  // Borders and dividers
  border: '#E0E0E0',
  divider: '#BDBDBD',

  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',

  // Card and shadow
  shadow: '#000000',
  cardBackground: '#FFFFFF',
} as const;

export type ColorKey = keyof typeof colors;
