import { create } from 'zustand';
import { clientService } from '../services/clients/clientService';
import type { Client, CreateClientDto, UpdateClientDto } from '../types/clients/client.types';

interface ClientsState {
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  fetchClientById: (id: string) => Promise<void>;
  createClient: (data: CreateClientDto) => Promise<void>;
  updateClient: (id: string, data: UpdateClientDto) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  selectClient: (client: Client | null) => void;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,

  fetchClients: async () => {
    set({ loading: true, error: null });
    try {
      const clients = await clientService.getAll();
      set({ clients, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchClientById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const client = await clientService.getById(id);
      set({ selectedClient: client, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createClient: async (data: CreateClientDto) => {
    set({ loading: true, error: null });
    try {
      const client = await clientService.create(data);
      set((state) => ({
        clients: [...state.clients, client],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateClient: async (id: string, data: UpdateClientDto) => {
    set({ loading: true, error: null });
    try {
      const updatedClient = await clientService.update(id, data);
      if (updatedClient) {
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? updatedClient : c)),
          selectedClient: state.selectedClient?.id === id ? updatedClient : state.selectedClient,
          loading: false,
        }));
      } else {
        set({ error: 'Клиент не найден', loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteClient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await clientService.delete(id);
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  selectClient: (client: Client | null) => {
    set({ selectedClient: client });
  },
}));
