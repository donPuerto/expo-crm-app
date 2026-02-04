/**
 * Example component demonstrating useMedia and useTheme
 * Shows responsive design and theming patterns
 */

import { View, Text, styled, useMedia, useTheme } from '@tamagui/core';

// Styled component with variants
const CardFrame = styled(View, {
  backgroundColor: '$card',
  borderRadius: '$4',
  borderWidth: 1,
  borderColor: '$borderColor',
  padding: '$4',

  variants: {
    elevated: {
      true: {
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    },
  } as const,
});

export function ResponsiveCard() {
  const media = useMedia();
  const theme = useTheme();

  // Example: Compiler-optimized approach (preferred)
  return (
    <CardFrame
      elevated
      // Responsive padding
      padding="$3"
      $gtSm={{ padding: '$4' }}
      $gtMd={{ padding: '$6' }}
      // Responsive flex direction
      flexDirection="column"
      $gtMd={{ flexDirection: 'row' }}
    >
      <Text fontSize="$4" $gtSm={{ fontSize: '$5' }} $gtMd={{ fontSize: '$6' }} color="$color">
        Responsive Card
      </Text>

      <Text marginTop="$2" $gtMd={{ marginTop: 0, marginLeft: '$4' }} color={theme.color.get()}>
        This card adapts to screen size
      </Text>
    </CardFrame>
  );
}

// Example: Hook-based approach (for complex logic)
export function ConditionalCard() {
  const media = useMedia();
  const theme = useTheme();

  // Use hooks for conditional rendering
  if (!media.gtSm) {
    return (
      <View padding="$3" backgroundColor={theme.background.get()}>
        <Text fontSize="$3" color={theme.color.get()}>
          Mobile View
        </Text>
      </View>
    );
  }

  return (
    <View
      padding="$6"
      backgroundColor={theme.background.get()}
      flexDirection={media.gtMd ? 'row' : 'column'}
    >
      <Text fontSize="$6" color={theme.color.get()}>
        Desktop View
      </Text>
    </View>
  );
}

/**
 * Example: Combining responsive + theme logic
 */
export function AdvancedCard() {
  const media = useMedia();
  const theme = useTheme();

  return (
    <View
      // Responsive layout with theme colors
      y={media.sm ? 10 : 0}
      backgroundColor={media.lg ? theme.primary.get() : theme.secondary.get()}
      // Spread pattern for complex responsive logic
      {...(media.xl && {
        padding: theme.space6.val,
        borderRadius: theme.radius6.val,
      })}
    >
      <Text color={theme.color.get()}>Advanced responsive + themed card</Text>
    </View>
  );
}
