import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  ActivityList,
  ChartCard,
  DashboardGrid,
  DashboardHeader,
  StatCard,
  type ActivityItem,
} from '@/components/dashboard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createShadowStyle } from '@/lib/shadow-styles';
import { usersDashboard } from '@/features/dashboard/definitions';

export default function UsersDashboard() {
  const router = useRouter();
  const { title, subtitle, widgets, layout } = usersDashboard;
  const tint = useThemeColor({}, 'tint');

  return (
    <ThemedView style={styles.container}>
      <DashboardHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Pressable
            style={[
              styles.manageButton,
              { backgroundColor: tint },
              createShadowStyle({
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }),
            ]}
            onPress={() => router.push('/(crm)/users' as never)}
          >
            <ThemedText style={styles.manageButtonText}>Manage Users</ThemedText>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <DashboardGrid columns={layout?.columns} gap={layout?.gap}>
          {widgets.map((widget, index) => {
            if (widget.type === 'stat') {
              const config = widget.config as {
                label: string;
                value: string | number;
                trend?: string;
              };
              return <StatCard key={widget.id} {...config} index={index} />;
            }
            if (widget.type === 'activity') {
              const config = widget.config as { title?: string; activities: ActivityItem[] };
              return <ActivityList key={widget.id} {...config} />;
            }
            if (widget.type === 'chart') {
              const config = widget.config as { title: string; subtitle?: string };
              return (
                <ChartCard key={widget.id} title={config.title} subtitle={config.subtitle} index={index}>
                  <>{/* Placeholder for chart - implement chart library integration here */}</>
                </ChartCard>
              );
            }
            return null;
          })}
        </DashboardGrid>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  manageButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  manageButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
