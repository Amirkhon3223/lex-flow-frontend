import { create } from 'zustand';
import { authService } from '../services/auth/auth.service';
import { securityService } from '../services/security/security.service';
import { usersService } from '../services/users/users.service';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  WorkspaceInfo,
} from '../types/auth/auth.interfaces';
import type { MembershipRole } from '../types/membership';

interface AuthState {
  user: User | null
  workspace: WorkspaceInfo | null
  role: MembershipRole | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  twoFactorRequired: boolean
  tempToken: string | null
  initializing: boolean
  login: (data: LoginRequest) => Promise<void>
  verify2FALogin: (code: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  setUser: (user: User | null) => void
  refreshUser: () => Promise<void>
  updateUserData: (userData: Partial<User>) => void
  clearTwoFactorState: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  workspace: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  twoFactorRequired: false,
  tempToken: null,
  initializing: true, // Start as true to prevent flashing login page on page reload

      login: async (data: LoginRequest) => {
        set({ loading: true, error: null, twoFactorRequired: false, tempToken: null });
        try {
          const response = await authService.login(data);

          if (response.twoFactorRequired && response.tempToken) {
            set({
              twoFactorRequired: true,
              tempToken: response.tempToken,
              loading: false,
              error: null,
            });
            return;
          }

          if (response.user.timezone) {
            localStorage.setItem('userTimezone', response.user.timezone);
          }

          set({
            user: response.user,
            workspace: response.workspace || null,
            role: (response.user.role as MembershipRole) || null,
            isAuthenticated: true,
            loading: false,
            error: null,
            twoFactorRequired: false,
            tempToken: null,
            initializing: false, // Ensure initializing is false after successful login
          });

          try {
            const fullUser = await usersService.getMe();
            const statusResponse = await securityService.get2FAStatus();
            set((state) => ({
              user: state.user ? { ...state.user, ...fullUser, twoFactorEnabled: statusResponse.enabled } : fullUser,
            }));
          } catch (error) {
            // Silently handle - user profile loaded partially;
          }
        } catch (error) {
          const errorMessage = (error as Error).message || 'Login failed';
          set({ error: errorMessage, loading: false, isAuthenticated: false, twoFactorRequired: false, tempToken: null, initializing: false });
          throw error;
        }
      },

      verify2FALogin: async (code: string) => {
        const { tempToken } = get();
        if (!tempToken) {
          throw new Error('No temporary token available');
        }

        set({ loading: true, error: null });
        try {
          const response = await authService.verify2FALogin({ tempToken, code });

          if (response.user.timezone) {
            localStorage.setItem('userTimezone', response.user.timezone);
          }

          set({
            user: response.user,
            workspace: response.workspace || null,
            role: (response.user.role as MembershipRole) || null,
            isAuthenticated: true,
            loading: false,
            error: null,
            twoFactorRequired: false,
            tempToken: null,
            initializing: false, // Ensure initializing is false after successful login
          });

          try {
            const fullUser = await usersService.getMe();
            const statusResponse = await securityService.get2FAStatus();
            set((state) => ({
              user: state.user ? { ...state.user, ...fullUser, twoFactorEnabled: statusResponse.enabled } : fullUser,
            }));
          } catch (error) {
            // Silently handle - user profile loaded partially;
          }
        } catch (error) {
          const errorMessage = (error as Error).message || '2FA verification failed';
          set({ error: errorMessage, loading: false, initializing: false });
          throw error;
        }
      },

      clearTwoFactorState: () => {
        set({ twoFactorRequired: false, tempToken: null, error: null, initializing: false });
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          await authService.logout();
          // Clear all auth-related data
          localStorage.removeItem('userTimezone');
          set({
            user: null,
            workspace: null,
            role: null,
            isAuthenticated: false,
            loading: false,
            initializing: false,
          });
        } catch (error) {
          // Even if logout fails on backend, clear local state
          localStorage.removeItem('userTimezone');
          set({
            user: null,
            workspace: null,
            role: null,
            isAuthenticated: false,
            loading: false,
            initializing: false,
            error: (error as Error).message,
          });
        }
      },

      register: async (data: RegisterRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.register(data);
          if (response.user.timezone) {
            localStorage.setItem('userTimezone', response.user.timezone);
          }

          set({
            user: response.user,
            workspace: response.workspace || null,
            role: (response.user.role as MembershipRole) || null,
            isAuthenticated: true,
            loading: false,
            error: null,
            initializing: false,
          });

          try {
            const fullUser = await usersService.getMe();
            set((state) => ({
              user: state.user ? { ...state.user, ...fullUser } : fullUser,
            }));
          } catch (error) {
            // Silently handle - user profile loaded partially;
          }
        } catch (error) {
          const errorMessage = (error as Error).message || 'Registration failed';
          set({ error: errorMessage, loading: false, isAuthenticated: false, initializing: false });
          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user, initializing: false });
      },

      refreshUser: async () => {
        set({ loading: true, error: null });
        try {
          const user = await usersService.getMe();
          set({ user, loading: false, initializing: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false, initializing: false });
          throw error;
        }
      },

      updateUserData: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      initializeAuth: async () => {
        const currentState = get();

        // Skip if already authenticated to prevent unnecessary API calls
        if (currentState.isAuthenticated) {
          set({ initializing: false });
          return;
        }

        set({ initializing: true, error: null });
        try {
          // Try to restore session from httpOnly cookie
          const user = await usersService.getMe();

          if (user.timezone) {
            localStorage.setItem('userTimezone', user.timezone);
          }

          // Get 2FA status
          const statusResponse = await securityService.get2FAStatus();

          set({
            user: { ...user, twoFactorEnabled: statusResponse.enabled },
            workspace: null, // Workspace info comes from user data
            role: (user.role as MembershipRole) || null,
            isAuthenticated: true,
            initializing: false,
          });
        } catch (error) {
          // No valid session (401 error) or network error
          // User stays logged out
          set({
            user: null,
            workspace: null,
            role: null,
            isAuthenticated: false,
            initializing: false,
          });
        }
      },
    }));
