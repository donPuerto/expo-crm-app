import { styled, GetProps, withStaticProperties } from 'tamagui';
import { View, Text as TamaguiText, H2, H3 } from 'tamagui';

// Card container
const CardFrame = styled(View, {
  backgroundColor: '$card',
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: '$4',
  padding: '$6',
  gap: '$6',
  elevation: '$1',

  variants: {
    elevated: {
      true: {
        elevation: '$3',
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    },
    size: {
      sm: {
        padding: '$4',
        gap: '$4',
        borderRadius: '$3',
      },
      md: {
        padding: '$6',
        gap: '$6',
        borderRadius: '$4',
      },
      lg: {
        padding: '$8',
        gap: '$8',
        borderRadius: '$5',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
});

// Card Header (for title/description section)
const CardHeader = styled(View, {
  gap: '$1.5',
  paddingHorizontal: '$6',
  marginHorizontal: '-$6',
  marginTop: '-$6',
  paddingTop: '$6',
  paddingBottom: '$4',
});

// Card Title
const CardTitle = styled(H2, {
  fontSize: '$6',
  fontWeight: 'bold',
  color: '$color',
  lineHeight: '$6',

  variants: {
    size: {
      sm: {
        fontSize: '$5',
      },
      md: {
        fontSize: '$6',
      },
      lg: {
        fontSize: '$7',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
});

// Card Description
const CardDescription = styled(TamaguiText, {
  fontSize: '$3',
  color: '$gray11',
  lineHeight: '$3',

  variants: {
    size: {
      sm: {
        fontSize: '$2',
      },
      md: {
        fontSize: '$3',
      },
      lg: {
        fontSize: '$4',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
});

// Card Content (main content area)
const CardContent = styled(View, {
  paddingTop: 0,
});

// Card Footer (for actions/buttons)
const CardFooter = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$3',
  paddingHorizontal: '$6',
  paddingTop: '$4',
  paddingBottom: '$6',
  marginHorizontal: '-$6',
  marginBottom: '-$6',

  variants: {
    justify: {
      start: {
        justifyContent: 'flex-start',
      },
      center: {
        justifyContent: 'center',
      },
      end: {
        justifyContent: 'flex-end',
      },
      between: {
        justifyContent: 'space-between',
      },
    },
  } as const,

  defaultVariants: {
    justify: 'start',
  },
});

// Compound export
export const Card = withStaticProperties(CardFrame, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

// Type exports
export type CardProps = GetProps<typeof CardFrame>;
export type CardHeaderProps = GetProps<typeof CardHeader>;
export type CardTitleProps = GetProps<typeof CardTitle>;
export type CardDescriptionProps = GetProps<typeof CardDescription>;
export type CardContentProps = GetProps<typeof CardContent>;
export type CardFooterProps = GetProps<typeof CardFooter>;
