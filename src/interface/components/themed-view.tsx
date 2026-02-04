/**
 * DEPRECATED: Use Tamagui YStack/XStack directly
 * This is a temporary compatibility wrapper during migration
 *
 * Migration Guide:
 * - Replace `<ThemedView>` → `<YStack>` or `<XStack>` from tamagui
 * - Use `backgroundColor="$background"` instead of lightColor/darkColor props
 * - Use proper Stack components for better layout control
 */

import { YStack } from 'tamagui';
import type { YStackProps } from 'tamagui';

export type ThemedViewProps = YStackProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ lightColor, darkColor, ...props }: ThemedViewProps) {
  return <YStack backgroundColor="$background" {...props} />;
}
