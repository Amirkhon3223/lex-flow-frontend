import { httpClient } from '../../interceptors/http.interceptor';
import type { SuccessResponse } from '../../types/api/api.types';
import type {
  Notification,
  NotificationListResponse,
  NotificationStatsResponse,
} from '../../types/notifications/notifications.interfaces';

export const notificationsService = {
  list: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<NotificationListResponse> => {
    const response = await httpClient.get<NotificationListResponse>('/notifications', {
      params,
    });
    return response.data;
  },

  getUnread: async (limit?: number): Promise<Notification[]> => {
    const response = await httpClient.get<Notification[]>('/notifications/unread', {
      params: { limit },
    });
    return response.data;
  },

  getStats: async (): Promise<NotificationStatsResponse> => {
    const response = await httpClient.get<NotificationStatsResponse>('/notifications/stats');
    return response.data;
  },

  markAsRead: async (id: string): Promise<SuccessResponse> => {
    const response = await httpClient.put<SuccessResponse>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<SuccessResponse> => {
    const response = await httpClient.put<SuccessResponse>('/notifications/read-all');
    return response.data;
  },

  delete: async (id: string): Promise<SuccessResponse> => {
    const response = await httpClient.delete<SuccessResponse>(`/notifications/${id}`);
    return response.data;
  },

  deleteAll: async (): Promise<SuccessResponse> => {
    const response = await httpClient.delete<SuccessResponse>('/notifications');
    return response.data;
  },
};
