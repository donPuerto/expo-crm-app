import React from 'react';
import { Text } from '@/interface/primitives';
import type { TextProps } from 'tamagui';

export type LabelProps = TextProps;

export function Label(props: LabelProps) {
  return <Text {...props} />;
}
