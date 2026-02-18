import { create } from 'zustand';
import {
  trackLogin,
  trackRegistration,
  setUserProperties,
  clearUserProperties,
} from '@/shared/utils/analytics';
import { setUser as setSentryUser } from '@/app/config/sentry';
import { authService } from '../services/auth/auth.service';
import { i18nService } from '../services/i18n/i18n.service';
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
  emailVerificationRequired: boolean
  initializing: boolean
  login: (data: LoginRequest) => Promise<void>
  verify2FALogin: (code: string) => Promise<void>
  verifyEmail: (code: string) => Promise<void>
  resendVerificationCode: () => Promise<void>
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
  emailVerificationRequired: false,
  initializing: true,

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

          if (response.emailVerificationRequired) {
            if (response.user.timezone) {
              localStorage.setItem('userTimezone', response.user.timezone);
            }
            set({
              user: response.user,
              workspace: response.workspace || null,
              role: (response.user.role as MembershipRole) || null,
              isAuthenticated: true,
              emailVerificationRequired: true,
              loading: false,
              error: null,
              twoFactorRequired: false,
              tempToken: null,
              initializing: false,
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
            emailVerificationRequired: false,
            initializing: false,
          });

          trackLogin('email');

          if (response.user.id) {
            setUserProperties(response.user.id, {
              plan: response.workspace?.planId || 'free',
              role: response.user.role || 'member',
            });
          }

          setSentryUser({ id: response.user.id });

          try {
            const fullUser = await usersService.getMe();
            const statusResponse = await securityService.get2FAStatus();
            set((state) => ({
              user: state.user ? { ...state.user, ...fullUser, twoFactorEnabled: statusResponse.enabled } : fullUser,
            }));
          } catch {
          }
        } catch (error) {
          const errorMessage = (error as Error).message || i18nService.t('COMMON.ERRORS.LOGIN_FAILED');
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
            initializing: false,
          });

          trackLogin('2fa');

          if (response.user.id) {
            setUserProperties(response.user.id, {
              plan: response.workspace?.planId || 'free',
              role: response.user.role || 'member',
              has_2fa: true,
            });
          }

          setSentryUser({ id: response.user.id });

          try {
            const fullUser = await usersService.getMe();
            const statusResponse = await securityService.get2FAStatus();
            set((state) => ({
              user: state.user ? { ...state.user, ...fullUser, twoFactorEnabled: statusResponse.enabled } : fullUser,
            }));
          } catch {
          }
        } catch (error) {
          const errorMessage = (error as Error).message || i18nService.t('COMMON.ERRORS.TWO_FA_FAILED');
          set({ error: errorMessage, loading: false, initializing: false });
          throw error;
        }
      },

      verifyEmail: async (code: string) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.verifyEmail({ code });
          set((state) => ({
            user: state.user ? { ...state.user, emailVerified: true } : null,
            emailVerificationRequired: false,
            loading: false,
            error: null,
          }));
          return response;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      resendVerificationCode: async () => {
        set({ loading: true, error: null });
        try {
          await authService.resendVerificationCode();
          set({ loading: false });
        } catch (error) {
          set({ loading: false });
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
          localStorage.removeItem('userTimezone');

          clearUserProperties();

          setSentryUser(null);

          set({
            user: null,
            workspace: null,
            role: null,
            isAuthenticated: false,
            emailVerificationRequired: false,
            loading: false,
            initializing: false,
          });
        } catch (error) {
          localStorage.removeItem('userTimezone');

          clearUserProperties();

          setSentryUser(null);

          set({
            user: null,
            workspace: null,
            role: null,
            isAuthenticated: false,
            emailVerificationRequired: false,
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
            emailVerificationRequired: response.emailVerificationRequired || false,
            loading: false,
            error: null,
            initializing: false,
          });

          trackRegistration('email');

          if (response.user.id) {
            setUserProperties(response.user.id, {
              plan: 'trial',
              role: response.user.role || 'owner',
            });
          }

          setSentryUser({ id: response.user.id });

          try {
            const fullUser = await usersService.getMe();
            set((state) => ({
              user: state.user ? { ...state.user, ...fullUser } : fullUser,
            }));
          } catch {
          }
        } catch (error) {
          const errorMessage = (error as Error).message || i18nService.t('COMMON.ERRORS.REGISTRATION_FAILED');
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

        if (currentState.isAuthenticated) {
          set({ initializing: false });
          return;
        }

        set({ initializing: true, error: null });
        try {
          const user = await usersService.getMe();

          if (user.timezone) {
            localStorage.setItem('userTimezone', user.timezone);
          }

          const statusResponse = await securityService.get2FAStatus();

          setSentryUser({ id: user.id });

          set({
            user: { ...user, twoFactorEnabled: statusResponse.enabled },
            workspace: null,
            role: (user.role as MembershipRole) || null,
            isAuthenticated: true,
            emailVerificationRequired: user.emailVerified === false,
            initializing: false,
          });
        } catch {
          setSentryUser(null);
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
