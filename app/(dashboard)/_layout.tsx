import { DashboardWrapper } from '@/components/dashboard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Stack } from 'expo-router';

export default function DashboardStack() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <DashboardWrapper>
      <Stack
        screenOptions={{
          headerShown: true,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: textColor,
          headerStyle: { backgroundColor },
          contentStyle: { backgroundColor },
          title: '',
        }}
      />
    </DashboardWrapper>
  );
}
