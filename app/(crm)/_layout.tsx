import { useThemeColor } from '@/hooks/use-theme-color';
import { Stack } from 'expo-router';

export default function CRMStack() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTintColor: textColor,
        headerStyle: { backgroundColor },
        contentStyle: { backgroundColor },
        title: '',
      }}
    />
  );
}
