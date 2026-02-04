import React from 'react';

import { Text, type GetProps } from '@/interface/primitives';

type BaseTextProps = GetProps<typeof Text>;

export type ThemedTextType = 'default' | 'defaultSemiBold' | 'title' | 'subtitle' | 'link';

export type ThemedTextProps = BaseTextProps & {
  type?: ThemedTextType;
};

export function ThemedText({ type = 'default', ...props }: ThemedTextProps) {
  switch (type) {
    case 'title':
      return <Text fontSize="$8" fontWeight="800" {...props} />;
    case 'subtitle':
      return <Text fontSize="$6" fontWeight="700" {...props} />;
    case 'defaultSemiBold':
      return <Text fontWeight="700" {...props} />;
    case 'link':
      return <Text color="$primary" textDecorationLine="underline" {...props} />;
    case 'default':
    default:
      return <Text {...props} />;
  }
}
