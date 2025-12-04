import { httpClient } from '../../interceptors/http.interceptor';
import type {
  NotificationInterface,
  CreateNotificationInterface,
  NotificationListResponse,
  NotificationStatsResponse,
} from '../../types/notifications/notifications.interfaces';
import type { SuccessResponse } from '../../types/api/api.types';

export const notificationsService = {
  create: async (data: CreateNotificationInterface): Promise<NotificationInterface> => {
    const response = await httpClient.post<NotificationInterface>(
      '/notifications',
      data
    );
    return response.data;
  },

  list: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    read?: boolean;
  }): Promise<NotificationListResponse> => {
    const response = await httpClient.get<NotificationListResponse>('/notifications', {
      params,
    });
    return response.data;
  },

  getUnread: async (limit?: number): Promise<NotificationInterface[]> => {
    const response = await httpClient.get<NotificationInterface[]>(
      '/notifications/unread',
      { params: { limit } }
    );
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

  getStats: async (): Promise<NotificationStatsResponse> => {
    const response = await httpClient.get<NotificationStatsResponse>(
      '/notifications/stats'
    );
    return response.data;
  },
};
