import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

// Platform-specific storage adapter that avoids import.meta
const createStorage = () => {
  if (Platform.OS === 'web') {
    // Web: Use localStorage with JSON serialization
    return {
      getItem: (name: string): Promise<string | null> => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            const value = window.localStorage.getItem(name);
            return Promise.resolve(value);
          }
          return Promise.resolve(null);
        } catch (error) {
          return Promise.resolve(null);
        }
      },
      setItem: (name: string, value: string): Promise<void> => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(name, value);
          }
          return Promise.resolve();
        } catch (error) {
          return Promise.resolve();
        }
      },
      removeItem: (name: string): Promise<void> => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem(name);
          }
          return Promise.resolve();
        } catch (error) {
          return Promise.resolve();
        }
      },
    };
  }
  // Native: Use AsyncStorage
  return AsyncStorage;
};

// Create storage instance at module load time
const storage = createStorage();

export const useFontStore = create<FontState>()(
  persist(
    (set) => ({
      fontFamily: defaultFontFamily,
      fontScale: defaultFontScale,
      setFontFamily: (family) => set({ fontFamily: family }),
      setFontScale: (scale) => set({ fontScale: Math.max(0.8, Math.min(1.5, scale)) }),
      resetFontSettings: () => set({ fontFamily: defaultFontFamily, fontScale: defaultFontScale }),
    }),
    {
      name: 'font-preferences',
      storage,
    }
  )
);
