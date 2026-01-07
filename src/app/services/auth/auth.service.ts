import { httpClient } from '../../interceptors/http.interceptor';
import type { SuccessResponse } from '../../types/api/api.types';
import type { LoginRequest, RegisterRequest, AuthResponse, Verify2FALoginRequest } from '../../types/auth/auth.interfaces';

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await httpClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await httpClient.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verify2FALogin: async (data: Verify2FALoginRequest): Promise<AuthResponse> => {
    try {
      const response = await httpClient.post<AuthResponse>('/auth/verify-2fa-login', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<SuccessResponse> => {
    try {
      const response = await httpClient.post<SuccessResponse>('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
