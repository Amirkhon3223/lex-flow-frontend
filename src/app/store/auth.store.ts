import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, _password) => {
        set({ loading: true, error: null });
        try {
          const token = 'mock-token';
          const user: User = {
            id: '1',
            email,
            name: 'John Doe',
            role: 'admin',
          };
          localStorage.setItem('access_token', token);
          set({ user, token, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      register: async (_email, _password, _name) => {
        set({ loading: true, error: null });
        try {
          set({ loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      refreshToken: async () => {
        set({ loading: true, error: null });
        try {
          set({ loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
