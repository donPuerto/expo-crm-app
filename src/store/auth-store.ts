/**
 * Authentication Store
 * Global state management for user authentication using Zustand with AsyncStorage persistence
 * Follows the same pattern as font-store.ts for cross-platform storage
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { supabase } from '@/server/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '@/database/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  resendVerificationEmail: () => Promise<{ error: Error | null }>;
  setSession: (session: Session | null) => Promise<void>;
  initialize: () => Promise<void>;
}

// Platform-specific storage adapter (same pattern as font-store.ts)
const customStorage = createJSONStorage<AuthState>(() => {
  if (Platform.OS === 'web') {
    return {
      getItem: name => localStorage.getItem(name),
      setItem: (name, value) => localStorage.setItem(name, value),
      removeItem: name => localStorage.removeItem(name),
    };
  }
  return AsyncStorage;
});

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      isInitialized: false,

      /**
       * Initialize auth state from stored session
       * Called on app start in _layout.tsx
       */
      initialize: async () => {
        try {
          set({ isLoading: true });

          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error('Error getting session:', error);
            set({ isLoading: false, isInitialized: true });
            return;
          }

          if (session) {
            // Fetch user profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.error('Error fetching profile:', profileError);
            }

            set({
              session,
              user: session.user,
              profile: profile || null,
              isLoading: false,
              isInitialized: true,
            });
          } else {
            set({ isLoading: false, isInitialized: true });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ isLoading: false, isInitialized: true });
        }
      },

      /**
       * Sign in with email and password
       */
      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true });

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false });
            return { error };
          }

          // Fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          set({
            session: data.session,
            user: data.user,
            profile: profile || null,
            isLoading: false,
          });

          return { error: null };
        } catch (error) {
          set({ isLoading: false });
          return { error: error as Error };
        }
      },

      /**
       * Sign up with email, password, and full name
       */
      signUp: async (email: string, password: string, fullName: string) => {
        try {
          set({ isLoading: true });

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });

          if (error) {
            set({ isLoading: false });
            return { error };
          }

          // Note: User needs to verify email before profile is created
          set({
            session: data.session,
            user: data.user,
            profile: null,
            isLoading: false,
          });

          return { error: null };
        } catch (error) {
          set({ isLoading: false });
          return { error: error as Error };
        }
      },

      /**
       * Sign out current user
       */
      signOut: async () => {
        try {
          set({ isLoading: true });

          const { error } = await supabase.auth.signOut();

          if (error) {
            console.error('Error signing out:', error);
          }

          set({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error signing out:', error);
          set({ isLoading: false });
        }
      },

      /**
       * Send password reset email
       */
      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true });

          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'expocrm://reset-password',
          });

          set({ isLoading: false });

          if (error) {
            return { error };
          }

          return { error: null };
        } catch (error) {
          set({ isLoading: false });
          return { error: error as Error };
        }
      },

      /**
       * Update user password
       */
      updatePassword: async (newPassword: string) => {
        try {
          set({ isLoading: true });

          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          set({ isLoading: false });

          if (error) {
            return { error };
          }

          return { error: null };
        } catch (error) {
          set({ isLoading: false });
          return { error: error as Error };
        }
      },

      /**
       * Resend email verification
       */
      resendVerificationEmail: async () => {
        try {
          const { user } = get();

          if (!user?.email) {
            return { error: new Error('No user email found') };
          }

          set({ isLoading: true });

          const { error } = await supabase.auth.resend({
            type: 'signup',
            email: user.email,
          });

          set({ isLoading: false });

          if (error) {
            return { error };
          }

          return { error: null };
        } catch (error) {
          set({ isLoading: false });
          return { error: error as Error };
        }
      },

      /**
       * Set session from auth state listener
       */
      setSession: async (session: Session | null) => {
        if (session) {
          // Fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          set({
            session,
            user: session.user,
            profile: profile || null,
          });
        } else {
          set({
            session: null,
            user: null,
            profile: null,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: customStorage,
      // Only persist non-sensitive data
      partialize: (state: AuthState) =>
        ({
          isInitialized: state.isInitialized,
        }) as unknown as AuthState,
    }
  )
);
