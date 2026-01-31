import { DashboardWrapper } from '@/components/dashboard';
import { Stack } from 'expo-router';

export default function DashboardStack() {
  return (
    <DashboardWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </DashboardWrapper>
  );
}
