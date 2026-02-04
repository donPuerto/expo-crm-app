import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Paragraph, SizableText } from '@/interface/primitives';

type Task = {
  id: string;
  title: string;
  due: string;
  status: 'today' | 'upcoming' | 'overdue';
};

const TASKS: Task[] = [
  { id: '1', title: 'Call Acme about contract', due: 'Today', status: 'today' },
  { id: '2', title: 'Send deck to Tech Inc', due: 'Tomorrow', status: 'upcoming' },
  { id: '3', title: 'Follow up with Jane', due: 'Overdue 1d', status: 'overdue' },
  { id: '4', title: 'Prep demo slides', due: 'Fri', status: 'upcoming' },
];

export default function TasksScreen() {
  const [filter, setFilter] = React.useState<Task['status'] | 'all'>('today');

  const filtered = React.useMemo(
    () => (filter === 'all' ? TASKS : TASKS.filter(task => task.status === filter)),
    [filter]
  );

  return (
    <View style={styles.container}>
      <SizableText size="$8" fontWeight="800" style={styles.header}>
        Tasks
      </SizableText>

      <View style={styles.filters}>
        {['today', 'upcoming', 'overdue', 'all'].map(value => (
          <Pressable
            key={value}
            onPress={() => setFilter(value as Task['status'] | 'all')}
            style={[styles.chip, filter === value && styles.chipActive]}
          >
            <Paragraph style={filter === value ? styles.chipLabelActive : styles.chipLabel}>
              {value === 'all' ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)}
            </Paragraph>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.addButton}>
        <Paragraph fontWeight="700" style={styles.addButtonText}>
          + Add Task
        </Paragraph>
      </Pressable>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <Pressable style={styles.card}>
            <Paragraph fontWeight="700">{item.title}</Paragraph>
            <Paragraph style={styles.meta}>{item.due}</Paragraph>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipLabel: {
    opacity: 0.8,
  },
  chipLabelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  addButtonText: {
    color: '#ffffff',
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  meta: {
    opacity: 0.7,
  },
  separator: {
    height: 10,
  },
});
