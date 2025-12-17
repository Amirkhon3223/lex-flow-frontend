import { httpClient } from '../../interceptors/http.interceptor';
import type { SuccessResponse } from '../../types/api/api.types';
import type {
  NotificationSettingsResponse,
  UpdateNotificationSettingsRequest,
} from '../../types/notifications/notifications.interfaces';

export const notificationsSettingsService = {
  getSettings: async (): Promise<NotificationSettingsResponse> => {
    const response = await httpClient.get<NotificationSettingsResponse>(
      '/notifications/settings'
    );
    return response.data;
  },

  updateSettings: async (
    data: UpdateNotificationSettingsRequest
  ): Promise<NotificationSettingsResponse> => {
    const response = await httpClient.put<NotificationSettingsResponse>(
      '/notifications/settings',
      data
    );
    return response.data;
  },
};
