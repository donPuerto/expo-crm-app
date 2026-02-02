import { create } from 'zustand';
import { Platform } from 'react-native';

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

const STORAGE_KEY = 'font-preferences';

// Web-specific storage using localStorage
const loadFromStorage = (): Partial<FontState> => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.warn('Failed to load font preferences from localStorage', error);
  }
  return {};
};

const saveToStorage = (state: Partial<FontState>) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (error) {
    console.warn('Failed to save font preferences to localStorage', error);
  }
};

// Load initial state from storage
const initialState = loadFromStorage();

export const useFontStore = create<FontState>((set) => ({
  fontFamily: initialState.fontFamily ?? defaultFontFamily,
  fontScale: initialState.fontScale ?? defaultFontScale,
  setFontFamily: (family) => {
    set({ fontFamily: family });
    saveToStorage({ fontFamily: family, fontScale: useFontStore.getState().fontScale });
  },
  setFontScale: (scale) => {
    const clampedScale = Math.max(0.8, Math.min(1.5, scale));
    set({ fontScale: clampedScale });
    saveToStorage({ fontFamily: useFontStore.getState().fontFamily, fontScale: clampedScale });
  },
  resetFontSettings: () => {
    set({ fontFamily: defaultFontFamily, fontScale: defaultFontScale });
    saveToStorage({ fontFamily: defaultFontFamily, fontScale: defaultFontScale });
  },
}));
