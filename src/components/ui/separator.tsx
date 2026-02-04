import React from 'react';
import { Separator as TamaguiSeparator } from '@/interface/primitives';
import type { GetProps } from 'tamagui';

export type SeparatorProps = GetProps<typeof TamaguiSeparator> & {
  orientation?: 'horizontal' | 'vertical';
};

export function Separator({ orientation, vertical, ...props }: SeparatorProps) {
  return <TamaguiSeparator vertical={orientation === 'vertical' || vertical} {...props} />;
}
