import { NotificationCategory } from './notifications.enums';
import type { Pagination } from '../api/api.types';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationCategory; // 'info', 'success', 'warning', 'error'
  read: boolean; // В новом ТЗ - read, а не is_read
  entityId?: string;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
}

export interface NotificationSettings {
  [key: string]: boolean; // event types
}

export interface NotificationSettingsResponse {
  settings: NotificationSettings;
}

export interface UpdateNotificationSettingsRequest {
  settings: NotificationSettings;
}

export interface NotificationListResponse {
  notifications: Notification[];
  pagination: Pagination;
}

export interface NotificationStatsByType {
  info: number;
  success: number;
  warning: number;
  error: number;
}

export interface NotificationStatsResponse {
  total: number;
  unread: number;
  read: number;
  byType: NotificationStatsByType;
}
