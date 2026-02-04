import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { YStack, Text } from '@/interface/primitives';

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
      <YStack
        backgroundColor="$card"
        borderColor="$borderColor"
        borderWidth={1}
        borderRadius="$4"
        padding="$5"
        gap="$4"
        elevation={3}
      >
        <YStack gap="$1">
          <Text fontSize="$6" fontWeight="700">
            {title}
          </Text>
          {subtitle && (
            <Text opacity={0.7} fontSize="$2" fontWeight="500">
              {subtitle}
            </Text>
          )}
        </YStack>
        <YStack minHeight={200} alignItems="center" justifyContent="center">
          {children}
        </YStack>
      </YStack>
    </Animated.View>
  );
}
