import React from 'react';

export type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

export function Icon({
  as: As,
  size,
  color,
}: {
  as: IconComponent;
  size?: number;
  color?: string;
}) {
  return <As size={size} color={color} />;
}
