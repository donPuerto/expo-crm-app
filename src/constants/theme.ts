import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { Platform } from 'react-native';

export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(0 0% 3.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(0 0% 3.9%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(0 0% 3.9%)',
    primary: 'hsl(0 0% 9%)',
    primaryForeground: 'hsl(0 0% 98%)',
    secondary: 'hsl(0 0% 96.1%)',
    secondaryForeground: 'hsl(0 0% 9%)',
    muted: 'hsl(0 0% 96.1%)',
    mutedForeground: 'hsl(0 0% 45.1%)',
    accent: 'hsl(0 0% 96.1%)',
    accentForeground: 'hsl(0 0% 9%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    destructiveForeground: 'hsl(0 0% 98%)',
    border: 'hsl(0 0% 89.8%)',
    input: 'hsl(0 0% 89.8%)',
    ring: 'hsl(0 0% 63%)',
    radius: '0.625rem',
    chart1: 'hsl(12 76% 61%)',
    chart2: 'hsl(173 58% 39%)',
    chart3: 'hsl(197 37% 24%)',
    chart4: 'hsl(43 74% 66%)',
    chart5: 'hsl(27 87% 67%)',
  },
  dark: {
    background: 'hsl(0 0% 3.9%)',
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(0 0% 3.9%)',
    cardForeground: 'hsl(0 0% 98%)',
    popover: 'hsl(0 0% 3.9%)',
    popoverForeground: 'hsl(0 0% 98%)',
    primary: 'hsl(0 0% 98%)',
    primaryForeground: 'hsl(0 0% 9%)',
    secondary: 'hsl(0 0% 14.9%)',
    secondaryForeground: 'hsl(0 0% 98%)',
    muted: 'hsl(0 0% 14.9%)',
    mutedForeground: 'hsl(0 0% 63.9%)',
    accent: 'hsl(0 0% 14.9%)',
    accentForeground: 'hsl(0 0% 98%)',
    destructive: 'hsl(0 70.9% 59.4%)',
    destructiveForeground: 'hsl(0 0% 98%)',
    border: 'hsl(0 0% 14.9%)',
    input: 'hsl(0 0% 14.9%)',
    ring: 'hsl(300 0% 45%)',
    radius: '0.625rem',
    chart1: 'hsl(220 70% 50%)',
    chart2: 'hsl(160 60% 45%)',
    chart3: 'hsl(30 80% 55%)',
    chart4: 'hsl(280 65% 60%)',
    chart5: 'hsl(340 75% 55%)',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};

// Helper to convert HSL to RGB for React Native
function hslToRgb(hslString: string): string {
  // Parse HSL string like "hsl(0 0% 100%)" or "hsl(0, 0%, 100%)"
  const match = hslString.match(/hsl\((\d+)\s*,?\s*(\d+(?:\.\d+)?)%?\s*,?\s*(\d+(?:\.\d+)?)%?\)/);
  if (!match) return '#000000';

  const h = parseInt(match[1]) / 360;
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Legacy Colors export for backward compatibility
const tintColorLight = '#2563eb';
const tintColorDark = '#60a5fa';

export const Colors = {
  light: {
    // Legacy colors
    text: hslToRgb(THEME.light.foreground),
    background: hslToRgb(THEME.light.background),
    tint: tintColorLight,
    icon: '#6b7280',
    tabIconDefault: '#9ca3af',
    tabIconSelected: tintColorLight,
    success: '#10b981',
    warning: '#f59e0b',
    error: hslToRgb(THEME.light.destructive),

    // Shadcn colors (hyphenated names)
    foreground: hslToRgb(THEME.light.foreground),
    card: hslToRgb(THEME.light.card),
    'card-foreground': hslToRgb(THEME.light.cardForeground),
    popover: hslToRgb(THEME.light.popover),
    'popover-foreground': hslToRgb(THEME.light.popoverForeground),
    primary: hslToRgb(THEME.light.primary),
    'primary-foreground': hslToRgb(THEME.light.primaryForeground),
    secondary: hslToRgb(THEME.light.secondary),
    'secondary-foreground': hslToRgb(THEME.light.secondaryForeground),
    muted: hslToRgb(THEME.light.muted),
    'muted-foreground': hslToRgb(THEME.light.mutedForeground),
    accent: hslToRgb(THEME.light.accent),
    'accent-foreground': hslToRgb(THEME.light.accentForeground),
    destructive: hslToRgb(THEME.light.destructive),
    'destructive-foreground': hslToRgb(THEME.light.destructiveForeground),
    border: hslToRgb(THEME.light.border),
    input: hslToRgb(THEME.light.input),
    ring: hslToRgb(THEME.light.ring),
  },
  dark: {
    // Legacy colors
    text: hslToRgb(THEME.dark.foreground),
    background: hslToRgb(THEME.dark.background),
    tint: tintColorDark,
    icon: '#9ca3af',
    tabIconDefault: '#6b7280',
    tabIconSelected: tintColorDark,
    success: '#34d399',
    warning: '#fbbf24',
    error: hslToRgb(THEME.dark.destructive),

    // Shadcn colors (hyphenated names)
    foreground: hslToRgb(THEME.dark.foreground),
    card: hslToRgb(THEME.dark.card),
    'card-foreground': hslToRgb(THEME.dark.cardForeground),
    popover: hslToRgb(THEME.dark.popover),
    'popover-foreground': hslToRgb(THEME.dark.popoverForeground),
    primary: hslToRgb(THEME.dark.primary),
    'primary-foreground': hslToRgb(THEME.dark.primaryForeground),
    secondary: hslToRgb(THEME.dark.secondary),
    'secondary-foreground': hslToRgb(THEME.dark.secondaryForeground),
    muted: hslToRgb(THEME.dark.muted),
    'muted-foreground': hslToRgb(THEME.dark.mutedForeground),
    accent: hslToRgb(THEME.dark.accent),
    'accent-foreground': hslToRgb(THEME.dark.accentForeground),
    destructive: hslToRgb(THEME.dark.destructive),
    'destructive-foreground': hslToRgb(THEME.dark.destructiveForeground),
    border: hslToRgb(THEME.dark.border),
    input: hslToRgb(THEME.dark.input),
    ring: hslToRgb(THEME.dark.ring),
  },
};

// Inter font family (shadcn default) - applied globally via expo-font and CSS
export const Fonts = Platform.select({
  ios: {
    /** Inter font family (shadcn default) */
    sans: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    /** Inter font family (shadcn default) */
    sans: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    /** Inter font family (shadcn default) */
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    medium: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    semibold: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    bold: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
