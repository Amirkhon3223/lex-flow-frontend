import { httpClient } from '../../interceptors/http.interceptor';
import type { SuccessResponse } from '../../types/api/api.types';
import type {
  User,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
  UserStatsResponse,
  UpdateLanguageRequest,
  UpdateTimezoneRequest,
  UpdateCurrencyRequest,
} from '../../types/users/users.interfaces';

export const usersService = {
  getMe: async (): Promise<User> => {
    const response = await httpClient.get<User>('/users/me');
    return response.data;
  },

  updateMe: async (data: Partial<UpdateUserProfileRequest>): Promise<User> => {
    const response = await httpClient.patch<UpdateUserProfileResponse>('/users/me', data);
    return response.data.user;
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await httpClient.post<{ avatarUrl: string }>(
      '/users/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  deleteAvatar: async (): Promise<SuccessResponse> => {
    const response = await httpClient.delete<SuccessResponse>('/users/me/avatar');
    return response.data;
  },

  getStats: async (): Promise<UserStatsResponse> => {
    const response = await httpClient.get<UserStatsResponse>('/users/me/stats');
    return response.data;
  },

  updateLanguage: async (data: UpdateLanguageRequest): Promise<SuccessResponse> => {
    const response = await httpClient.put<SuccessResponse>('/users/me/language', data);
    return response.data;
  },

  updateTimezone: async (data: UpdateTimezoneRequest): Promise<SuccessResponse> => {
    const response = await httpClient.put<SuccessResponse>('/users/me/timezone', data);
    return response.data;
  },

  updateCurrency: async (data: UpdateCurrencyRequest): Promise<SuccessResponse> => {
    const response = await httpClient.put<SuccessResponse>('/users/me/currency', data);
    return response.data;
  },

  deleteAccount: async (password: string, confirmation: string): Promise<SuccessResponse> => {
    const response = await httpClient.delete<SuccessResponse>('/users/me', {
      data: { password, confirmation },
    });
    return response.data;
  },
};
