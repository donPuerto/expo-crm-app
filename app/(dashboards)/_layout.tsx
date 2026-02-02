import { DashboardShell } from '@/components/dashboard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Stack } from 'expo-router';

export default function DashboardsStack() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <DashboardShell>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor },
        }}
      />
    </DashboardShell>
  );
}
