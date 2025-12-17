import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { authService, type Profile } from '../services/auth';

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: { username?: string; avatar?: string; bio?: string }) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      initialize: async () => {
        try {
          const session = await authService.getSession();
          
          if (session?.user) {
            const profile = await authService.getProfile(session.user.id);
            set({ user: profile, isAuthenticated: !!profile, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const profile = await authService.getProfile(session.user.id);
              set({ user: profile, isAuthenticated: !!profile });
            } else if (event === 'SIGNED_OUT') {
              set({ user: null, isAuthenticated: false });
            }
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        try {
          const { user } = await authService.signIn(email, password);
          
          if (user) {
            const profile = await authService.getProfile(user.id);
            set({ user: profile, isAuthenticated: true });
            return { success: true };
          }
          
          return { success: false, error: 'Login failed' };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Invalid email or password';
          return { success: false, error: message };
        }
      },

      register: async (username: string, email: string, password: string) => {
        try {
          const { user } = await authService.signUp(email, password, username);
          
          if (user) {
            // Profile is created automatically via trigger, but we need to wait a moment
            await new Promise((resolve) => setTimeout(resolve, 500));
            const profile = await authService.getProfile(user.id);
            set({ user: profile, isAuthenticated: true });
            return { success: true };
          }
          
          return { success: false, error: 'Registration failed' };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          return { success: false, error: message };
        }
      },

      logout: async () => {
        try {
          await authService.signOut();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
          // Still clear local state even if API call fails
          set({ user: null, isAuthenticated: false });
        }
      },

      updateProfile: async (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          await authService.updateProfile(currentUser.id, updates);
          const updatedProfile = await authService.getProfile(currentUser.id);
          set({ user: updatedProfile });
        } catch (error) {
          console.error('Profile update error:', error);
          throw error;
        }
      },

      refreshProfile: async () => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          const profile = await authService.getProfile(currentUser.id);
          set({ user: profile });
        } catch (error) {
          console.error('Profile refresh error:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        // Persist user profile for instant UI on page load
        // Full profile is still refreshed via initialize()
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
