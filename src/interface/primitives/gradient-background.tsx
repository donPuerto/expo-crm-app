import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import { addOpacityToHex } from '@/lib/utils';
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
 * Reusable gradient background component that uses theme colors
 * Automatically adapts to light/dark mode
 * Creates a subtle gradient that's not too strong
 */
export function GradientBackground({
  children,
  style,
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  locations,
}: GradientBackgroundProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'card');

  // Default gradient colors - subtle transition from background to slightly tinted
  // Uses very low opacity primary color for a gentle gradient effect
  const defaultColors = colors || [
    backgroundColor,
    addOpacityToHex(primaryColor, 0.05), // Very subtle tint (5% opacity)
    backgroundColor,
  ];

  const gradientStyle = StyleSheet.flatten([styles.gradient, style]);

  return (
    <LinearGradient
      colors={defaultColors}
      start={start}
      end={end}
      locations={locations}
      style={gradientStyle}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
