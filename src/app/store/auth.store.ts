import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth/auth.service';
import type { User, LoginRequest, RegisterRequest } from '../types/auth/auth.interfaces';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
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

      login: async (data: LoginRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login(data);
          localStorage.setItem('access_token', response.token);
          if (response.user.timezone) {
            localStorage.setItem('userTimezone', response.user.timezone);
          }
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = (error as Error).message || 'Login failed';
          set({ error: errorMessage, loading: false, isAuthenticated: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          await authService.logout();
          localStorage.removeItem('userTimezone');
          set({ user: null, token: null, isAuthenticated: false, loading: false });
        } catch (error) {
          // Даже если произошла ошибка, очищаем локальное состояние
          localStorage.removeItem('userTimezone');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: (error as Error).message,
          });
        }
      },

      register: async (data: RegisterRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.register(data);
          localStorage.setItem('access_token', response.token);
          if (response.user.timezone) {
            localStorage.setItem('userTimezone', response.user.timezone);
          }
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = (error as Error).message || 'Registration failed';
          set({ error: errorMessage, loading: false, isAuthenticated: false });
          throw error;
        }
      },

      setUser: (user: User | null) => {
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
