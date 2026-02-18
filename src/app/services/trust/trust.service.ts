import { httpClient } from '../../interceptors/http.interceptor';
import type {
  TrustAccount,
  CreateTrustAccountRequest,
  UpdateTrustAccountRequest,
  TrustTransaction,
  CreateTrustTransactionRequest,
  TrustSummary,
  ClientBalance,
} from '../../types/trust/trust.interfaces';

export const trustService = {
  getAccounts: async (): Promise<TrustAccount[]> => {
    const response = await httpClient.get<TrustAccount[]>('/trust-accounts');
    return response.data;
  },

  createAccount: async (data: CreateTrustAccountRequest): Promise<TrustAccount> => {
    const response = await httpClient.post<TrustAccount>('/trust-accounts', data);
    return response.data;
  },

  getAccount: async (id: string): Promise<TrustAccount> => {
    const response = await httpClient.get<TrustAccount>(`/trust-accounts/${id}`);
    return response.data;
  },

  updateAccount: async (id: string, data: UpdateTrustAccountRequest): Promise<TrustAccount> => {
    const response = await httpClient.put<TrustAccount>(`/trust-accounts/${id}`, data);
    return response.data;
  },

  deleteAccount: async (id: string): Promise<void> => {
    await httpClient.delete(`/trust-accounts/${id}`);
  },

  getTransactions: async (accountId: string): Promise<TrustTransaction[]> => {
    const response = await httpClient.get<TrustTransaction[]>(`/trust-accounts/${accountId}/transactions`);
    return response.data;
  },

  getClientBalance: async (accountId: string, clientId: string): Promise<ClientBalance> => {
    const response = await httpClient.get<ClientBalance>(`/trust-accounts/${accountId}/client/${clientId}/balance`);
    return response.data;
  },

  createTransaction: async (data: CreateTrustTransactionRequest): Promise<TrustTransaction> => {
    const response = await httpClient.post<TrustTransaction>('/trust-transactions', data);
    return response.data;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await httpClient.delete(`/trust-transactions/${id}`);
  },

  getClientTransactions: async (clientId: string): Promise<TrustTransaction[]> => {
    const response = await httpClient.get<TrustTransaction[]>(`/trust-transactions/client/${clientId}`);
    return response.data;
  },

  getSummary: async (): Promise<TrustSummary> => {
    const response = await httpClient.get<TrustSummary>('/trust-summary');
    return response.data;
  },
};
