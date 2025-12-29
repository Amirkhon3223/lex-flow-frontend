import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/auth/auth.service'
import { usersService } from '../services/users/users.service'
import type {
  User,
  LoginRequest,
  RegisterRequest,
  WorkspaceInfo,
} from '../types/auth/auth.interfaces'
import type { MembershipRole } from '../types/membership'

interface AuthState {
  user: User | null
  token: string | null
  workspace: WorkspaceInfo | null
  role: MembershipRole | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (data: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  setUser: (user: User | null) => void
  refreshUser: () => Promise<void>
  updateUserData: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      workspace: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (data: LoginRequest) => {
        set({ loading: true, error: null })
        try {
          const response = await authService.login(data)
          localStorage.setItem('access_token', response.token)
          if (response.user.timezone) {
            localStorage.setItem('userTimezone', response.user.timezone)
          }

          set({
            user: response.user,
            token: response.token,
            workspace: response.workspace || null,
            role: (response.user.role as MembershipRole) || null,
            isAuthenticated: true,
            loading: false,
            error: null,
          })

          try {
            const fullUser = await usersService.getMe()
            set((state) => ({
              user: state.user ? { ...state.user, ...fullUser } : fullUser,
            }))
          } catch (error) {
            console.error('Failed to load full user profile:', error)
          }
        } catch (error) {
          const errorMessage = (error as Error).message || 'Login failed'
          set({ error: errorMessage, loading: false, isAuthenticated: false })
          throw error
        }
      },

      logout: async () => {
        set({ loading: true, error: null })
        try {
          await authService.logout()
          localStorage.removeItem('userTimezone')
          set({
            user: null,
            token: null,
            workspace: null,
            role: null,
            isAuthenticated: false,
            loading: false,
          })
        } catch (error) {
          localStorage.removeItem('userTimezone')
          set({
            user: null,
            token: null,
            workspace: null,
            role: null,
            isAuthenticated: false,
            loading: false,
            error: (error as Error).message,
          })
        }
      },

      register: async (data: RegisterRequest) => {
        set({ loading: true, error: null })
        try {
          const response = await authService.register(data)
          localStorage.setItem('access_token', response.token)
          if (response.user.timezone) {
            localStorage.setItem('userTimezone', response.user.timezone)
          }

          set({
            user: response.user,
            token: response.token,
            workspace: response.workspace || null,
            role: (response.user.role as MembershipRole) || null,
            isAuthenticated: true,
            loading: false,
            error: null,
          })

          try {
            const fullUser = await usersService.getMe()
            set((state) => ({
              user: state.user ? { ...state.user, ...fullUser } : fullUser,
            }))
          } catch (error) {
            console.error('Failed to load full user profile:', error)
          }
        } catch (error) {
          const errorMessage = (error as Error).message || 'Registration failed'
          set({ error: errorMessage, loading: false, isAuthenticated: false })
          throw error
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },

      refreshUser: async () => {
        set({ loading: true, error: null })
        try {
          const user = await usersService.getMe()
          set({ user, loading: false })
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      updateUserData: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }))
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        workspace: state.workspace,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: false,
    }
  )
)
