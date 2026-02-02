import { Redirect } from 'expo-router';

/**
 * Dashboard home - redirects to sales dashboard as default
 */
export default function DashboardsIndex() {
  return <Redirect href="/(dashboards)/sales" />;
}
