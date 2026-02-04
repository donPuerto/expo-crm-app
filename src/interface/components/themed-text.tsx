/**
 * DEPRECATED: Use Tamagui Text/SizableText directly
 * This is a temporary compatibility wrapper during migration
 *
 * Migration Guide:
 * - Replace `<ThemedText>` → `<Text>` from tamagui
 * - Replace `<ThemedText type="title">` → `<H1>` or `<H2>` from tamagui
 * - Replace `<ThemedText type="subtitle">` → `<H3>` from tamagui
 * - Use `color="$color"` instead of lightColor/darkColor props
 * - Use `fontSize="$4"` instead of fixed pixel sizes
 */

import { Text, styled } from 'tamagui';
import type { TextProps } from 'tamagui';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

const StyledText = styled(Text, {
  color: '$color',

  variants: {
    type: {
      default: { fontSize: '$4', lineHeight: '$1' },
      defaultSemiBold: { fontSize: '$4', lineHeight: '$1', fontWeight: '600' },
      title: { fontSize: '$9', fontWeight: 'bold', lineHeight: '$1' },
      subtitle: { fontSize: '$6', fontWeight: 'bold' },
      link: { fontSize: '$4', lineHeight: '$1', color: '$blue10' },
    },
  } as const,
});

export function ThemedText({ type = 'default', lightColor, darkColor, ...props }: ThemedTextProps) {
  return <StyledText type={type} {...props} />;
}
