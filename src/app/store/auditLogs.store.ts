import { create } from 'zustand';
import { auditLogService } from '@/app/services/audit/auditLog.service';
import type { AuditLogInterface, AuditLogFilter } from '@/app/types/audit/audit.interfaces';

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface AuditLogsState {
  logs: AuditLogInterface[];
  selectedLog: AuditLogInterface | null;
  pagination: Pagination;
  filter: AuditLogFilter;
  loading: boolean;
  error: string | null;

  // Actions
  fetchLogs: (page?: number, limit?: number) => Promise<void>;
  setFilter: (filter: AuditLogFilter) => void;
  clearFilter: () => void;
  fetchLogById: (id: string) => Promise<void>;
  fetchLogsByEntity: (entityType: string, entityId: string, page?: number) => Promise<void>;
  exportLogs: () => Promise<void>;
}

export const useAuditLogsStore = create<AuditLogsState>((set, get) => ({
  logs: [],
  selectedLog: null,
  pagination: {
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0,
  },
  filter: {},
  loading: false,
  error: null,

  fetchLogs: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const { filter } = get();
      const response = await auditLogService.getAll(page, limit, filter);
      set({
        logs: response.logs,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch audit logs',
        loading: false,
      });
    }
  },

  setFilter: (filter: AuditLogFilter) => {
    set({ filter });
  },

  clearFilter: () => {
    set({ filter: {} });
  },

  fetchLogById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const log = await auditLogService.getById(id);
      set({ selectedLog: log, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch audit log',
        loading: false,
      });
    }
  },

  fetchLogsByEntity: async (entityType: string, entityId: string, page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await auditLogService.getByEntity(entityType, entityId, page);
      set({
        logs: response.logs,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch audit logs',
        loading: false,
      });
    }
  },

  exportLogs: async () => {
    try {
      const { filter } = get();
      const blob = await auditLogService.exportToCsv(filter);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to export audit logs',
      });
    }
  },
}));
