import { create } from 'zustand';
import { notificationsSettingsService } from '../services/notifications/notifications-settings.service';
import { notificationsService } from '../services/notifications/notifications.service';
import type {
  Notification,
  NotificationSettings,
  NotificationStatsResponse,
} from '../types/notifications/notifications.interfaces';
import type { Pagination } from '@/app/types/api/api.types';

interface NotificationsState {
  notifications: Notification[];
  settings: NotificationSettings;
  pagination: Pagination;
  stats: NotificationStatsResponse;
  loading: boolean;
  error: string | null;
  fetchNotifications: (page?: number, limit?: number) => Promise<void>;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: NotificationSettings) => Promise<void>;
  fetchStats: () => Promise<void>;
}

const initialStats: NotificationStatsResponse = {
  total: 0,
  unread: 0,
  read: 0,
  byType: {
    info: 0,
    success: 0,
    warning: 0,
    error: 0,
  },
};

const initialPagination: Pagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
};

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  settings: {},
  pagination: initialPagination,
  stats: initialStats,
  loading: false,
  error: null,

  fetchNotifications: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const response = await notificationsService.list({ page, limit });
      set({
        notifications: response.notifications,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      stats: {
        ...state.stats,
        total: state.stats.total + 1,
        unread: state.stats.unread + 1,
        byType: {
          ...state.stats.byType,
          [notification.type]: (state.stats.byType[notification.type] || 0) + 1,
        },
      },
      pagination: {
        ...state.pagination,
        total: state.pagination.total + 1,
      },
    }));
  },

  markAsRead: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await notificationsService.markAsRead(id);
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        if (notification && !notification.read) {
          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n,
            ),
            stats: {
              ...state.stats,
              unread: state.stats.unread - 1,
              read: state.stats.read + 1,
            },
            loading: false,
          };
        }
        return { ...state, loading: false };
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  markAllAsRead: async () => {
    set({ loading: true, error: null });
    try {
      await notificationsService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        stats: {
          ...state.stats,
          unread: 0,
          read: state.stats.total,
        },
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteNotification: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await notificationsService.delete(id);
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        const newNotifications = state.notifications.filter((n) => n.id !== id);
        return {
          notifications: newNotifications,
          stats: {
            ...state.stats,
            total: state.stats.total - 1,
            unread: notification && !notification.read ? state.stats.unread - 1 : state.stats.unread,
            read: notification && notification.read ? state.stats.read - 1 : state.stats.read,
            byType: notification ? {
              ...state.stats.byType,
              [notification.type]: Math.max(0, (state.stats.byType[notification.type] || 0) - 1),
            } : state.stats.byType,
          },
          pagination: {
            ...state.pagination,
            total: state.pagination.total - 1,
          },
          loading: false,
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteAllNotifications: async () => {
    set({ loading: true, error: null });
    try {
      await notificationsService.deleteAll();
      set((state) => ({
        notifications: [],
        stats: {
          ...state.stats,
          total: 0,
          unread: 0,
          read: 0,
          byType: { info: 0, success: 0, warning: 0, error: 0 },
        },
        pagination: {
          ...state.pagination,
          total: 0,
        },
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await notificationsSettingsService.getSettings();
      set({ settings: response.settings, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateSettings: async (settings: NotificationSettings) => {
    set({ loading: true, error: null });
    try {
      const response = await notificationsSettingsService.updateSettings({ settings });
      set({ settings: response.settings, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await notificationsService.getStats();
      set({ stats: response, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
