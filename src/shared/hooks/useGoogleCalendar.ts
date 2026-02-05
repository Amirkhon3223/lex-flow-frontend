/**
 * @file useGoogleCalendar.ts
 * @description React hook for managing Google Calendar integration state
 */

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { googleCalendarService } from '@/app/services/calendar/googleCalendar.service';
import type {
  GoogleCalendarConnection,
  GoogleCalendarInfo,
  GoogleCalendarSyncSettings,
  SyncResult,
  SyncToGoogleRequest,
  ImportFromGoogleRequest,
} from '@/app/types/calendar/googleCalendar.interfaces';
import { DEFAULT_SYNC_SETTINGS } from '@/app/types/calendar/googleCalendar.interfaces';

/**
 * Hook state interface
 */
interface UseGoogleCalendarState {
  /** Connection status with Google Calendar */
  connection: GoogleCalendarConnection | null;
  /** List of available calendars */
  calendars: GoogleCalendarInfo[];
  /** Current sync settings */
  syncSettings: GoogleCalendarSyncSettings;
  /** Last sync result */
  lastSyncResult: SyncResult | null;
  /** Whether the feature is available (backend exists) */
  isAvailable: boolean;
  /** Loading states */
  loading: {
    connection: boolean;
    calendars: boolean;
    sync: boolean;
    settings: boolean;
    disconnect: boolean;
  };
  /** Error state */
  error: string | null;
}

/**
 * Hook return interface
 */
interface UseGoogleCalendarReturn extends UseGoogleCalendarState {
  /** Start OAuth connection flow */
  connect: () => Promise<void>;
  /** Disconnect Google Calendar */
  disconnect: () => Promise<void>;
  /** Sync meetings to Google Calendar */
  syncToGoogle: (request?: SyncToGoogleRequest) => Promise<SyncResult | null>;
  /** Import events from Google Calendar */
  importFromGoogle: (request: ImportFromGoogleRequest) => Promise<SyncResult | null>;
  /** Update sync settings */
  updateSettings: (settings: Partial<GoogleCalendarSyncSettings>) => Promise<void>;
  /** Refresh connection status */
  refreshConnection: () => Promise<void>;
  /** Refresh available calendars */
  refreshCalendars: () => Promise<void>;
  /** Check if connected */
  isConnected: boolean;
  /** Clear error */
  clearError: () => void;
}

/**
 * Hook for managing Google Calendar integration
 *
 * @example
 * ```tsx
 * const {
 *   connection,
 *   isConnected,
 *   isAvailable,
 *   loading,
 *   connect,
 *   disconnect,
 *   syncToGoogle
 * } = useGoogleCalendar();
 *
 * if (!isAvailable) {
 *   return <ComingSoon />;
 * }
 *
 * return isConnected ? (
 *   <ConnectedView onSync={syncToGoogle} onDisconnect={disconnect} />
 * ) : (
 *   <ConnectButton onClick={connect} loading={loading.connection} />
 * );
 * ```
 */
export function useGoogleCalendar(): UseGoogleCalendarReturn {
  const [state, setState] = useState<UseGoogleCalendarState>({
    connection: null,
    calendars: [],
    syncSettings: DEFAULT_SYNC_SETTINGS,
    lastSyncResult: null,
    isAvailable: true, // Assume available until proven otherwise
    loading: {
      connection: false,
      calendars: false,
      sync: false,
      settings: false,
      disconnect: false,
    },
    error: null,
  });

  /**
   * Helper to update loading state
   */
  const setLoading = useCallback((key: keyof UseGoogleCalendarState['loading'], value: boolean) => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, [key]: value },
    }));
  }, []);

  /**
   * Helper to set error
   */
  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  /**
   * Check if feature is available (backend exists)
   */
  const checkAvailability = useCallback(async () => {
    try {
      const available = await googleCalendarService.isAvailable();
      setState((prev) => ({ ...prev, isAvailable: available }));
      return available;
    } catch {
      setState((prev) => ({ ...prev, isAvailable: false }));
      return false;
    }
  }, []);

  /**
   * Fetch connection status from backend
   */
  const refreshConnection = useCallback(async () => {
    setLoading('connection', true);
    setError(null);

    try {
      const connection = await googleCalendarService.getConnectionStatus();
      setState((prev) => ({
        ...prev,
        connection,
        isAvailable: true,
      }));
    } catch (error) {
      // Check if it's a 404 (feature not available)
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { status?: number } }).response;
        if (response?.status === 404) {
          setState((prev) => ({ ...prev, isAvailable: false }));
          return;
        }
      }
      // For other errors, set error state but keep available true
      const message = error instanceof Error ? error.message : 'Failed to fetch connection status';
      setError(message);
    } finally {
      setLoading('connection', false);
    }
  }, [setLoading, setError]);

  /**
   * Fetch available calendars
   */
  const refreshCalendars = useCallback(async () => {
    if (!state.connection?.connected) return;

    setLoading('calendars', true);
    setError(null);

    try {
      const calendars = await googleCalendarService.listCalendars();
      setState((prev) => ({ ...prev, calendars }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch calendars';
      setError(message);
    } finally {
      setLoading('calendars', false);
    }
  }, [state.connection?.connected, setLoading, setError]);

  /**
   * Start OAuth connection flow
   */
  const connect = useCallback(async () => {
    setLoading('connection', true);
    setError(null);

    try {
      const authUrl = await googleCalendarService.initiateOAuthFlow();

      // Open OAuth consent page
      // The backend will handle the callback and redirect back to the app
      window.location.href = authUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start connection';
      setError(message);
      toast.error(message);
      setLoading('connection', false);
    }
    // Note: setLoading(false) is not called here because we're redirecting away
  }, [setLoading, setError]);

  /**
   * Disconnect Google Calendar
   */
  const disconnect = useCallback(async () => {
    setLoading('disconnect', true);
    setError(null);

    try {
      await googleCalendarService.disconnect();
      setState((prev) => ({
        ...prev,
        connection: { connected: false },
        calendars: [],
        syncSettings: DEFAULT_SYNC_SETTINGS,
        lastSyncResult: null,
      }));
      toast.success('Google Calendar disconnected');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to disconnect';
      setError(message);
      toast.error(message);
    } finally {
      setLoading('disconnect', false);
    }
  }, [setLoading, setError]);

  /**
   * Sync meetings to Google Calendar
   */
  const syncToGoogle = useCallback(
    async (request?: SyncToGoogleRequest): Promise<SyncResult | null> => {
      setLoading('sync', true);
      setError(null);

      try {
        const result = await googleCalendarService.syncToGoogle(request);
        setState((prev) => ({ ...prev, lastSyncResult: result }));

        if (result.success) {
          toast.success(
            `Synced ${result.eventsPushed} meeting(s) to Google Calendar`
          );
        } else {
          toast.error('Sync completed with errors');
        }

        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to sync';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading('sync', false);
      }
    },
    [setLoading, setError]
  );

  /**
   * Import events from Google Calendar
   */
  const importFromGoogle = useCallback(
    async (request: ImportFromGoogleRequest): Promise<SyncResult | null> => {
      setLoading('sync', true);
      setError(null);

      try {
        const result = await googleCalendarService.importFromGoogle(request);
        setState((prev) => ({ ...prev, lastSyncResult: result }));

        if (result.success) {
          toast.success(
            `Imported ${result.eventsImported} event(s) from Google Calendar`
          );
        } else {
          toast.error('Import completed with errors');
        }

        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to import';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading('sync', false);
      }
    },
    [setLoading, setError]
  );

  /**
   * Update sync settings
   */
  const updateSettings = useCallback(
    async (settings: Partial<GoogleCalendarSyncSettings>) => {
      setLoading('settings', true);
      setError(null);

      try {
        const updatedSettings = await googleCalendarService.updateSyncSettings(settings);
        setState((prev) => ({ ...prev, syncSettings: updatedSettings }));
        toast.success('Settings updated');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update settings';
        setError(message);
        toast.error(message);
      } finally {
        setLoading('settings', false);
      }
    },
    [setLoading, setError]
  );

  /**
   * Load initial data on mount
   */
  useEffect(() => {
    const init = async () => {
      const available = await checkAvailability();
      if (available) {
        await refreshConnection();
      }
    };

    init();
  }, [checkAvailability, refreshConnection]);

  /**
   * Load calendars when connected
   */
  useEffect(() => {
    if (state.connection?.connected) {
      refreshCalendars();
    }
  }, [state.connection?.connected, refreshCalendars]);

  /**
   * Load settings when connected
   */
  useEffect(() => {
    if (state.connection?.connected) {
      const loadSettings = async () => {
        try {
          const settings = await googleCalendarService.getSyncSettings();
          setState((prev) => ({ ...prev, syncSettings: settings }));
        } catch {
          // Use defaults if can't load settings
        }
      };
      loadSettings();
    }
  }, [state.connection?.connected]);

  return {
    ...state,
    isConnected: state.connection?.connected ?? false,
    connect,
    disconnect,
    syncToGoogle,
    importFromGoogle,
    updateSettings,
    refreshConnection,
    refreshCalendars,
    clearError,
  };
}

export type { UseGoogleCalendarState, UseGoogleCalendarReturn };
