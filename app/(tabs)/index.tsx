import React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Kpi = { label: string; value: string; trend?: string };
type Activity = { id: string; title: string; meta: string; type: 'lead' | 'contact' | 'task' };
type Task = { id: string; title: string; due: string; status: 'today' | 'upcoming' | 'overdue' };

const KPI_CARDS: Kpi[] = [
  { label: 'Open Leads', value: '24', trend: '+6 this week' },
  { label: 'Active Contacts', value: '128', trend: '12 with tasks' },
  { label: 'Meetings', value: '8', trend: '3 today' },
];

const ACTIVITIES: Activity[] = [
  { id: '1', title: 'Follow up with Acme Corp', meta: 'Lead  due today', type: 'lead' },
  { id: '2', title: 'Call Jane Smith', meta: 'Contact  overdue 1d', type: 'contact' },
  { id: '3', title: 'Prep demo deck', meta: 'Task  tomorrow', type: 'task' },
  { id: '4', title: 'Log notes for Northwind', meta: 'Lead  updated 2h ago', type: 'lead' },
];

const TASKS: Task[] = [
  { id: '1', title: 'Send proposal to Tech Inc', due: 'Today', status: 'today' },
  { id: '2', title: 'Confirm meeting with Bob', due: 'Tomorrow', status: 'upcoming' },
  { id: '3', title: 'Update pipeline stages', due: 'Fri', status: 'upcoming' },
  { id: '4', title: 'Call Jane about pricing', due: 'Overdue 1d', status: 'overdue' },
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.header}>
          CRM Home
        </ThemedText>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            KPIs
          </ThemedText>
          <View style={styles.kpiGrid}>
            {KPI_CARDS.map(card => (
              <ThemedView key={card.label} style={styles.kpiCard}>
                <ThemedText type="defaultSemiBold" style={styles.kpiValue}>
                  {card.value}
                </ThemedText>
                <ThemedText style={styles.kpiLabel}>{card.label}</ThemedText>
                {card.trend ? <ThemedText style={styles.kpiTrend}>{card.trend}</ThemedText> : null}
              </ThemedView>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick actions
          </ThemedText>
          <View style={styles.actionsRow}>
            <Link href="/(dashboard)/leads/add" asChild>
              <Pressable style={styles.actionButton}>
                <ThemedText type="defaultSemiBold" style={styles.actionText}>
                  Add Lead
                </ThemedText>
              </Pressable>
            </Link>
            <Link href="/(dashboard)/contacts/add" asChild>
              <Pressable style={styles.actionButton}>
                <ThemedText type="defaultSemiBold" style={styles.actionText}>
                  Add Contact
                </ThemedText>
              </Pressable>
            </Link>
            <Link href="/(tabs)/tasks" asChild>
              <Pressable style={styles.actionButtonSecondary}>
                <ThemedText type="defaultSemiBold">View Tasks</ThemedText>
              </Pressable>
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
            renderItem={({ item }) => (
              <ThemedView style={styles.listItem}>
                <View style={styles.listRow}>
                  <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                  <ThemedText style={styles.badge}>{item.type}</ThemedText>
                </View>
                <ThemedText style={styles.listMeta}>{item.meta}</ThemedText>
              </ThemedView>
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
                <ThemedText style={styles.link}>View all</ThemedText>
              </Pressable>
            </Link>
          </View>
          <FlatList
            data={TASKS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ThemedView style={styles.listItem}>
                <View style={styles.listRow}>
                  <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                  <ThemedText style={styles.badge}>{item.status}</ThemedText>
                </View>
                <ThemedText style={styles.listMeta}>{item.due}</ThemedText>
              </ThemedView>
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
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  scroll: {
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    flexGrow: 1,
    minWidth: '30%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  kpiValue: {
    fontSize: 18,
  },
  kpiLabel: {
    opacity: 0.7,
  },
  kpiTrend: {
    fontSize: 12,
    opacity: 0.7,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionButtonSecondary: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionText: {
    color: '#ffffff',
  },
  listItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listMeta: {
    opacity: 0.7,
  },
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    textTransform: 'capitalize',
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    height: 10,
  },
});
