import { styled, GetProps } from 'tamagui';
import { View, Text } from 'tamagui';

// Badge component
export const Badge = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  paddingHorizontal: '$2.5',
  paddingVertical: '$1',
  borderRadius: '$12',
  borderWidth: 1,

  variants: {
    variant: {
      default: {
        backgroundColor: '$primary',
        borderColor: '$primary',
      },
      secondary: {
        backgroundColor: '$gray4',
        borderColor: '$borderColor',
      },
      destructive: {
        backgroundColor: '$red3',
        borderColor: '$red10',
      },
      success: {
        backgroundColor: '$green3',
        borderColor: '$green10',
      },
      warning: {
        backgroundColor: '$orange3',
        borderColor: '$orange10',
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: '$borderColor',
      },
    },
    size: {
      sm: {
        paddingHorizontal: '$2',
        paddingVertical: '$0.5',
        borderRadius: '$2',
      },
      md: {
        paddingHorizontal: '$2.5',
        paddingVertical: '$1',
        borderRadius: '$3',
      },
      lg: {
        paddingHorizontal: '$3',
        paddingVertical: '$1.5',
        borderRadius: '$3',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

// Badge Text
export const BadgeText = styled(Text, {
  fontSize: '$2',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: 0.5,

  variants: {
    variant: {
      default: {
        color: '$primaryForeground',
      },
      secondary: {
        color: '$gray12',
      },
      destructive: {
        color: '$red10',
      },
      success: {
        color: '$green10',
      },
      warning: {
        color: '$orange10',
      },
      outline: {
        color: '$color',
      },
    },
    size: {
      sm: {
        fontSize: '$1',
      },
      md: {
        fontSize: '$2',
      },
      lg: {
        fontSize: '$3',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

// Type exports
export type BadgeProps = GetProps<typeof Badge>;
export type BadgeTextProps = GetProps<typeof BadgeText>;
