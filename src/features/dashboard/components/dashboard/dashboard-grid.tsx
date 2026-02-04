import React from 'react';
import { XStack, YStack, useMedia } from '@/interface/primitives';

interface DashboardGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: string | number;
}

/**
 * Responsive grid layout for dashboard widgets.
 * Automatically adjusts columns based on screen size.
 */
export function DashboardGrid({ children, columns = 2, gap = '$3' }: DashboardGridProps) {
  const media = useMedia();
  const responsiveWidth = media.gtLg ? '30%' : media.gtMd ? '45%' : '100%';

  return (
    <XStack flexWrap="wrap" gap={gap}>
      {React.Children.map(children, (child, index) => (
        <YStack key={index} flexGrow={1} minWidth={responsiveWidth}>
          {child}
        </YStack>
      ))}
    </XStack>
  );
}
