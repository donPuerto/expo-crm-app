import { Platform, ViewStyle } from 'react-native';

/**
 * Creates shadow styles that work on both native and web platforms
 * @param options Shadow configuration options
 * @returns Style object with platform-appropriate shadow properties
 */
export function createShadowStyle(options: {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}): ViewStyle {
  const {
    shadowColor = '#000',
    shadowOffset = { width: 0, height: 1 },
    shadowOpacity = 0.1,
    shadowRadius = 2,
    elevation = 2,
  } = options;

  if (Platform.OS === 'web') {
    // For web, return empty object to avoid CSSStyleDeclaration errors
    // Shadows can be added via CSS classes or wrapper Views if needed
    // This prevents the "Failed to set an indexed property" error
    return {};
  }

  // For native platforms (iOS/Android), use shadow properties
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  };
}
