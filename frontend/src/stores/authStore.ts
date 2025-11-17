import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscriptionTier: 'free' | 'pro' | 'business';
  isEmailVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      setAuth: (user, token, refreshToken) => set({ user, token, refreshToken }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
