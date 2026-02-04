import { useEffect, useState } from 'react';
import { Platform, useColorScheme as useRNColorScheme } from 'react-native';

export type AppColorScheme = 'light' | 'dark';

/**
 * App-level color scheme hook.
 *
 * Notes:
 * - Normalizes React Native's `null` to `'light'`.
 * - On web, returns `'light'` until hydration to avoid SSR/static render mismatch.
 */
export function useColorScheme(): AppColorScheme {
  const [hasHydrated, setHasHydrated] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS === 'web') setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();
  const normalized: AppColorScheme = colorScheme === 'dark' ? 'dark' : 'light';

  return hasHydrated ? normalized : 'light';
}
