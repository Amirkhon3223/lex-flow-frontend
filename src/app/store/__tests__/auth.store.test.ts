import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../auth.store';
import { mockUser, mockWorkspace } from '@/test/mocks/handlers';

// Mock the auth service
vi.mock('@/app/services/auth/auth.service', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    refreshToken: vi.fn(),
  },
}));

vi.mock('@/app/services/users/users.service', () => ({
  usersService: {
    getMe: vi.fn(),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      workspace: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      twoFactorRequired: false,
      tempUserId: null,
    });
  });

  it('has correct initial state', () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.workspace).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets user and workspace on successful auth', () => {
    const { setAuth } = useAuthStore.getState();

    setAuth(mockUser as any, mockWorkspace as any, 'owner');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.workspace).toEqual(mockWorkspace);
    expect(state.role).toBe('owner');
    expect(state.isAuthenticated).toBe(true);
  });

  it('clears state on logout', () => {
    // First set some auth state
    useAuthStore.setState({
      user: mockUser as any,
      workspace: mockWorkspace as any,
      role: 'owner',
      isAuthenticated: true,
    });

    const { clearAuth } = useAuthStore.getState();
    clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.workspace).toBeNull();
    expect(state.role).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('handles loading state', () => {
    const { setLoading } = useAuthStore.getState();

    setLoading(true);
    expect(useAuthStore.getState().loading).toBe(true);

    setLoading(false);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('handles error state', () => {
    const { setError } = useAuthStore.getState();

    setError('Invalid credentials');
    expect(useAuthStore.getState().error).toBe('Invalid credentials');

    setError(null);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('handles 2FA required state', () => {
    useAuthStore.setState({
      twoFactorRequired: true,
      tempUserId: 'temp-user-123',
    });

    const state = useAuthStore.getState();
    expect(state.twoFactorRequired).toBe(true);
    expect(state.tempUserId).toBe('temp-user-123');
  });
});
