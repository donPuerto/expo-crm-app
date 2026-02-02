import { DashboardDefinition } from '../types';

export const usersDashboard: DashboardDefinition = {
  id: 'users',
  title: 'Users Dashboard',
  subtitle: 'User management and activity',
  layout: {
    columns: 2,
    gap: 12,
  },
  widgets: [
    {
      id: 'total-users',
      type: 'stat',
      config: {
        label: 'Total Users',
        value: 128,
        trend: '+8 this month',
      },
    },
    {
      id: 'active-users',
      type: 'stat',
      config: {
        label: 'Active Users',
        value: 94,
        trend: 'Last 30 days',
      },
    },
    {
      id: 'new-signups',
      type: 'stat',
      config: {
        label: 'New Signups',
        value: 12,
        trend: 'This week',
      },
    },
    {
      id: 'user-satisfaction',
      type: 'stat',
      config: {
        label: 'Satisfaction Score',
        value: '4.6/5',
        trend: 'Based on 45 reviews',
      },
    },
    {
      id: 'user-activity-chart',
      type: 'chart',
      config: {
        title: 'User Activity Over Time',
        chartType: 'line',
        data: {},
      },
    },
    {
      id: 'recent-users',
      type: 'activity',
      config: {
        title: 'Recent User Activity',
        activities: [
          {
            id: '1',
            title: 'New user registered: Jane Doe',
            meta: '2 hours ago',
            type: 'user',
          },
          {
            id: '2',
            title: 'Profile updated: John Smith',
            meta: '5 hours ago',
            type: 'user',
          },
          {
            id: '3',
            title: 'Role changed: Admin → Manager',
            meta: '1 day ago',
            type: 'admin',
          },
        ],
      },
    },
  ],
};
