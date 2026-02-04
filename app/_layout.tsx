import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet, View } from 'react-native';
import { TamaguiProvider, Theme } from '@tamagui/core';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import config from '@/tamagui/tamagui.config';

import { ThemedText } from '@/interface/components/themed-text';
import { ThemedView } from '@/interface/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NAV_THEME } from '@/constants/theme';

// Keep the splash screen visible while we load fonts
SplashScreen.preventAutoHideAsync();

// Suppress known warnings that are safe to ignore
LogBox.ignoreLogs([
  'Require cycles are allowed',
  'props.pointerEvents is deprecated. Use style.pointerEvents',
  'Blocked aria-hidden',
  'Unexpected text node',
  'SafeAreaView has been deprecated',
]);

// Note: Web console warning suppression removed since web is not a production target
// This code was for web development only

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

  // Load Inter font (shadcn default font)
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

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

  useEffect(() => {
    // Note: Web warning suppression kept for development/testing purposes only
    // Since web is not a production target, this code is optional
    // Suppress console warnings for known React Native Web issues (dev only)
    const originalWarn = console.warn;
    const originalError = console.error;

    // Declare these at the top level so they're accessible in cleanup
    let originalConsoleWarn: typeof window.console.warn | null = null;
    let originalConsoleError: typeof window.console.error | null = null;

    const shouldSuppress = (message: unknown): boolean => {
      if (typeof message === 'string') {
        return (
          message.includes('props.pointerEvents is deprecated') ||
          message.includes('Blocked aria-hidden') ||
          message.includes('aria-hidden') ||
          message.includes('assistive technology') ||
          message.includes('The focus must not be hidden') ||
          message.includes('Consider using the inert attribute') ||
          message.includes('Unexpected text node') ||
          message.includes('A text node cannot be a child')
        );
      }
      return false;
    };

    console.warn = (...args: unknown[]) => {
      if (shouldSuppress(args[0])) {
        return;
      }
      originalWarn(...args);
    };

    console.error = (...args: unknown[]) => {
      if (shouldSuppress(args[0])) {
        return;
      }
      originalError(...args);
    };

    // Also suppress browser console warnings on web (dev only)
    if (typeof window !== 'undefined') {
      originalConsoleWarn = window.console.warn;
      originalConsoleError = window.console.error;

      window.console.warn = (...args: unknown[]) => {
        if (shouldSuppress(args[0])) {
          return;
        }
        originalConsoleWarn!(...args);
      };

      window.console.error = (...args: unknown[]) => {
        if (shouldSuppress(args[0])) {
          return;
        }
        originalConsoleError!(...args);
      };
    }

    return () => {
      console.warn = originalWarn;
      console.error = originalError;
      if (typeof window !== 'undefined' && originalConsoleWarn && originalConsoleError) {
        window.console.warn = originalConsoleWarn;
        window.console.error = originalConsoleError;
      }
    };
  }, []);

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show loading screen while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemePreferenceContext.Provider value={contextValue}>
      <TamaguiProvider config={config} defaultTheme={resolvedScheme}>
        <Theme name={resolvedScheme === 'dark' ? 'dark' : 'light'}>
          <ThemeProvider value={NAV_THEME[resolvedScheme]}>
            <View style={{ flex: 1 }}>
              <Stack
                screenOptions={{
                  animation: 'fade',
                  animationDuration: 300,
                  animationTypeForReplace: 'push',
                }}
              >
                <Stack.Screen name="splash" options={{ headerShown: false, animation: 'none' }} />
                <Stack.Screen name="welcome" options={{ headerShown: false }} />
                <Stack.Screen name="(crm)" options={{ headerShown: false }} />
                <Stack.Screen name="(dashboards)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="terms"
                  options={{
                    presentation: 'modal',
                    title: 'Terms of Service',
                    animation: 'slide_from_bottom',
                  }}
                />
                <Stack.Screen
                  name="policy"
                  options={{
                    presentation: 'modal',
                    title: 'Privacy Policy',
                    animation: 'slide_from_bottom',
                  }}
                />
                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: 'modal',
                    title: 'Modal',
                    animation: 'slide_from_bottom',
                  }}
                />
                <Stack.Screen
                  name="(modals)/user-profile"
                  options={{
                    presentation: 'modal',
                    headerShown: false,
                    animation: 'slide_from_bottom',
                  }}
                />
              </Stack>
              <StatusBar style="auto" />
            </View>
          </ThemeProvider>
        </Theme>
      </TamaguiProvider>
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
