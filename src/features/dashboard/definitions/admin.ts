import { DashboardDefinition } from '../types';

export const adminDashboard: DashboardDefinition = {
  id: 'admin',
  title: 'Admin Dashboard',
  subtitle: 'System settings and analytics',
  layout: {
    columns: 2,
    gap: 12,
  },
  widgets: [
    {
      id: 'system-health',
      type: 'stat',
      config: {
        label: 'System Health',
        value: '99.9%',
        trend: 'Uptime last 30 days',
      },
    },
    {
      id: 'total-storage',
      type: 'stat',
      config: {
        label: 'Storage Used',
        value: '2.4 GB',
        trend: 'of 10 GB',
      },
    },
    {
      id: 'api-requests',
      type: 'stat',
      config: {
        label: 'API Requests',
        value: '1.2M',
        trend: 'Last 24 hours',
      },
    },
    {
      id: 'error-rate',
      type: 'stat',
      config: {
        label: 'Error Rate',
        value: '0.01%',
        trend: 'Below threshold',
      },
    },
    {
      id: 'system-metrics-chart',
      type: 'chart',
      config: {
        title: 'System Performance',
        chartType: 'area',
        data: {},
      },
    },
    {
      id: 'admin-activity',
      type: 'activity',
      config: {
        title: 'Admin Activity',
        activities: [
          {
            id: '1',
            title: 'System backup completed',
            meta: '2 hours ago',
            type: 'system',
          },
          {
            id: '2',
            title: 'Configuration updated',
            meta: '1 day ago',
            type: 'config',
          },
          {
            id: '3',
            title: 'Security audit passed',
            meta: '3 days ago',
            type: 'security',
          },
        ],
      },
    },
  ],
};
