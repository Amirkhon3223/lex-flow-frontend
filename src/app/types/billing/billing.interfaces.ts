import type { Pagination } from '../api/api.types';

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid';

export type PlanInterval = 'monthly' | 'yearly';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxUsers: number;
  trialDays: number;
  popular: boolean;
  currency: string;
}

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

export interface PaymentMethod {
  type: 'card';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

/**
 * Ответ с информацией о подписке
 * Подписка привязана к Workspace
 */
export interface SubscriptionResponse {
  id: string
  workspaceId: string
  planId: string
  status: SubscriptionStatus
  trialEnd?: string
  usersCount: number
  maxUsers: number
  canAddUsers: boolean
  currentPeriodEnd?: string
}

export interface PlansListResponse {
  plans: Plan[];
}

export interface ChangePlanRequest {
  planId: string;
  interval: PlanInterval;
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  paymentMethod: {
    type: 'card';
    last4: string;
  };
  receiptUrl: string;
  createdAt: string;
  paidAt?: string;
}

export interface PaymentsListResponse {
  payments: Payment[];
  pagination: Pagination;
}

export interface PaymentMethodFull {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentMethodsListResponse {
  paymentMethods: PaymentMethodFull[];
}

export interface AddPaymentMethodRequest {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  cardholderName: string;
}

export interface PaymentMethodResponse {
  message: string;
  paymentMethod: PaymentMethodFull;
}

export interface CreateCheckoutSessionRequest {
  planId: string;
  interval: PlanInterval;
}

export interface CheckoutSessionResponse {
  url: string;
}

export interface PlanUsageResponse {
  planId: string;
  planName: string;
  clientsCount: number;
  casesCount: number;
  usersCount: number;
  storageUsed: number;
  maxClients: number;       // -1 = unlimited
  maxCases: number;         // -1 = unlimited
  maxUsers: number;
  maxStorage: number;       // bytes, -1 = unlimited
  maxDocumentsPerCase: number; // -1 = unlimited
  canAddClient: boolean;
  canAddCase: boolean;
  canAddUser: boolean;
  canUpload: boolean;
  teamFeaturesEnabled: boolean;
}

export type StorageWarningLevel = 'normal' | 'warning' | 'critical';

export interface StorageUsageResponse {
  used: number;
  usedFormatted: string;
  limit: number;
  limitFormatted: string;
  percentage: number;
  remainingFormatted: string;
  planId: string;
  planName: string;
  canUpgrade: boolean;
  warningLevel: StorageWarningLevel;
}
