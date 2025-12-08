import { httpClient } from '../../interceptors/http.interceptor';
import type {
  ClientInterface,
  CreateClientInterface,
  UpdateClientInterface,
  ClientListResponse,
} from '../../types/clients/clients.interfaces';

export const clientsService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<ClientListResponse> => {
    // Очищаем параметры от undefined и пустых значений
    const cleanParams: Record<string, string | number> = {};
    
    if (params?.page !== undefined) cleanParams.page = params.page;
    if (params?.limit !== undefined) cleanParams.limit = params.limit;
    if (params?.type && params.type !== 'all') cleanParams.type = params.type;
    if (params?.category && params.category !== 'all') cleanParams.category = params.category;
    if (params?.status && params.status !== 'all') cleanParams.status = params.status;
    if (params?.search && params.search.trim()) cleanParams.search = params.search.trim();
    
    const response = await httpClient.get<ClientListResponse>('/clients', { params: cleanParams });
    return response.data;
  },

  getById: async (id: string): Promise<ClientInterface> => {
    const response = await httpClient.get<ClientInterface>(`/clients/${id}`);
    return response.data;
  },

  create: async (data: CreateClientInterface): Promise<ClientInterface> => {
    const response = await httpClient.post<ClientInterface>('/clients', data);
    return response.data;
  },

  update: async (id: string, data: UpdateClientInterface): Promise<ClientInterface> => {
    const response = await httpClient.put<ClientInterface>(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/clients/${id}`);
  },
};
