import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface UiState {
  sidebarOpen: boolean;
  notificationPanelOpen: boolean;
  theme: Theme;
  activeModal: string | null;
  toggleSidebar: () => void;
  toggleNotificationPanel: () => void;
  setTheme: (theme: Theme) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  notificationPanelOpen: false,
  theme: 'light',
  activeModal: null,

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  toggleNotificationPanel: () => {
    set((state) => ({ notificationPanelOpen: !state.notificationPanelOpen }));
  },

  setTheme: (theme: Theme) => {
    set({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  openModal: (modalId: string) => {
    set({ activeModal: modalId });
  },

  closeModal: () => {
    set({ activeModal: null });
  },
}));
