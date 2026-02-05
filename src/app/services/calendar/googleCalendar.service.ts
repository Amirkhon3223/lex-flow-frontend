/**
 * @file googleCalendar.service.ts
 * @description API service for Google Calendar integration
 *
 * Expected Backend Endpoints:
 * ----------------------------
 * GET  /api/v1/calendar/google/auth-url     - Get OAuth authorization URL
 *      Response: { authUrl: string, state?: string }
 *
 * GET  /api/v1/calendar/google/callback     - OAuth callback handler (handled by backend redirect)
 *      Query: code, state
 *      Response: redirect to frontend with success/error
 *
 * GET  /api/v1/calendar/google/status       - Get current connection status
 *      Response: GoogleCalendarConnection
 *
 * POST /api/v1/calendar/google/sync         - Sync meetings to Google Calendar
 *      Body: SyncToGoogleRequest
 *      Response: SyncResult
 *
 * POST /api/v1/calendar/google/import       - Import events from Google Calendar
 *      Body: ImportFromGoogleRequest
 *      Response: SyncResult
 *
 * PUT  /api/v1/calendar/google/settings     - Update sync settings
 *      Body: GoogleCalendarSyncSettings
 *      Response: GoogleCalendarSyncSettings
 *
 * GET  /api/v1/calendar/google/settings     - Get current sync settings
 *      Response: GoogleCalendarSyncSettings
 *
 * GET  /api/v1/calendar/google/calendars    - List available Google calendars
 *      Response: GoogleCalendarInfo[]
 *
 * DELETE /api/v1/calendar/google/disconnect - Disconnect Google Calendar
 *      Response: { success: boolean, message: string }
 *
 * Note: Backend may not exist yet. Errors are handled gracefully with
 * appropriate fallback behavior.
 */

import { httpClient } from '@/app/interceptors/http.interceptor';
import type {
  GoogleCalendarConnection,
  GoogleCalendarInfo,
  GoogleCalendarSyncSettings,
  GoogleAuthUrlResponse,
  SyncResult,
  SyncToGoogleRequest,
  ImportFromGoogleRequest,
} from '@/app/types/calendar/googleCalendar.interfaces';

/**
 * Response for disconnect operation
 */
interface DisconnectResponse {
  success: boolean;
  message: string;
}

/**
 * Service for Google Calendar integration API calls
 */
export const googleCalendarService = {
  /**
   * Get OAuth authorization URL to start connection flow
   * Redirects user to Google consent screen
   */
  getAuthUrl: async (): Promise<GoogleAuthUrlResponse> => {
    const response = await httpClient.get<GoogleAuthUrlResponse>('/calendar/google/auth-url');
    return response.data;
  },

  /**
   * Get current Google Calendar connection status
   * Returns connection info and available calendars
   */
  getConnectionStatus: async (): Promise<GoogleCalendarConnection> => {
    const response = await httpClient.get<GoogleCalendarConnection>('/calendar/google/status');
    return response.data;
  },

  /**
   * Disconnect Google Calendar account
   * Revokes OAuth tokens and removes connection
   */
  disconnect: async (): Promise<DisconnectResponse> => {
    const response = await httpClient.delete<DisconnectResponse>('/calendar/google/disconnect');
    return response.data;
  },

  /**
   * Sync LexFlow meetings to Google Calendar
   * @param request - Optional sync configuration
   */
  syncToGoogle: async (request?: SyncToGoogleRequest): Promise<SyncResult> => {
    const response = await httpClient.post<SyncResult>('/calendar/google/sync', request ?? {});
    return response.data;
  },

  /**
   * Import events from Google Calendar to LexFlow
   * @param request - Import configuration with calendar IDs and date range
   */
  importFromGoogle: async (request: ImportFromGoogleRequest): Promise<SyncResult> => {
    const response = await httpClient.post<SyncResult>('/calendar/google/import', request);
    return response.data;
  },

  /**
   * Get current sync settings
   */
  getSyncSettings: async (): Promise<GoogleCalendarSyncSettings> => {
    const response = await httpClient.get<GoogleCalendarSyncSettings>('/calendar/google/settings');
    return response.data;
  },

  /**
   * Update sync settings
   * @param settings - New sync settings configuration
   */
  updateSyncSettings: async (
    settings: Partial<GoogleCalendarSyncSettings>
  ): Promise<GoogleCalendarSyncSettings> => {
    const response = await httpClient.put<GoogleCalendarSyncSettings>(
      '/calendar/google/settings',
      settings
    );
    return response.data;
  },

  /**
   * List available calendars from connected Google account
   */
  listCalendars: async (): Promise<GoogleCalendarInfo[]> => {
    const response = await httpClient.get<GoogleCalendarInfo[]>('/calendar/google/calendars');
    return response.data;
  },

  /**
   * Helper: Open Google OAuth consent page in new window
   * Returns the auth URL for manual handling
   */
  initiateOAuthFlow: async (): Promise<string> => {
    const { authUrl } = await googleCalendarService.getAuthUrl();
    return authUrl;
  },

  /**
   * Helper: Check if Google Calendar integration is available
   * Returns false if backend doesn't support this feature yet
   */
  isAvailable: async (): Promise<boolean> => {
    try {
      await googleCalendarService.getConnectionStatus();
      return true;
    } catch (error) {
      // If we get a 404, the feature is not available
      // Other errors might be auth-related, so still consider it available
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { status?: number } }).response;
        if (response?.status === 404) {
          return false;
        }
      }
      return true;
    }
  },
};

export type { DisconnectResponse };
