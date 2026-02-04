import { styled, GetProps, withStaticProperties } from 'tamagui';
import { View, Text, Image } from 'tamagui';

// Avatar container
const AvatarFrame = styled(View, {
  position: 'relative',
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$primary',
  borderRadius: '$12',

  variants: {
    size: {
      sm: {
        width: 32,
        height: 32,
      },
      md: {
        width: 40,
        height: 40,
      },
      lg: {
        width: 48,
        height: 48,
      },
      xl: {
        width: 64,
        height: 64,
      },
      '2xl': {
        width: 96,
        height: 96,
      },
    },
    circular: {
      true: {
        borderRadius: 9999,
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    circular: true,
  },
});

// Avatar Image
const AvatarImage = styled(Image, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

// Avatar Fallback (initials or icon)
const AvatarFallback = styled(View, {
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$primary',
});

// Avatar Text (for initials)
const AvatarText = styled(Text, {
  fontWeight: 'bold',
  color: '$primaryForeground',
  textAlign: 'center',

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
      xl: {
        fontSize: '$6',
      },
      '2xl': {
        fontSize: '$10',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
});

// Compound export
export const Avatar = withStaticProperties(AvatarFrame, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Text: AvatarText,
});

// Type exports
export type AvatarProps = GetProps<typeof AvatarFrame>;
export type AvatarImageProps = GetProps<typeof AvatarImage>;
export type AvatarFallbackProps = GetProps<typeof AvatarFallback>;
export type AvatarTextProps = GetProps<typeof AvatarText>;

// Helper function to get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
