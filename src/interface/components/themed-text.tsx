import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useFont } from '@/hooks/use-font';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const { fontFamily, getScaledFontSize } = useFont();

  const baseStyles = {
    default: {
      fontSize: getScaledFontSize(16),
      lineHeight: getScaledFontSize(24),
      fontFamily,
    },
    defaultSemiBold: {
      fontSize: getScaledFontSize(16),
      lineHeight: getScaledFontSize(24),
      fontWeight: '600' as const,
      fontFamily,
    },
    title: {
      fontSize: getScaledFontSize(32),
      fontWeight: 'bold' as const,
      lineHeight: getScaledFontSize(32),
      fontFamily,
    },
    subtitle: {
      fontSize: getScaledFontSize(20),
      fontWeight: 'bold' as const,
      fontFamily,
    },
    link: {
      lineHeight: getScaledFontSize(30),
      fontSize: getScaledFontSize(16),
      color: '#0a7ea4',
      fontFamily,
    },
  };

  return (
    <Text
      style={[
        { color },
        type === 'default' ? baseStyles.default : undefined,
        type === 'title' ? baseStyles.title : undefined,
        type === 'defaultSemiBold' ? baseStyles.defaultSemiBold : undefined,
        type === 'subtitle' ? baseStyles.subtitle : undefined,
        type === 'link' ? baseStyles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

// Styles are now dynamically generated in the component using useFont hook
