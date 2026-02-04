import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { onPress, onPressIn, children, accessibilityState, style, ...rest } =
    props as BottomTabBarButtonProps & { ref?: unknown };

  const { ref: _ignoredRef, ...pressableProps } = rest as any;

  return (
    <Pressable
      {...pressableProps}
      accessibilityState={accessibilityState}
      onPress={onPress}
      onPressIn={event => {
        if (Platform.OS !== 'web') {
          void Haptics.selectionAsync();
        }
        onPressIn?.(event);
      }}
      style={style}
    >
      {children}
    </Pressable>
  );
}
