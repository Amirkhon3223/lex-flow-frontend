export type AccountType = 'individual' | 'organization' | 'sub_account';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  name: string;
  phone: string;
  position: string;
  specialization?: 'labor_law' | 'contract_law' | 'family_law' | 'criminal_law';
  company?: string;
  address?: string;
  avatar: string | null;
  role: string;
  accountType: AccountType;
  organizationId: string | null;
  country?: string;
  city?: string;
  timezone: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  position: string;
  specialization?: 'labor_law' | 'contract_law' | 'family_law' | 'criminal_law';
  company?: string;
  address?: string;
  country?: string;
  city?: string;
}

export interface UserStatsResponse {
  activeCases: number;
  clients: number;
  completedCases: number;
  daysInSystem: number;
}

export interface UpdateLanguageRequest {
  language: 'ru' | 'en';
}

export interface UpdateTimezoneRequest {
  timezone: string;
}
