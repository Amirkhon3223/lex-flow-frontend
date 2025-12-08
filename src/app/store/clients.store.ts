import { create } from 'zustand';
import { clientsService } from '../services/clients/clients.service';
import type { ClientInterface, CreateClientInterface, UpdateClientInterface } from '../types/clients/clients.interfaces';

interface ClientsState {
  clients: ClientInterface[];
  selectedClient: ClientInterface | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  fetchClients: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  fetchClientById: (id: string) => Promise<void>;
  createClient: (data: CreateClientInterface) => Promise<void>;
  updateClient: (id: string, data: UpdateClientInterface) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  selectClient: (client: ClientInterface | null) => void;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,
  pagination: null,

  fetchClients: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await clientsService.list(params);
      set({
        clients: response.data,
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        loading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchClientById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const client = await clientsService.getById(id);
      set({ selectedClient: client, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createClient: async (data: CreateClientInterface) => {
    set({ loading: true, error: null });
    try {
      const client = await clientsService.create(data);
      set((state) => ({
        clients: [...state.clients, client],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateClient: async (id: string, data: UpdateClientInterface) => {
    set({ loading: true, error: null });
    try {
      const updatedClient = await clientsService.update(id, data);
      set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? updatedClient : c)),
        selectedClient: state.selectedClient?.id === id ? updatedClient : state.selectedClient,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteClient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await clientsService.delete(id);
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  selectClient: (client: ClientInterface | null) => {
    set({ selectedClient: client });
  },
}));
