import React from 'react';

import { YStack, type GetProps } from '@/interface/primitives';
import type { TransitionDirection } from '@/hooks/use-route-transition';

type Props = {
  direction: TransitionDirection;
  offset?: number;
  children: React.ReactNode;
} & GetProps<typeof YStack>;

export function DirectionalPageTransition({
  direction,
  offset = 24,
  children,
  ...stackProps
}: Props) {
  const enterX = direction === 'backward' ? -offset : direction === 'forward' ? offset : 0;
  const exitX = direction === 'backward' ? offset : direction === 'forward' ? -offset : 0;

  return (
    <YStack
      {...stackProps}
      // Keep `transition` always present (Tamagui animation hook constraint)
      transition="quick"
      enterStyle={{ opacity: 0, x: enterX, y: 6, scale: 0.985 }}
      exitStyle={{ opacity: 0, x: exitX, y: -6, scale: 0.985 }}
    >
      {children}
    </YStack>
  );
}
