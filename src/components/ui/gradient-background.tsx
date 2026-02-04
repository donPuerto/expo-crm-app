import React from 'react';
import { LinearGradient } from '@/interface/primitives';
import type { LinearGradientProps } from '@tamagui/linear-gradient';
import type { StyleProp, ViewStyle } from 'react-native';

type Props = Pick<LinearGradientProps, 'colors' | 'start' | 'end' | 'locations'> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function GradientBackground({ children, style, ...props }: Props) {
  return (
    <LinearGradient {...props} style={[{ flex: 1 }, style]}>
      {children}
    </LinearGradient>
  );
}
