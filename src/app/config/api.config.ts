export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
    },
    CLIENTS: {
      BASE: '/clients',
      BY_ID: (id: string) => `/clients/${id}`,
    },
    CASES: {
      BASE: '/cases',
      BY_ID: (id: string) => `/cases/${id}`,
      AI_ANALYSIS: (id: string) => `/cases/${id}/ai-analysis`,
    },
    DOCUMENTS: {
      BASE: '/documents',
      BY_ID: (id: string) => `/documents/${id}`,
      UPLOAD: '/documents/upload',
    },
    CALENDAR: {
      EVENTS: '/calendar/events',
      EVENT_BY_ID: (id: string) => `/calendar/events/${id}`,
    },
    REPORTS: {
      BASE: '/reports',
      GENERATE: '/reports/generate',
    },
    NOTIFICATIONS: {
      BASE: '/notifications',
      MARK_READ: (id: string) => `/notifications/${id}/read`,
    },
    SETTINGS: {
      PROFILE: '/settings/profile',
      PREFERENCES: '/settings/preferences',
    },
  },
};
