import { httpClient } from '../../interceptors/http.interceptor';
import { API_CONFIG } from '../../config/api.config';
import type { Client, CreateClientDto, UpdateClientDto } from '../../types/clients/client.types';

export class ClientService {
  async getAll(): Promise<Client[]> {
    const response = await httpClient.get<Client[]>(API_CONFIG.ENDPOINTS.CLIENTS.BASE);
    return response.data;
  }

  async getById(id: string): Promise<Client> {
    const response = await httpClient.get<Client>(API_CONFIG.ENDPOINTS.CLIENTS.BY_ID(id));
    return response.data;
  }

  async create(data: CreateClientDto): Promise<Client> {
    const response = await httpClient.post<Client>(API_CONFIG.ENDPOINTS.CLIENTS.BASE, data);
    return response.data;
  }

  async update(id: string, data: UpdateClientDto): Promise<Client> {
    const response = await httpClient.patch<Client>(API_CONFIG.ENDPOINTS.CLIENTS.BY_ID(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(API_CONFIG.ENDPOINTS.CLIENTS.BY_ID(id));
  }
}

export const clientService = new ClientService();
