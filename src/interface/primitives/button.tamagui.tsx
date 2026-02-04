import { styled, GetProps, createStyledContext, withStaticProperties } from 'tamagui';
import { View, Text as TamaguiText } from 'tamagui';

// Create button context for sharing variant props
const ButtonContext = createStyledContext({
  variant: 'default' as 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link',
  size: 'default' as 'default' | 'sm' | 'lg' | 'icon',
});

// Button Frame (the pressable container)
const ButtonFrame = styled(View, {
  context: ButtonContext,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  borderRadius: '$3',
  cursor: 'pointer',

  focusStyle: {
    outlineWidth: 3,
    outlineColor: '$blue8',
    outlineStyle: 'solid',
  },

  disabledStyle: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  variants: {
    variant: {
      default: {
        backgroundColor: '$primary',
        elevation: '$1',
        hoverStyle: { backgroundColor: '$primary', opacity: 0.9 },
        pressStyle: { backgroundColor: '$primary', opacity: 0.9 },
      },
      destructive: {
        backgroundColor: '$red10',
        elevation: '$1',
        hoverStyle: { backgroundColor: '$red10', opacity: 0.9 },
        pressStyle: { backgroundColor: '$red10', opacity: 0.9 },
        focusStyle: {
          outlineWidth: 3,
          outlineColor: '$red8',
          outlineStyle: 'solid',
        },
      },
      outline: {
        backgroundColor: '$background',
        borderWidth: 1,
        borderColor: '$borderColor',
        elevation: '$1',
        hoverStyle: { backgroundColor: '$gray3' },
        pressStyle: { backgroundColor: '$gray4' },
      },
      secondary: {
        backgroundColor: '$gray4',
        elevation: '$1',
        hoverStyle: { backgroundColor: '$gray4', opacity: 0.8 },
        pressStyle: { backgroundColor: '$gray4', opacity: 0.8 },
      },
      ghost: {
        backgroundColor: 'transparent',
        hoverStyle: { backgroundColor: '$gray3' },
        pressStyle: { backgroundColor: '$gray4' },
      },
      link: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
      },
    },
    size: {
      default: {
        height: 48,
        paddingHorizontal: '$4',
        paddingVertical: '$3',
        borderRadius: '$3',
      },
      sm: {
        height: 36,
        paddingHorizontal: '$3',
        paddingVertical: '$1.5',
        borderRadius: '$2',
        gap: '$1.5',
      },
      lg: {
        height: 56,
        paddingHorizontal: '$6',
        paddingVertical: '$4',
        borderRadius: '$3',
      },
      icon: {
        height: 40,
        width: 40,
        paddingHorizontal: 0,
        paddingVertical: 0,
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

// Button Text (styled text that inherits button context)
const ButtonText = styled(TamaguiText, {
  context: ButtonContext,
  fontSize: '$4',
  fontWeight: '600',
  color: '$color',
  userSelect: 'none',

  variants: {
    variant: {
      default: {
        color: '$primaryForeground',
      },
      destructive: {
        color: '$white',
      },
      outline: {
        color: '$color',
      },
      secondary: {
        color: '$gray12',
      },
      ghost: {
        color: '$color',
      },
      link: {
        color: '$primary',
        textDecorationLine: 'underline',
        hoverStyle: {
          textDecorationLine: 'underline',
        },
      },
    },
    size: {
      default: {
        fontSize: '$4',
      },
      sm: {
        fontSize: '$3',
      },
      lg: {
        fontSize: '$5',
      },
      icon: {
        fontSize: '$4',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

// Compound export with static properties
export const Button = withStaticProperties(ButtonFrame, {
  Text: ButtonText,
  Props: ButtonFrame.staticConfig,
});

// Type exports
export type ButtonProps = GetProps<typeof ButtonFrame>;
export type ButtonTextProps = GetProps<typeof ButtonText>;
