import { httpClient } from '../../interceptors/http.interceptor';
import type { SuccessResponse } from '../../types/api/api.types';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../../types/auth/auth.interfaces';

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

  logout: async (): Promise<SuccessResponse> => {
    try {
      const response = await httpClient.post<SuccessResponse>('/auth/logout');
      localStorage.removeItem('access_token');
      return response.data;
    } catch (error) {
      // Даже если сервер не ответил, очищаем локальный токен
      localStorage.removeItem('access_token');
      throw error;
    }
  },
};
