import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useClientsStore } from '../clients.store';
import { mockClient } from '@/test/mocks/handlers';

// Mock the clients service
vi.mock('@/app/services/clients/clients.service', () => ({
  clientsService: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useClientsStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useClientsStore.setState({
      clients: [],
      selectedClient: null,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      filters: {},
    });
  });

  it('has correct initial state', () => {
    const state = useClientsStore.getState();

    expect(state.clients).toEqual([]);
    expect(state.selectedClient).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.pagination.page).toBe(1);
  });

  it('sets clients correctly', () => {
    const { setClients } = useClientsStore.getState();
    const clients = [mockClient, { ...mockClient, id: 'client-456' }];

    setClients(clients as any);

    expect(useClientsStore.getState().clients).toEqual(clients);
  });

  it('sets selected client', () => {
    const { setSelectedClient } = useClientsStore.getState();

    setSelectedClient(mockClient as any);

    expect(useClientsStore.getState().selectedClient).toEqual(mockClient);
  });

  it('clears selected client', () => {
    useClientsStore.setState({ selectedClient: mockClient as any });

    const { clearSelectedClient } = useClientsStore.getState();
    clearSelectedClient();

    expect(useClientsStore.getState().selectedClient).toBeNull();
  });

  it('updates pagination', () => {
    const { setPagination } = useClientsStore.getState();

    setPagination({ page: 2, limit: 20, total: 100, totalPages: 5 });

    const { pagination } = useClientsStore.getState();
    expect(pagination.page).toBe(2);
    expect(pagination.limit).toBe(20);
    expect(pagination.total).toBe(100);
  });

  it('handles loading state', () => {
    const { setLoading } = useClientsStore.getState();

    setLoading(true);
    expect(useClientsStore.getState().loading).toBe(true);

    setLoading(false);
    expect(useClientsStore.getState().loading).toBe(false);
  });

  it('handles filters', () => {
    const { setFilters } = useClientsStore.getState();

    setFilters({ type: 'individual', status: 'active' });

    expect(useClientsStore.getState().filters).toEqual({
      type: 'individual',
      status: 'active',
    });
  });

  it('resets filters', () => {
    useClientsStore.setState({
      filters: { type: 'individual', status: 'active' },
    });

    const { resetFilters } = useClientsStore.getState();
    resetFilters();

    expect(useClientsStore.getState().filters).toEqual({});
  });
});
