import { ClientTypeEnum, ClientCategoryEnum, ClientStatusEnum } from './clients.enums';

export interface ClientInterface {
  id: number;
  name: string;
  avatar: string;
  type: ClientTypeEnum;
  category: ClientCategoryEnum;
  email: string;
  phone: string;
  activeCases: number;
  totalCases: number;
  totalRevenue: number;
  lastContact: string;
  status: ClientStatusEnum;
  joinDate: string;
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
  inn?: string;
  kpp?: string;
  email: string;
  phone: string;
  address?: string;
  category?: string;
  notes?: string;
}

export interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Контактная информация клиента
 */
export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  birthDate: string;
}

/**
 * Пропсы для ContactInfoCard компонента
 */
export interface ContactInfoCardProps {
  contactInfo: ContactInfo;
  onEdit: () => void;
}

/**
 * Финансовые данные клиента
 */
export interface FinancialData {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentPercentage: number;
}

/**
 * Пропсы для FinancialCard компонента
 */
export interface FinancialCardProps {
  financialData: FinancialData;
}

/**
 * Пропсы для компактной статистической карточки
 */
export interface CompactStatCardProps {
  label: string;
  value: string | number;
  icon: import('lucide-react').LucideIcon;
  color: string;
}
