import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');

  return (
    <ThemedView style={styles.container}>
      {title && (
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
      )}
      <FlatList
        data={activities}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={[styles.separator]} />}
        renderItem={({ item, index }) => (
          <AnimatedActivityItem
            item={item}
            index={index}
            borderColor={borderColor}
            cardBg={cardBg}
            onPress={onItemPress}
          />
        )}
      />
    </ThemedView>
  );
}

function AnimatedActivityItem({
  item,
  index,
  borderColor,
  cardBg,
  onPress,
}: {
  item: ActivityItem;
  index: number;
  borderColor: string;
  cardBg: string;
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
      <ThemedView
        style={[
          styles.item,
          {
            borderColor,
            backgroundColor: cardBg,
          },
          createShadowStyle({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }),
        ]}
        onTouchEnd={() => onPress?.(item)}
        accessible={!!onPress}
      >
        <View style={styles.row}>
          <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
          {item.type && (
            <ThemedText style={styles.badge}>{item.type}</ThemedText>
          )}
        </View>
        <ThemedText style={styles.meta}>{item.meta}</ThemedText>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    marginBottom: 4,
  },
  item: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  meta: {
    opacity: 0.7,
    fontSize: 12,
  },
  separator: {
    height: 8,
  },
});
