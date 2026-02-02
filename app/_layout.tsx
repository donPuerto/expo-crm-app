import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'splash',
};

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemePreferenceContextValue = {
  themePreference: ThemePreference;
  setThemePreference: (value: ThemePreference) => void;
  toggleTheme: () => void;
};

export const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

// Purpose: expose theme preference helpers for screens.
export function useThemePreference() {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used within ThemePreferenceContext');
  }
  return ctx;
}

// Purpose: render a fallback UI for unhandled errors.
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <ThemedView style={styles.errorContainer}>
      <ThemedText type="title">Something went wrong!</ThemedText>
      <ThemedText style={styles.errorText}>{error.message}</ThemedText>
      <ThemedText type="link" onPress={retry} style={styles.retryButton}>
        Try again
      </ThemedText>
    </ThemedView>
  );
}

// Purpose: configure root navigation and theming.
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');

  // Purpose: resolve the active theme based on preference or system.
  const resolvedScheme = themePreference === 'system' ? (colorScheme ?? 'light') : themePreference;

  // Purpose: memoize theme preference helpers to avoid unnecessary re-renders.
  const contextValue = useMemo<ThemePreferenceContextValue>(
    () => ({
      themePreference,
      setThemePreference,
      toggleTheme: () => {
        const next =
          themePreference === 'system'
            ? (colorScheme ?? 'light') === 'dark'
              ? 'light'
              : 'dark'
            : themePreference === 'dark'
              ? 'light'
              : 'dark';
        setThemePreference(next);
      },
    }),
    [themePreference, colorScheme]
  );

  LogBox.ignoreLogs([
    'Require cycles are allowed',
    'props.pointerEvents is deprecated. Use style.pointerEvents',
  ]);

  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const first = args[0];
      if (typeof first === 'string' && first.includes('props.pointerEvents is deprecated')) {
        return;
      }
      originalWarn(...args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return (
    <ThemePreferenceContext.Provider value={contextValue}>
      <ThemeProvider value={resolvedScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen
            name="(modals)/user-profile"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ThemePreferenceContext.Provider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    marginVertical: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  retryButton: {
    marginTop: 8,
  },
});
