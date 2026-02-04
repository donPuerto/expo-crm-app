import { styled, GetProps } from 'tamagui';
import { TextArea as TamaguiTextArea } from 'tamagui';

// Textarea component (multi-line input)
export const Textarea = styled(TamaguiTextArea, {
  minHeight: 80,
  borderWidth: 1,
  borderRadius: '$2',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  color: '$color',
  backgroundColor: '$card',
  borderColor: '$borderColor',
  placeholderTextColor: '$gray9',
  fontSize: '$4',
  lineHeight: '$4',
  textAlignVertical: 'top',

  focusStyle: {
    borderColor: '$primary',
    outlineWidth: 0,
  },

  hoverStyle: {
    borderColor: '$gray8',
  },

  variants: {
    size: {
      sm: {
        minHeight: 60,
        fontSize: '$3',
        paddingHorizontal: '$3',
        paddingVertical: '$2',
      },
      md: {
        minHeight: 80,
        fontSize: '$4',
        paddingHorizontal: '$4',
        paddingVertical: '$3',
      },
      lg: {
        minHeight: 120,
        fontSize: '$5',
        paddingHorizontal: '$5',
        paddingVertical: '$4',
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
    disabled: {
      true: {
        opacity: 0.5,
        backgroundColor: '$gray2',
        cursor: 'not-allowed',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
});

// Type export
export type TextareaProps = GetProps<typeof Textarea>;
