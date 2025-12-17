import type { Pagination } from '../api/api.types';

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid';

export type PlanInterval = 'monthly' | 'yearly';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface PlanFeatures {
  clients: string;
  cases: string;
  storage: string;
  users: number | string;
}

export interface TeamFeatures {
  subAccounts: boolean;
  maxSubAccounts?: number;
  roleManagement: boolean;
  teamCollaboration: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  features: PlanFeatures;
  teamFeatures?: TeamFeatures;
  popular: boolean;
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

export interface SubscriptionResponse {
  plan: Plan & {
    currentInterval: PlanInterval;
  };
  subscription: Subscription;
  paymentMethod?: PaymentMethod;
}

export interface PlansListResponse {
  plans: Plan[];
}

export interface ChangePlanRequest {
  planId: string;
  interval: PlanInterval;
}

export interface ChangePlanResponse {
  message: string;
  subscription: Subscription & {
    planId: string;
    interval: PlanInterval;
  };
  prorationAmount: number;
  nextBillingDate: string;
}

export interface CancelSubscriptionRequest {
  cancelAtPeriodEnd: boolean;
  reason?: string;
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
