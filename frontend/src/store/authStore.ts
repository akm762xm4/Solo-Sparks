import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set(() => ({ user, isAuthenticated: !!user })),
      setToken: (token) => set(() => ({ token })),
      setLoading: (loading) => set(() => ({ isLoading: loading })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // name of item in storage
      partialize: (state) =>
        ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        } as Partial<AuthState>),
    }
  )
);
