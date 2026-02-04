import { forwardRef } from 'react';
import { TextInput, type TextInputProps as RNTextInputProps } from 'react-native';
import { styled, type GetProps } from 'tamagui';

/**
 * Tamagui-styled Input component
 *
 * Usage:
 * <Input
 *   placeholder="Enter email"
 *   value={email}
 *   onChangeText={setEmail}
 *   keyboardType="email-address"
 * />
 */
export const Input = styled(TextInput, {
  name: 'Input',

  // Base styles
  height: 48,
  borderWidth: 1,
  borderRadius: '$2',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  fontSize: '$4',
  color: '$color',
  backgroundColor: '$card',
  borderColor: '$borderColor',

  // Placeholder color
  placeholderTextColor: '$gray9',

  // Disabled state
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  // Focus state (web only)
  focusStyle: {
    borderColor: '$primary',
    outlineWidth: 0,
  },

  variants: {
    size: {
      sm: {
        height: 40,
        paddingHorizontal: '$3',
        fontSize: '$3',
      },
      md: {
        height: 48,
        paddingHorizontal: '$4',
        fontSize: '$4',
      },
      lg: {
        height: 56,
        paddingHorizontal: '$5',
        fontSize: '$5',
      },
    },

    error: {
      true: {
        borderColor: '$red10',
        focusStyle: {
          borderColor: '$red10',
        },
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
});

export type InputProps = GetProps<typeof Input>;
