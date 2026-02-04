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

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon?: React.ReactNode;
  index?: number;
}

/**
 * Stat card widget for displaying key metrics in dashboards with animations.
 */
export function StatCard({ label, value, trend, icon, index = 0 }: StatCardProps) {
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const successColor = useThemeColor({}, 'success');

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 400 }));
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
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <ThemedText type="defaultSemiBold" style={[styles.value, { color: textColor }]}>
          {value}
        </ThemedText>
        <ThemedText style={styles.label}>{label}</ThemedText>
        {trend && (
          <ThemedText style={[styles.trend, { color: successColor }]}>{trend}</ThemedText>
        )}
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 6,
  },
  iconContainer: {
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    opacity: 0.7,
    fontSize: 14,
    fontWeight: '500',
  },
  trend: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
