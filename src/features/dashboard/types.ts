import { ActivityItem } from '@/components/dashboard';

export interface DashboardWidget {
  id: string;
  type: 'stat' | 'chart' | 'activity' | 'custom';
  config: Record<string, unknown>;
}

export interface DashboardDefinition {
  id: string;
  title: string;
  subtitle?: string;
  widgets: DashboardWidget[];
  layout?: {
    columns?: number;
    gap?: number;
  };
}

export interface StatWidgetConfig {
  label: string;
  value: string | number;
  trend?: string;
  icon?: string;
}

export interface ActivityWidgetConfig {
  title?: string;
  activities: ActivityItem[];
}

export interface ChartWidgetConfig {
  title: string;
  subtitle?: string;
  chartType: 'line' | 'bar' | 'pie' | 'area';
  data: unknown;
}
