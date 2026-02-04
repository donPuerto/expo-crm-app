import React from 'react';
import { Text as TamaguiText } from '@/interface/primitives';
import type { GetProps } from 'tamagui';

type LegacyVariant = 'small' | 'default' | 'h3' | 'h4';

export type TextProps = GetProps<typeof TamaguiText> & {
  variant?: LegacyVariant;
};

export function Text({ variant, ...props }: TextProps) {
  if (variant === 'small') {
    return <TamaguiText fontSize="$2" opacity={0.8} {...props} />;
  }
  if (variant === 'h3') {
    return <TamaguiText fontSize="$7" fontWeight="700" {...props} />;
  }
  if (variant === 'h4') {
    return <TamaguiText fontSize="$6" fontWeight="700" {...props} />;
  }
  return <TamaguiText {...props} />;
}
