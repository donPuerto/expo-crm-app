/**
 * Custom hook for theme utilities
 * Combines useTheme with app-specific theme logic
 */

import { useTheme } from '@tamagui/core';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useAppTheme() {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  return {
    // Theme object with optimized getters
    theme,

    // Current color scheme
    colorScheme,
    isDark: colorScheme === 'dark',
    isLight: colorScheme === 'light',

    // Common theme values (optimized with .get())
    backgroundColor: theme.background.get(),
    textColor: theme.color.get(),
    borderColor: theme.borderColor.get(),
    primaryColor: theme.primary?.get(),
    secondaryColor: theme.secondary?.get(),

    // Raw values (when you need actual color strings)
    backgroundValue: theme.background.val,
    textValue: theme.color.val,

    // Helper functions
    getThemeColor: (key: keyof typeof theme) => {
      const value = theme[key];
      return value && typeof value === 'object' && 'get' in value ? value.get() : value;
    },
  };
}

/**
 * Example usage:
 *
 * const { isDark, backgroundColor, textColor } = useAppTheme()
 *
 * // For external components (non-Tamagui)
 * <SomeLibraryComponent
 *   style={{
 *     backgroundColor,
 *     color: textColor,
 *   }}
 * />
 *
 * // Conditional rendering based on theme
 * {isDark && <DarkModeIcon />}
 */
