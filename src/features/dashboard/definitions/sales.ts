import { DashboardDefinition } from '../types';

export const salesDashboard: DashboardDefinition = {
  id: 'sales',
  title: 'Sales Dashboard',
  subtitle: 'Pipeline overview and revenue metrics',
  layout: {
    columns: 2,
    gap: 12,
  },
  widgets: [
    {
      id: 'total-revenue',
      type: 'stat',
      config: {
        label: 'Total Revenue',
        value: '$124,500',
        trend: '+12% this month',
      },
    },
    {
      id: 'active-deals',
      type: 'stat',
      config: {
        label: 'Active Deals',
        value: 24,
        trend: '+6 this week',
      },
    },
    {
      id: 'conversion-rate',
      type: 'stat',
      config: {
        label: 'Conversion Rate',
        value: '32%',
        trend: '+2% improvement',
      },
    },
    {
      id: 'avg-deal-size',
      type: 'stat',
      config: {
        label: 'Avg Deal Size',
        value: '$5,200',
        trend: 'Steady',
      },
    },
    {
      id: 'pipeline-chart',
      type: 'chart',
      config: {
        title: 'Sales Pipeline',
        chartType: 'bar',
        data: {},
      },
    },
    {
      id: 'recent-activity',
      type: 'activity',
      config: {
        title: 'Recent Sales Activity',
        activities: [
          {
            id: '1',
            title: 'Deal closed: Acme Corp',
            meta: 'Deal value: $15,000',
            type: 'deal',
          },
          {
            id: '2',
            title: 'New lead: Tech Inc',
            meta: 'Qualified 2h ago',
            type: 'lead',
          },
          {
            id: '3',
            title: 'Follow-up scheduled',
            meta: 'Meeting tomorrow',
            type: 'task',
          },
        ],
      },
    },
  ],
};
