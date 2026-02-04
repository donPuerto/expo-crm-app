import React from 'react';
import { View, Text } from '@/interface/primitives';
import type { StyleProp, ViewStyle } from 'react-native';

export function AppLogo({
  size = 96,
  iconSize = 48,
  style,
}: {
  size?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={style}
      width={size}
      height={size}
      borderRadius={size / 2}
      backgroundColor="$blue10"
      alignItems="center"
      justifyContent="center"
    >
      <Text color="white" fontSize={iconSize * 0.5} fontWeight="800">
        CRM
      </Text>
    </View>
  );
}
