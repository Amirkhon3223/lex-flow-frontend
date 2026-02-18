import { httpClient } from '../../interceptors/http.interceptor';
import type { SuccessResponse } from '../../types/api/api.types';
import type {
  SubscriptionResponse,
  PlansListResponse,
  ChangePlanRequest,
  PaymentsListResponse,
  PaymentMethodsListResponse,
  AddPaymentMethodRequest,
  PaymentMethodResponse,
  CreateCheckoutSessionRequest,
  CheckoutSessionResponse,
  StorageUsageResponse,
  PlanUsageResponse,
} from '../../types/billing/billing.interfaces';

export const billingService = {
  getSubscription: async (): Promise<SubscriptionResponse> => {
    const response = await httpClient.get<SubscriptionResponse>('/billing/subscription');
    return response.data;
  },

  getPlans: async (): Promise<PlansListResponse> => {
    const response = await httpClient.get<PlansListResponse>('/billing/plans');
    return response.data;
  },

  changePlan: async (data: ChangePlanRequest): Promise<SuccessResponse> => {
    const response = await httpClient.post<SuccessResponse>(
      '/billing/subscription/change',
      data
    );
    return response.data;
  },

  createCheckoutSession: async (
    data: CreateCheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> => {
    const response = await httpClient.post<CheckoutSessionResponse>(
      '/billing/checkout-session',
      data
    );
    return response.data;
  },

  cancelSubscription: async (): Promise<SuccessResponse> => {
    const response = await httpClient.post<SuccessResponse>(
      '/billing/subscription/cancel'
    );
    return response.data;
  },

  getPayments: async (page = 1, limit = 20): Promise<PaymentsListResponse> => {
    const response = await httpClient.get<PaymentsListResponse>('/billing/payments', {
      params: { page, limit },
    });
    return response.data;
  },

  getReceiptUrl: async (paymentId: string): Promise<string> => {
    const response = await httpClient.get<{ receiptUrl: string }>(
      `/billing/payments/${paymentId}/receipt`,
    );
    return response.data.receiptUrl;
  },

  getPaymentMethods: async (): Promise<PaymentMethodsListResponse> => {
    const response = await httpClient.get<PaymentMethodsListResponse>(
      '/billing/payment-methods'
    );
    return response.data;
  },

  addPaymentMethod: async (
    data: AddPaymentMethodRequest
  ): Promise<PaymentMethodResponse> => {
    const response = await httpClient.post<PaymentMethodResponse>(
      '/billing/payment-methods',
      data
    );
    return response.data;
  },

  deletePaymentMethod: async (paymentMethodId: string): Promise<SuccessResponse> => {
    const response = await httpClient.delete<SuccessResponse>(
      `/billing/payment-methods/${paymentMethodId}`
    );
    return response.data;
  },

  setDefaultPaymentMethod: async (paymentMethodId: string): Promise<SuccessResponse> => {
    const response = await httpClient.post<SuccessResponse>(
      `/billing/payment-methods/${paymentMethodId}/default`
    );
    return response.data;
  },

  createSetupIntent: async (): Promise<{ clientSecret: string }> => {
    const response = await httpClient.post<{ clientSecret: string }>(
      '/billing/payment-methods/setup'
    );
    return response.data;
  },

  retryPayment: async (paymentId: string): Promise<SuccessResponse> => {
    const response = await httpClient.post<SuccessResponse>(
      `/billing/payments/${paymentId}/retry`
    );
    return response.data;
  },

  getStorageUsage: async (): Promise<StorageUsageResponse> => {
    const response = await httpClient.get<StorageUsageResponse>('/billing/storage-usage');
    return response.data;
  },

  getUsage: async (): Promise<PlanUsageResponse> => {
    const response = await httpClient.get<PlanUsageResponse>('/billing/usage');
    return response.data;
  },
};
