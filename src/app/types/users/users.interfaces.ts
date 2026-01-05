export type AccountType = 'individual' | 'organization' | 'sub_account';

export type Specialization =
  | 'lawyer'
  | 'attorney'
  | 'legal_assistant'
  | 'senior_lawyer'
  | 'junior_lawyer'
  | 'partner'
  | 'other';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  name: string;
  phone?: string;
  position?: string;
  specialization?: Specialization;
  company?: string;
  address?: string;
  avatar?: string | null;
  role?: string;
  accountType?: AccountType;
  organizationId?: string | null;
  country?: string;
  city?: string;
  timezone?: string;
  language?: string;
  currency?: string;
  workspaceId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  position?: string;
  specialization?: Specialization;
  company?: string;
  address?: string;
  country?: string;
  city?: string;
}

export interface UpdateUserProfileResponse {
  message: string;
  user: User;
}

export interface UserStatsResponse {
  activeCases: number;
  clients: number;
  completedCases: number;
  daysInSystem: number;
}

export interface UpdateLanguageRequest {
  language: 'ru' | 'en' | 'tj';
}

export interface UpdateTimezoneRequest {
  timezone: string;
}

export interface UpdateCurrencyRequest {
  currency: 'USD' | 'RUB' | 'EUR' | 'TJS';
}
