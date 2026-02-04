import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';

const MAPPING: Record<string, React.ComponentProps<typeof MaterialIcons>['name']> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.3.fill': 'group',
  'tray.full.fill': 'inbox',
  'checkmark.circle.fill': 'check-circle',
  'gearshape.fill': 'settings',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
}) {
  const mapped = MAPPING[name] ?? 'help-outline';
  return <MaterialIcons color={color} size={size} name={mapped} style={style} />;
}
