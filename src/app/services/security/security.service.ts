import { httpClient } from '../../interceptors/http.interceptor';
import type { SuccessResponse } from '../../types/api/api.types';
import type {
  ChangePasswordRequest,
  TwoFactorStatusResponse,
  TwoFactorEnableResponse,
  TwoFactorVerifyRequest,
  TwoFactorDisableRequest,
  SessionsListResponse,
} from '../../types/security/security.interfaces';

export const securityService = {
  // ==================== PASSWORD ====================
  changePassword: async (data: ChangePasswordRequest): Promise<SuccessResponse> => {
    const response = await httpClient.put<SuccessResponse>('/users/me/password', data);
    return response.data;
  },

  // ==================== 2FA ====================
  // Get 2FA status
  get2FAStatus: async (): Promise<TwoFactorStatusResponse> => {
    const response = await httpClient.get<TwoFactorStatusResponse>('/users/me/2fa/status');
    return response.data;
  },

  // Enable 2FA (get QR code and secret)
  enable2FA: async (): Promise<TwoFactorEnableResponse> => {
    const response = await httpClient.post<TwoFactorEnableResponse>('/users/me/2fa/enable');
    return response.data;
  },

  // Verify 2FA code
  verify2FA: async (data: TwoFactorVerifyRequest): Promise<SuccessResponse> => {
    const response = await httpClient.post<SuccessResponse>('/users/me/2fa/verify', data);
    return response.data;
  },

  // Disable 2FA
  disable2FA: async (data: TwoFactorDisableRequest): Promise<SuccessResponse> => {
    const response = await httpClient.post<SuccessResponse>('/users/me/2fa/disable', data);
    return response.data;
  },

  // Get backup codes
  getBackupCodes: async (): Promise<{ backupCodes: string[] }> => {
    const response = await httpClient.get<{ backupCodes: string[] }>(
      '/users/me/2fa/backup-codes'
    );
    return response.data;
  },

  // ==================== SESSIONS ====================
  // Get active sessions
  getSessions: async (): Promise<SessionsListResponse> => {
    const response = await httpClient.get<SessionsListResponse>('/users/me/sessions');
    return response.data;
  },

  // Terminate session
  terminateSession: async (sessionId: string): Promise<SuccessResponse> => {
    const response = await httpClient.delete<SuccessResponse>(
      `/users/me/sessions/${sessionId}`
    );
    return response.data;
  },

  // Terminate all sessions except current
  terminateAllSessions: async (): Promise<SuccessResponse> => {
    const response = await httpClient.delete<SuccessResponse>('/users/me/sessions');
    return response.data;
  },
};
