import { useEffect } from 'react';
import { YStack, XStack, H1, Text } from '@/interface/primitives';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

/**
 * Dashboard header component for consistent title and action bar styling with animations.
 */
export function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
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
      <YStack
        backgroundColor="$card"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingVertical="$5"
        paddingHorizontal="$6"
        elevation={2}
      >
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <H1 size="$8" marginBottom="$1">
              {title}
            </H1>
            {subtitle && (
              <Text fontSize="$3" opacity={0.7} fontWeight="500">
                {subtitle}
              </Text>
            )}
          </YStack>
          {actions && <XStack gap="$3">{actions}</XStack>}
        </XStack>
      </YStack>
    </Animated.View>
  );
}
