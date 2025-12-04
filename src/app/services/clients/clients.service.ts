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
    const response = await httpClient.get<ClientListResponse>('/clients', { params });
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
