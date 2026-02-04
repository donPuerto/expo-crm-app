import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { YStack, Text } from 'tamagui';

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
      <YStack
        backgroundColor="$card"
        borderColor="$borderColor"
        borderWidth={1}
        borderRadius="$4"
        padding="$5"
        gap="$2"
      >
        {icon && <YStack marginBottom="$2">{icon}</YStack>}
        <Text color="$color" fontSize="$9" fontWeight="bold" marginBottom="$1">
          {value}
        </Text>
        <Text opacity={0.7} fontSize="$3" fontWeight="500">
          {label}
        </Text>
        {trend && (
          <Text color="$green10" fontSize="$2" fontWeight="600" marginTop="$1">
            {trend}
          </Text>
        )}
      </YStack>
    </Animated.View>
  );
}
