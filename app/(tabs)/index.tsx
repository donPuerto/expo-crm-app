import React, { useEffect } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createShadowStyle } from '@/lib/shadow-styles';

type Kpi = { label: string; value: string; trend?: string };
type Activity = { id: string; title: string; meta: string; type: 'lead' | 'contact' | 'task' };
type Task = { id: string; title: string; due: string; status: 'today' | 'upcoming' | 'overdue' };

const KPI_CARDS: Kpi[] = [
  { label: 'Open Leads', value: '24', trend: '+6 this week' },
  { label: 'Active Contacts', value: '128', trend: '12 with tasks' },
  { label: 'Meetings', value: '8', trend: '3 today' },
];

const ACTIVITIES: Activity[] = [
  { id: '1', title: 'Follow up with Acme Corp', meta: 'Lead due today', type: 'lead' },
  { id: '2', title: 'Call Jane Smith', meta: 'Contact overdue 1d', type: 'contact' },
  { id: '3', title: 'Prep demo deck', meta: 'Task tomorrow', type: 'task' },
  { id: '4', title: 'Log notes for Northwind', meta: 'Lead updated 2h ago', type: 'lead' },
];

const TASKS: Task[] = [
  { id: '1', title: 'Send proposal to Tech Inc', due: 'Today', status: 'today' },
  { id: '2', title: 'Confirm meeting with Bob', due: 'Tomorrow', status: 'upcoming' },
  { id: '3', title: 'Update pipeline stages', due: 'Fri', status: 'upcoming' },
  { id: '4', title: 'Call Jane about pricing', due: 'Overdue 1d', status: 'overdue' },
];

function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(index * 100, withSpring(0, { damping: 15, stiffness: 100 }));
    scale.value = withDelay(index * 100, withSpring(1, { damping: 15, stiffness: 100 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

function AnimatedButton({
  children,
  onPress,
  variant = 'primary',
  index = 0,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  index?: number;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const borderColor = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');
  const cardBg = useThemeColor({}, 'card');

  useEffect(() => {
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 300 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress || (() => {})}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.actionButton,
          variant === 'primary'
            ? { backgroundColor: tint }
            : { backgroundColor: cardBg, borderWidth: 1, borderColor },
          createShadowStyle({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }),
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AnimatedCard index={0}>
          <ThemedText type="title" style={[styles.header, { color: textColor }]}>
            CRM Home
          </ThemedText>
        </AnimatedCard>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            KPIs
          </ThemedText>
          <View style={styles.kpiGrid}>
            {KPI_CARDS.map((card, index) => (
              <AnimatedCard key={card.label} index={index + 1}>
                <ThemedView
                  style={[
                    styles.kpiCard,
                    {
                      backgroundColor: cardBg,
                      borderColor,
                    },
                  ]}
                >
                  <ThemedText type="defaultSemiBold" style={[styles.kpiValue, { color: tint }]}>
                    {card.value}
                  </ThemedText>
                  <ThemedText style={styles.kpiLabel}>{card.label}</ThemedText>
                  {card.trend ? (
                    <ThemedText style={[styles.kpiTrend, { color: tint }]}>{card.trend}</ThemedText>
                  ) : null}
                </ThemedView>
              </AnimatedCard>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick actions
          </ThemedText>
          <View style={styles.actionsRow}>
            <Link href="/(crm)/leads/add" asChild>
              <AnimatedButton variant="primary" index={0}>
                <ThemedText type="defaultSemiBold" style={styles.actionText}>
                  Add Lead
                </ThemedText>
              </AnimatedButton>
            </Link>
            <Link href="/(crm)/contacts/add" asChild>
              <AnimatedButton variant="primary" index={1}>
                <ThemedText type="defaultSemiBold" style={styles.actionText}>
                  Add Contact
                </ThemedText>
              </AnimatedButton>
            </Link>
            <Link href="/(tabs)/tasks" asChild>
              <AnimatedButton variant="secondary" index={2}>
                <ThemedText type="defaultSemiBold">View Tasks</ThemedText>
              </AnimatedButton>
            </Link>
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recent activity
          </ThemedText>
          <FlatList
            data={ACTIVITIES}
            keyExtractor={item => item.id}
            renderItem={({ item, index: itemIndex }) => (
              <AnimatedCard index={itemIndex + 4}>
                <ThemedView
                  style={[
                    styles.listItem,
                    {
                      backgroundColor: cardBg,
                      borderColor,
                    },
                    createShadowStyle({
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      elevation: 2,
                    }),
                  ]}
                >
                  <View style={styles.listRow}>
                    <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                    <ThemedText style={[styles.badge, { backgroundColor: borderColor }]}>
                      {item.type}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.listMeta}>{item.meta}</ThemedText>
                </ThemedView>
              </AnimatedCard>
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Upcoming tasks
            </ThemedText>
            <Link href="/(tabs)/tasks" asChild>
              <Pressable>
                <ThemedText style={[styles.link, { color: tint }]}>View all</ThemedText>
              </Pressable>
            </Link>
          </View>
          <FlatList
            data={TASKS}
            keyExtractor={item => item.id}
            renderItem={({ item, index: itemIndex }) => (
              <AnimatedCard index={itemIndex + 8}>
                <ThemedView
                  style={[
                    styles.listItem,
                    {
                      backgroundColor: cardBg,
                      borderColor,
                    },
                    createShadowStyle({
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      elevation: 2,
                    }),
                  ]}
                >
                  <View style={styles.listRow}>
                    <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                    <ThemedText style={[styles.badge, { backgroundColor: borderColor }]}>
                      {item.status}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.listMeta}>{item.due}</ThemedText>
                </ThemedView>
              </AnimatedCard>
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  scroll: {
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    marginBottom: 8,
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '700',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  kpiCard: {
    flexGrow: 1,
    minWidth: '30%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 6,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  kpiLabel: {
    opacity: 0.7,
    fontSize: 14,
    fontWeight: '500',
  },
  kpiTrend: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  listItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listMeta: {
    opacity: 0.7,
    fontSize: 13,
  },
  badge: {
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  link: {
    fontWeight: '600',
    fontSize: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    height: 12,
  },
});
