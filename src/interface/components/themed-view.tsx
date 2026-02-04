import React from 'react';

import { View, type GetProps } from '@/interface/primitives';

export type ThemedViewProps = GetProps<typeof View>;

export function ThemedView(props: ThemedViewProps) {
  return <View {...props} />;
}
