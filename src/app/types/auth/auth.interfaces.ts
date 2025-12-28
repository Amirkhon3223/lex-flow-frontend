import type { WorkspaceInfo } from '@/app/types/workspaces'
import type { MembershipRole } from '@/app/types/membership'

export type { WorkspaceInfo }
export type { MembershipRole }

export type Specialization =
  | 'lawyer'
  | 'attorney'
  | 'legal_assistant'
  | 'senior_lawyer'
  | 'junior_lawyer'
  | 'partner'
  | 'other';

/**
 * User Interface
 * Пользователь - ТОЛЬКО identity (email, password, личные данные)
 * Роли и workspace - через Membership
 */
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  middleName?: string
  name: string
  phone?: string
  position?: string
  specialization?: Specialization
  company?: string
  address?: string
  avatar?: string | null
  country?: string
  city?: string
  timezone?: string
  language?: string
  role?: string
  workspaceId?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Запрос на регистрацию
 * inviteToken - если регистрация по приглашению
 * firmName - если обычная регистрация (создать workspace)
 */
export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  firmName?: string
  country?: string
  city?: string
  phone?: string
  inviteToken?: string
}

/**
 * Запрос на вход
 */
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Ответ при авторизации/регистрации
 * workspace - информация о workspace пользователя
 * role - роль в workspace (из Membership)
 */
export interface AuthResponse {
  token: string
  user: User
  workspace?: WorkspaceInfo
  role?: MembershipRole
}

export interface AuthCardProps {
  isLoading: boolean;

  loginEmail: string;
  loginPassword: string;
  rememberMe: boolean;
  onLoginEmailChange: (value: string) => void;
  onLoginPasswordChange: (value: string) => void;
  onRememberMeChange: (value: boolean) => void;

  registerFirstName: string;
  registerLastName: string;
  registerEmail: string;
  registerPassword: string;
  registerFirmName: string;
  registerCountry: string;
  registerCity: string;
  registerPhone: string;
  onRegisterFirstNameChange: (value: string) => void;
  onRegisterLastNameChange: (value: string) => void;
  onRegisterEmailChange: (value: string) => void;
  onRegisterPasswordChange: (value: string) => void;
  onRegisterFirmNameChange: (value: string) => void;
  onRegisterCountryChange: (value: string) => void;
  onRegisterCityChange: (value: string) => void;
  onRegisterPhoneChange: (value: string) => void;

  onLoginSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onRegisterSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export interface LoginFormProps {
  isLoading: boolean;
  email: string;
  password: string;
  rememberMe: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberMeChange: (value: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export interface RegisterFormProps {
  isLoading: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  firmName: string;
  country: string;
  city: string;
  phone: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFirmNameChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
