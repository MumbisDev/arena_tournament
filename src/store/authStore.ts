import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { mockUsers } from './mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, _password: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const user = mockUsers.find((u) => u.email === email);
        if (user) {
          set({ user, isAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: 'Invalid email or password' };
      },

      register: async (username: string, email: string, _password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const existingUser = mockUsers.find((u) => u.email === email);
        if (existingUser) {
          return { success: false, error: 'Email already registered' };
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          username,
          email,
          role: 'player',
          createdAt: new Date().toISOString(),
          stats: {
            tournamentsJoined: 0,
            tournamentsCreated: 0,
            wins: 0,
            losses: 0,
          },
        };

        mockUsers.push(newUser);
        set({ user: newUser, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          
          // Update in mock data
          const index = mockUsers.findIndex((u) => u.id === currentUser.id);
          if (index !== -1) {
            mockUsers[index] = updatedUser;
          }
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

