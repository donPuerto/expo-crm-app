import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createShadowStyle } from '@/lib/shadow-styles';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
  index?: number;
}

/**
 * Chart card widget container for displaying charts/graphs in dashboards with animations.
 */
export function ChartCard({ title, children, subtitle, index = 0 }: ChartCardProps) {
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(index * 100, withSpring(0, { damping: 15 }));
    scale.value = withDelay(index * 100, withSpring(1, { damping: 15 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ThemedView
        style={[
          styles.card,
          {
            borderColor,
            backgroundColor: cardBg,
          },
          createShadowStyle({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }),
        ]}
      >
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
          {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
        </View>
        <View style={styles.chartContainer}>{children}</View>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  title: {
    marginBottom: 0,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 13,
    fontWeight: '500',
  },
  chartContainer: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
