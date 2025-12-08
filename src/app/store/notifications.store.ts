import { create } from 'zustand';
import { notificationsService } from '../services/notifications/notifications.service';
import type { NotificationInterface } from '../types/notifications/notifications.interfaces';

interface NotificationsState {
  notifications: NotificationInterface[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (page?: number, limit?: number) => Promise<void>;
  fetchUnread: (limit?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAll: () => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const response = await notificationsService.list({ page, limit });
      const unreadCount = response.notifications.filter((n) => !n.read).length;
      set({ notifications: response.notifications, unreadCount, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchUnread: async (limit = 50) => {
    set({ loading: true, error: null });
    try {
      const notifications = await notificationsService.getUnread(limit);
      set({ notifications, unreadCount: notifications.length, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  markAsRead: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await notificationsService.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
        loading: false,
      }));
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
        unreadCount: 0,
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
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: state.unreadCount - (state.notifications.find(n => n.id === id)?.read ? 0 : 1),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteAll: async () => {
    set({ loading: true, error: null });
    try {
      await notificationsService.deleteAll();
      set({ notifications: [], unreadCount: 0, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
