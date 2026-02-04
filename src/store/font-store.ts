import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type FontFamily = 'Inter' | 'Roboto' | 'OpenSans' | 'System';

interface FontState {
  fontFamily: FontFamily;
  fontScale: number;
  setFontFamily: (fontFamily: FontFamily) => void;
  setFontScale: (fontScale: number) => void;
}

const storage = createJSONStorage<FontState>(() => {
  if (Platform.OS === 'web') {
    return {
      getItem: name => localStorage.getItem(name),
      setItem: (name, value) => localStorage.setItem(name, value),
      removeItem: name => localStorage.removeItem(name),
    };
  }

  return AsyncStorage;
});

export const useFontStore = create<FontState>()(
  persist(
    set => ({
      fontFamily: 'Inter',
      fontScale: 1,
      setFontFamily: fontFamily => set({ fontFamily }),
      setFontScale: fontScale => set({ fontScale }),
    }),
    {
      name: 'font-store',
      storage,
    }
  )
);
