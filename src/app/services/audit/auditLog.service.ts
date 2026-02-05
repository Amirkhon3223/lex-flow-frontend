import { httpClient } from '@/app/interceptors/http.interceptor';
import type { AuditLogFilter, AuditLogInterface, AuditLogListResponse } from '@/app/types/audit/audit.interfaces';

class AuditLogService {
  private readonly baseUrl = '/audit-logs';

  async getAll(
    page: number = 1,
    limit: number = 20,
    filter?: AuditLogFilter
  ): Promise<AuditLogListResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filter) {
      if (filter.userId) params.append('userId', filter.userId);
      if (filter.action) params.append('action', filter.action);
      if (filter.entityType) params.append('entityType', filter.entityType);
      if (filter.entityId) params.append('entityId', filter.entityId);
      if (filter.dateFrom) params.append('dateFrom', filter.dateFrom);
      if (filter.dateTo) params.append('dateTo', filter.dateTo);
      if (filter.search) params.append('search', filter.search);
    }

    const response = await httpClient.get<AuditLogListResponse>(
      `${this.baseUrl}?${params.toString()}`
    );
    return response.data;
  }

  async getById(id: string): Promise<AuditLogInterface> {
    const response = await httpClient.get<AuditLogInterface>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getByEntity(
    entityType: string,
    entityId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<AuditLogListResponse> {
    const response = await httpClient.get<AuditLogListResponse>(
      `${this.baseUrl}/entity/${entityType}/${entityId}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async exportToCsv(filter?: AuditLogFilter): Promise<Blob> {
    const params = new URLSearchParams();

    if (filter) {
      if (filter.userId) params.append('userId', filter.userId);
      if (filter.action) params.append('action', filter.action);
      if (filter.entityType) params.append('entityType', filter.entityType);
      if (filter.dateFrom) params.append('dateFrom', filter.dateFrom);
      if (filter.dateTo) params.append('dateTo', filter.dateTo);
    }

    const response = await httpClient.get(`${this.baseUrl}/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export const auditLogService = new AuditLogService();
