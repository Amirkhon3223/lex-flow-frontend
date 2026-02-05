export type AuditAction = 'create' | 'update' | 'delete' | 'view' | 'export' | 'login' | 'logout';

export type AuditEntityType =
  | 'client'
  | 'case'
  | 'document'
  | 'meeting'
  | 'task'
  | 'comment'
  | 'user'
  | 'workspace'
  | 'subscription'
  | 'team_member'
  | 'auth';

export interface AuditLogInterface {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string;
  entityName?: string;
  details?: string;
  oldValues?: string;
  newValues?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogFilter {
  userId?: string;
  action?: AuditAction;
  entityType?: AuditEntityType;
  entityId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface AuditLogListResponse {
  logs: AuditLogInterface[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
