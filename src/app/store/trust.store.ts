import { create } from 'zustand';
import { trustService } from '../services/trust/trust.service';
import type {
  TrustAccount,
  CreateTrustAccountRequest,
  UpdateTrustAccountRequest,
  TrustTransaction,
  CreateTrustTransactionRequest,
  TrustSummary,
} from '../types/trust/trust.interfaces';

interface TrustState {
  accounts: TrustAccount[];
  selectedAccount: TrustAccount | null;
  transactions: TrustTransaction[];
  summary: TrustSummary | null;
  loading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  createAccount: (data: CreateTrustAccountRequest) => Promise<void>;
  updateAccount: (id: string, data: UpdateTrustAccountRequest) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  fetchTransactions: (accountId: string) => Promise<void>;
  createTransaction: (data: CreateTrustTransactionRequest) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  fetchSummary: () => Promise<void>;
  selectAccount: (account: TrustAccount | null) => void;
  reset: () => void;
}

export const useTrustStore = create<TrustState>((set, get) => ({
  accounts: [],
  selectedAccount: null,
  transactions: [],
  summary: null,
  loading: false,
  error: null,

  fetchAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const accounts = await trustService.getAccounts();
      set({ accounts, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createAccount: async (data: CreateTrustAccountRequest) => {
    set({ loading: true, error: null });
    try {
      const account = await trustService.createAccount(data);
      set((state) => ({
        accounts: [...state.accounts, account],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateAccount: async (id: string, data: UpdateTrustAccountRequest) => {
    set({ loading: true, error: null });
    try {
      const updated = await trustService.updateAccount(id, data);
      set((state) => ({
        accounts: state.accounts.map((a) => (a.id === id ? updated : a)),
        selectedAccount: state.selectedAccount?.id === id ? updated : state.selectedAccount,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteAccount: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await trustService.deleteAccount(id);
      set((state) => ({
        accounts: state.accounts.filter((a) => a.id !== id),
        selectedAccount: state.selectedAccount?.id === id ? null : state.selectedAccount,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchTransactions: async (accountId: string) => {
    set({ loading: true, error: null });
    try {
      const transactions = await trustService.getTransactions(accountId);
      set({ transactions, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createTransaction: async (data: CreateTrustTransactionRequest) => {
    set({ loading: true, error: null });
    try {
      const transaction = await trustService.createTransaction(data);
      set((state) => ({
        transactions: [transaction, ...state.transactions],
        loading: false,
      }));
      await get().fetchAccounts();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteTransaction: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await trustService.deleteTransaction(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchSummary: async () => {
    set({ loading: true, error: null });
    try {
      const summary = await trustService.getSummary();
      set({ summary, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  selectAccount: (account: TrustAccount | null) => {
    set({ selectedAccount: account });
  },

  reset: () => {
    set({
      accounts: [],
      selectedAccount: null,
      transactions: [],
      summary: null,
      loading: false,
      error: null,
    });
  },
}));
