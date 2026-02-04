import React from 'react';
import { Card as TamaguiCard, YStack } from '@/interface/primitives';
import type { GetProps } from 'tamagui';

export type CardProps = GetProps<typeof TamaguiCard>;
export type CardContentProps = GetProps<typeof YStack>;

export function Card(props: CardProps) {
  return (
    <TamaguiCard
      padding="$4"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
      {...props}
    />
  );
}

export function CardContent(props: CardContentProps) {
  return <YStack padding="$4" {...props} />;
}
