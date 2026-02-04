import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FontFamily = 'Inter' | 'Roboto' | 'OpenSans' | 'System';

export interface FontState {
  fontFamily: FontFamily;
  fontScale: number; // 0.8 to 1.5 (80% to 150%)
  setFontFamily: (family: FontFamily) => void;
  setFontScale: (scale: number) => void;
  resetFontSettings: () => void;
}

const defaultFontFamily: FontFamily = 'Inter';
const defaultFontScale = 1.0;

// Platform-specific storage adapter that uses Zustand's JSON storage
const customStorage = createJSONStorage<FontState>(() => {
  if (Platform.OS === 'web') {
    // Web: Use localStorage
    return {
      getItem: (name: string) => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem(name);
          }
          return null;
        } catch {
          return null;
        }
      },
      setItem: (name: string, value: string) => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(name, value);
          }
        } catch {
          // Ignore errors
        }
      },
      removeItem: (name: string) => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem(name);
          }
        } catch {
          // Ignore errors
        }
      },
    };
  }
  // Native: Use AsyncStorage
  return AsyncStorage;
});

export const useFontStore = create<FontState>()(
  persist(
    set => ({
      fontFamily: defaultFontFamily,
      fontScale: defaultFontScale,
      setFontFamily: family => set({ fontFamily: family }),
      setFontScale: scale => set({ fontScale: Math.max(0.8, Math.min(1.5, scale)) }),
      resetFontSettings: () => set({ fontFamily: defaultFontFamily, fontScale: defaultFontScale }),
    }),
    {
      name: 'font-preferences',
      storage: customStorage,
    }
  )
);
