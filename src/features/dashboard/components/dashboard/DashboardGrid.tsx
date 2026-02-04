import React from 'react';
import { StyleSheet, View } from 'react-native';

interface DashboardGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
}

/**
 * Responsive grid layout for dashboard widgets.
 * Automatically adjusts columns based on screen size.
 */
export function DashboardGrid({ children, columns = 2, gap = 12 }: DashboardGridProps) {
  return (
    <View style={[styles.container, { gap }]}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={styles.item}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    flexGrow: 1,
    minWidth: '30%',
  },
});
