import { ClientTypeEnum, ClientCategoryEnum, ClientStatusEnum } from './clients.enums';
import type { Pagination } from '../api/api.types';

export interface ClientInterface {
  id: string;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  companyName: string | null;
  type: ClientTypeEnum;
  category: ClientCategoryEnum;
  status: ClientStatusEnum;
  email: string;
  phone: string;
  address: string | null;
  inn: string | null;
  kpp: string | null;
  activeCases: number;
  totalCases: number;
  totalRevenue: number;
  avatar: string | null;
  notes: string | null;
  birthDate: string | null;
  lastContact: string | null;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormInterface {
  id: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  companyName?: string;
  type: ClientTypeEnum;
  inn?: string;
  kpp?: string;
  email: string;
  phone: string;
  address?: string;
  category?: string;
  notes?: string;
  activeCases: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientInterface {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  companyName?: string;
  type: ClientTypeEnum;
  category?: ClientCategoryEnum;
  email: string;
  phone: string;
  address?: string;
  inn?: string;
  kpp?: string;
  notes?: string;
  birthDate?: string;
}

export interface UpdateClientInterface {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  companyName?: string;
  category?: ClientCategoryEnum;
  status?: ClientStatusEnum;
  email?: string;
  phone?: string;
  address?: string;
  inn?: string;
  kpp?: string;
  notes?: string;
  birthDate?: string;
}

export interface ClientListResponse {
  clients: ClientInterface[];
  pagination: Pagination;
}

export interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  birthDate: string;
}

export interface ContactInfoCardProps {
  contactInfo: ContactInfo;
  onEdit: () => void;
}

export interface FinancialData {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentPercentage: number;
}

export interface FinancialCardProps {
  financialData: FinancialData;
}
