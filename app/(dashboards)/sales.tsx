import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import {
    ActivityList,
    ChartCard,
    DashboardGrid,
    DashboardHeader,
    StatCard,
    type ActivityItem,
} from '@/components/dashboard';
import { ThemedView } from '@/components/themed-view';
import { salesDashboard } from '@/features/dashboard/definitions';

export default function SalesDashboard() {
  const { title, subtitle, widgets, layout } = salesDashboard;

  return (
    <ThemedView style={styles.container}>
      <DashboardHeader title={title} subtitle={subtitle} />
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
});
