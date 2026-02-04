import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
}

/**
 * Web fallback for GradientBackground to avoid CSSStyleDeclaration errors.
 * Since web is not a production target, we render a solid background color.
 */
export function GradientBackground({ children, style, colors }: GradientBackgroundProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const fallbackColor = colors?.[0] ?? backgroundColor;

  const combinedStyle = StyleSheet.flatten([
    styles.container,
    { backgroundColor: fallbackColor },
    style,
  ]);

  return <View style={combinedStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
