import { NotificationCategory } from './notifications.enums';
import type { Pagination } from '../api/api.types';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationCategory;
  read: boolean;
  entityId?: string;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
}

export interface NotificationSettings {
  [key: string]: boolean;
}

export interface NotificationSettingsResponse {
  settings: NotificationSettings;
  emailSettings: NotificationSettings;
}

export interface UpdateNotificationSettingsRequest {
  settings?: NotificationSettings;
  emailSettings?: NotificationSettings;
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
