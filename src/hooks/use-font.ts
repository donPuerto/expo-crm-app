import { Platform } from 'react-native';
import { useFontStore } from '@/features/theme/font-store';

/**
 * Hook to get current font settings and apply them dynamically
 * Returns font family name and scale multiplier for use in styles
 */
export function useFont() {
  const { fontFamily, fontScale } = useFontStore();

  const getFontFamily = (): string => {
    if (Platform.OS === 'web') {
      switch (fontFamily) {
        case 'Inter':
          return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
        case 'Roboto':
          return "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        case 'OpenSans':
          return "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        case 'System':
          return "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
        default:
          return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
      }
    }

    // Native platforms
    switch (fontFamily) {
      case 'Inter':
        return 'Inter_400Regular';
      case 'Roboto':
        return Platform.select({ ios: 'System', android: 'Roboto', default: 'System' });
      case 'OpenSans':
        return Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });
      case 'System':
        return Platform.select({ ios: 'System', android: 'Roboto', default: 'System' });
      default:
        return 'Inter_400Regular';
    }
  };

  const getScaledFontSize = (baseSize: number): number => {
    return baseSize * fontScale;
  };

  return {
    fontFamily: getFontFamily(),
    fontScale,
    getScaledFontSize,
  };
}
