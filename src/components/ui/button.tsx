import React from 'react';
import { Button as TamaguiButton, Text } from '@/interface/primitives';
import type { GetProps } from 'tamagui';

type LegacyVariant = 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';

export type ButtonProps = Omit<GetProps<typeof TamaguiButton>, 'variant'> & {
  variant?: LegacyVariant;
};

export function Button({ variant = 'default', children, ...props }: ButtonProps) {
  const mappedVariant = variant === 'outline' ? 'outlined' : undefined;

  const extraStyles =
    variant === 'destructive'
      ? { backgroundColor: '$red10' as const }
      : variant === 'secondary'
        ? { backgroundColor: '$gray4' as const }
        : variant === 'ghost' || variant === 'link'
          ? { backgroundColor: 'transparent' as const }
          : undefined;

  return (
    <TamaguiButton
      {...props}
      {...(mappedVariant ? ({ variant: mappedVariant } as any) : null)}
      {...(extraStyles ?? null)}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text>{children}</Text>
      ) : (
        children
      )}
    </TamaguiButton>
  );
}
