import { config as defaultConfig } from '@tamagui/config';
import { createTamagui } from '@tamagui/core';
import { animations } from './animations';

/**
 * Tamagui Configuration following v5 standards
 *
 * Animation Drivers (platform-specific):
 * - Web: Motion driver (animations.ts) - Off-thread WAAPI performance
 * - Native: Reanimated driver (animations.native.ts) - Off-thread native performance
 *
 * Note: We're using @tamagui/config v2.0.0-rc.1 which doesn't have /v5 exports yet.
 * This config follows v5 best practices and structure for easy migration when v5 is stable.
 *
 * Key v5 principles applied:
 * - Standard theme keys (background, color, borderColor, shadowColor, etc.)
 * - BaseTheme pattern with satisfies for type safety
 * - Semantic color naming for brand colors
 * - Proper dark/light theme pairing
 * - Platform-specific animation drivers
 */

// Define the base light theme with all standard Tamagui keys
const light = {
  // ===== Standard Tamagui Theme Keys (v5) =====
  // These keys are expected by Tamagui components

  // Background colors
  background: '#ffffff',
  backgroundHover: '#f5f5f5',
  backgroundPress: '#efefef',
  backgroundFocus: '#f5f5f5',
  backgroundStrong: '#e5e5e5',
  backgroundTransparent: 'rgba(255, 255, 255, 0.8)',

  // Text/foreground colors
  color: '#0a0a0a',
  colorHover: '#000000',
  colorPress: '#0a0a0a',
  colorFocus: '#0a0a0a',
  colorTransparent: 'rgba(0, 0, 0, 0.5)',

  // Border colors
  borderColor: '#e5e5e5',
  borderColorHover: '#d4d4d4',
  borderColorFocus: '#a3a3a3',
  borderColorPress: '#d4d4d4',

  // Other semantic colors
  placeholderColor: '#737373',
  outlineColor: '#000000',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowColorHover: 'rgba(0, 0, 0, 0.15)',

  // ===== Custom Brand Colors =====
  // App-specific semantic colors
  primary: '#0a0a0a',
  primaryForeground: '#fafafa',
  secondary: '#f5f5f5',
  secondaryForeground: '#0a0a0a',
  destructive: '#ef4444',
  destructiveForeground: '#fafafa',
  muted: '#f5f5f5',
  mutedForeground: '#737373',
  accent: '#f5f5f5',
  accentForeground: '#0a0a0a',
  popover: '#ffffff',
  popoverForeground: '#0a0a0a',
  card: '#ffffff',
  cardForeground: '#0a0a0a',

  // Chart/data visualization colors
  chart1: '#f87171',
  chart2: '#2dd4bf',
  chart3: '#334155',
  chart4: '#fde047',
  chart5: '#fb923c',
};

// Create a base type from light theme to ensure dark theme has identical structure
type BaseTheme = typeof light;

// Dark theme - enforces same keys as light theme via BaseTheme type
const dark: BaseTheme = {
  // ===== Standard Tamagui Theme Keys (v5) =====

  // Background colors
  background: '#0a0a0a',
  backgroundHover: '#171717',
  backgroundPress: '#262626',
  backgroundFocus: '#171717',
  backgroundStrong: '#3a3a3a',
  backgroundTransparent: 'rgba(0, 0, 0, 0.8)',

  // Text/foreground colors
  color: '#fafafa',
  colorHover: '#ffffff',
  colorPress: '#fafafa',
  colorFocus: '#fafafa',
  colorTransparent: 'rgba(255, 255, 255, 0.5)',

  // Border colors
  borderColor: '#262626',
  borderColorHover: '#404040',
  borderColorFocus: '#525252',
  borderColorPress: '#404040',

  // Other semantic colors
  placeholderColor: '#a3a3a3',
  outlineColor: '#ffffff',
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  shadowColorHover: 'rgba(0, 0, 0, 0.4)',

  // ===== Custom Brand Colors =====

  primary: '#fafafa',
  primaryForeground: '#0a0a0a',
  secondary: '#262626',
  secondaryForeground: '#fafafa',
  destructive: '#dc2626',
  destructiveForeground: '#fafafa',
  muted: '#262626',
  mutedForeground: '#a3a3a3',
  accent: '#262626',
  accentForeground: '#fafafa',
  popover: '#0a0a0a',
  popoverForeground: '#fafafa',
  card: '#0a0a0a',
  cardForeground: '#fafafa',

  // Chart colors
  chart1: '#ef4444',
  chart2: '#14b8a6',
  chart3: '#64748b',
  chart4: '#eab308',
  chart5: '#f97316',
};

// Export all themes using satisfies for better type inference (v5 pattern)
export const allThemes = {
  light,
  dark,
} satisfies Record<string, BaseTheme>;

// Create Tamagui configuration
const config = createTamagui({
  ...defaultConfig,
  themes: allThemes,
  animations,
  // v5 settings (when using @tamagui/config/v5):
  // - styleCompat: 'react-native' (flexBasis: 0 by default)
  // - no defaultPosition (defaults to static instead of relative)
  // - fastSchemeChange: true
  // - shouldAddPrefersColorThemes: true
});

export type AppConfig = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
