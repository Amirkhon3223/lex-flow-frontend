import type { Client, CreateClientDto, UpdateClientDto } from '../../types/clients/client.types';
import { mockClients, simulateApiDelay, generateId } from '../mock/mockData';

class ClientService {
  private clients: Client[] = [...mockClients] as Client[];

  async getAll(): Promise<Client[]> {
    await simulateApiDelay();
    return this.clients;
  }

  async getById(id: string): Promise<Client | null> {
    await simulateApiDelay();
    return this.clients.find(c => c.id === id) || null;
  }

  async create(data: CreateClientDto): Promise<Client> {
    await simulateApiDelay(800);

    const newClient: Client = {
      id: generateId(),
      ...data,
      activeCases: 0,
      totalRevenue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.clients.unshift(newClient);
    return newClient;
  }

  async update(id: string, data: UpdateClientDto): Promise<Client | null> {
    await simulateApiDelay(600);

    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.clients[index] = {
      ...this.clients[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return this.clients[index];
  }

  async delete(id: string): Promise<boolean> {
    await simulateApiDelay(400);

    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.clients.splice(index, 1);
    return true;
  }
}

export const clientService = new ClientService();
