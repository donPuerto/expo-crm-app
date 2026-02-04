import React from 'react';
import { View, Text } from '@/interface/primitives';
import type { StyleProp, ViewStyle } from 'react-native';

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
}

export function Avatar({
  fallback,
  size = 40,
  style,
}: {
  fallback: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={style}
      width={size}
      height={size}
      borderRadius={size / 2}
      backgroundColor="$gray6"
      alignItems="center"
      justifyContent="center"
    >
      <Text color="white" fontWeight="700">
        {getInitials(fallback)}
      </Text>
    </View>
  );
}
