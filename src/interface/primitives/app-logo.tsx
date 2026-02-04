import { BarChart3 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface AppLogoProps {
  size?: number;
  iconSize?: number;
  style?: ViewStyle;
}

/**
 * Reusable App Logo Component
 * Displays the application logo icon in a themed container
 *
 * @param size - Size of the logo container (default: 96)
 * @param iconSize - Size of the icon inside (default: 48)
 * @param style - Additional styles for the container
 */
export function AppLogo({ size = 96, iconSize = 48, style }: AppLogoProps) {
  const primaryColor = useThemeColor({}, 'tint');

  const containerStyle = StyleSheet.flatten([
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 4, // 24 when size is 96
      backgroundColor: primaryColor,
    },
    style,
  ]);

  return (
    <View style={containerStyle}>
      <BarChart3 size={iconSize} color="#ffffff" strokeWidth={2.5} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
