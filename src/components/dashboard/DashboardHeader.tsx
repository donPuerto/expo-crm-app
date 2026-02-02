import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createShadowStyle } from '@/lib/shadow-styles';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

/**
 * Dashboard header component for consistent title and action bar styling with animations.
 */
export function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'card');

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    translateY.value = withSpring(0, { damping: 15 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ThemedView
        style={[
          styles.container,
          {
            borderBottomColor: borderColor,
            backgroundColor,
          },
          createShadowStyle({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }),
        ]}
      >
        <View style={styles.content}>
          <View>
            <ThemedText type="title" style={styles.title}>
              {title}
            </ThemedText>
            {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
          </View>
          {actions && <View style={styles.actions}>{actions}</View>}
        </View>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginBottom: 4,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
