import { create } from 'zustand';
import { billingService } from '../services/billing/billing.service';
import type {
  Plan,
  Subscription,
  PaymentMethod,
  Payment,
  ChangePlanRequest,
  CancelSubscriptionRequest,
  AddPaymentMethodRequest,
  PaymentMethodFull,
  PlanInterval,
} from '../types/billing/billing.interfaces';
import type { Pagination } from '../types/api/api.types';

interface BillingState {
  currentPlan: (Plan & { currentInterval: PlanInterval }) | null;
  subscription: Subscription | null;
  paymentMethod: PaymentMethod | null;
  plans: Plan[];
  payments: Payment[];
  paymentsPagination: Pagination | null;
  paymentMethods: PaymentMethodFull[];
  loading: boolean;
  error: string | null;
  fetchSubscription: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  changePlan: (data: ChangePlanRequest) => Promise<void>;
  cancelSubscription: (data: CancelSubscriptionRequest) => Promise<void>;
  reactivateSubscription: () => Promise<void>;
  fetchPayments: (page?: number, limit?: number) => Promise<void>;
  downloadReceipt: (paymentId: string) => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  addPaymentMethod: (data: AddPaymentMethodRequest) => Promise<void>;
  deletePaymentMethod: (paymentMethodId: string) => Promise<void>;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  currentPlan: null,
  subscription: null,
  paymentMethod: null,
  plans: [],
  payments: [],
  paymentsPagination: null,
  paymentMethods: [],
  loading: false,
  error: null,

  fetchSubscription: async () => {
    set({ loading: true, error: null });
    try {
      const response = await billingService.getSubscription();
      set({
        currentPlan: response.plan,
        subscription: response.subscription,
        paymentMethod: response.paymentMethod || null,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchPlans: async () => {
    set({ loading: true, error: null });
    try {
      const response = await billingService.getPlans();
      set({
        plans: response.plans,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  changePlan: async (data: ChangePlanRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await billingService.changePlan(data);
      // Refresh subscription after change
      await get().fetchSubscription();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  cancelSubscription: async (data: CancelSubscriptionRequest) => {
    set({ loading: true, error: null });
    try {
      await billingService.cancelSubscription(data);
      // Refresh subscription after cancellation
      await get().fetchSubscription();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  reactivateSubscription: async () => {
    set({ loading: true, error: null });
    try {
      await billingService.reactivateSubscription();
      // Refresh subscription after reactivation
      await get().fetchSubscription();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchPayments: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const response = await billingService.getPayments(page, limit);
      set({
        payments: response.payments,
        paymentsPagination: response.pagination,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  downloadReceipt: async (paymentId: string) => {
    set({ loading: true, error: null });
    try {
      const blob = await billingService.downloadReceipt(paymentId);
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchPaymentMethods: async () => {
    set({ loading: true, error: null });
    try {
      const response = await billingService.getPaymentMethods();
      set({
        paymentMethods: response.paymentMethods,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addPaymentMethod: async (data: AddPaymentMethodRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await billingService.addPaymentMethod(data);
      set((state) => ({
        paymentMethods: [response.paymentMethod, ...state.paymentMethods],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deletePaymentMethod: async (paymentMethodId: string) => {
    set({ loading: true, error: null });
    try {
      await billingService.deletePaymentMethod(paymentMethodId);
      set((state) => ({
        paymentMethods: state.paymentMethods.filter((pm) => pm.id !== paymentMethodId),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));
