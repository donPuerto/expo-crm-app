import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { YStack, XStack, Text } from '@/interface/primitives';

export interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  type?: string;
}

interface ActivityListProps {
  activities: ActivityItem[];
  title?: string;
  onItemPress?: (item: ActivityItem) => void;
}

/**
 * Activity list widget for displaying recent activity feed in dashboards with animations.
 */
export function ActivityList({ activities, title, onItemPress }: ActivityListProps) {
  return (
    <YStack gap="$3">
      {title && (
        <Text fontSize="$6" fontWeight="600" marginBottom="$1">
          {title}
        </Text>
      )}
      <FlatList
        data={activities}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <YStack height={8} />}
        renderItem={({ item, index }) => (
          <AnimatedActivityItem item={item} index={index} onPress={onItemPress} />
        )}
      />
    </YStack>
  );
}

function AnimatedActivityItem({
  item,
  index,
  onPress,
}: {
  item: ActivityItem;
  index: number;
  onPress?: (item: ActivityItem) => void;
}) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);

  useEffect(() => {
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 300 }));
    translateX.value = withDelay(index * 50, withSpring(0, { damping: 12 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <YStack
        backgroundColor="$card"
        borderColor="$borderColor"
        borderWidth={1}
        borderRadius="$3"
        padding="$4"
        gap="$2"
        elevation={2}
        onPress={() => onPress?.(item)}
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontWeight="600">{item.title}</Text>
          {item.type && (
            <Text
              fontSize="$1"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$3"
              backgroundColor="$gray5"
              textTransform="capitalize"
              fontWeight="600"
            >
              {item.type}
            </Text>
          )}
        </XStack>
        <Text opacity={0.7} fontSize="$2">
          {item.meta}
        </Text>
      </YStack>
    </Animated.View>
  );
}
