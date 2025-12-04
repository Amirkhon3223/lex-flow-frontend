import { NotificationTypeEnum } from './notifications.enums';
import type { Pagination } from '../api/api.types';

export interface NotificationInterface {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationTypeEnum;
  read: boolean;
  actionUrl: string | null;
  actionLabel: string | null;
  createdAt: string;
}

export interface CreateNotificationInterface {
  userId: string;
  title: string;
  message: string;
  type: NotificationTypeEnum;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationListResponse {
  notifications: NotificationInterface[];
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
