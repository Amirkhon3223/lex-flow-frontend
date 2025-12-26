import { httpClient } from '../../interceptors/http.interceptor';
import type { SuccessResponse } from '../../types/api/api.types';
import type {
  User,
  UpdateUserProfileRequest,
  UserStatsResponse,
  UpdateLanguageRequest,
  UpdateTimezoneRequest,
} from '../../types/users/users.interfaces';

export const usersService = {
  // Get current user profile
  getMe: async (): Promise<User> => {
    const response = await httpClient.get<User>('/users/me');
    return response.data;
  },

  // Update user profile
  updateMe: async (data: UpdateUserProfileRequest): Promise<User> => {
    const response = await httpClient.put<User>('/users/me', data);
    return response.data;
  },

  // Upload avatar
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

  // Delete avatar
  deleteAvatar: async (): Promise<SuccessResponse> => {
    const response = await httpClient.delete<SuccessResponse>('/users/me/avatar');
    return response.data;
  },

  // Get user statistics
  getStats: async (): Promise<UserStatsResponse> => {
    const response = await httpClient.get<UserStatsResponse>('/users/me/stats');
    return response.data;
  },

  // Update language
  updateLanguage: async (data: UpdateLanguageRequest): Promise<SuccessResponse> => {
    const response = await httpClient.put<SuccessResponse>('/users/me/language', data);
    return response.data;
  },

  // Update timezone
  updateTimezone: async (data: UpdateTimezoneRequest): Promise<SuccessResponse> => {
    const response = await httpClient.put<SuccessResponse>('/users/me/timezone', data);
    return response.data;
  },

  // Delete account
  deleteAccount: async (password: string, confirmation: string): Promise<SuccessResponse> => {
    const response = await httpClient.delete<SuccessResponse>('/users/me', {
      data: { password, confirmation },
    });
    return response.data;
  },
};
