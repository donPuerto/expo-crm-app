import { styled, GetProps } from 'tamagui';
import { Text } from 'tamagui';

// Label component for form fields
export const Label = styled(Text, {
  fontSize: '$2',
  fontWeight: '600',
  color: '$gray11',
  marginBottom: '$2',
  userSelect: 'none',

  variants: {
    required: {
      true: {
        // Add asterisk via pseudo-element on web
        // For native, append '*' to children
      },
    },
    uppercase: {
      true: {
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
    size: 'md',
  },
});

// Type export
export type LabelProps = GetProps<typeof Label>;
