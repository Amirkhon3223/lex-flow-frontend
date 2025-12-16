export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  TIMEOUT: 30000,
  ENDPOINTS: {
    HEALTH: '/health',
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REGISTER: '/auth/register',
    },
    CLIENTS: {
      BASE: '/clients',
      BY_ID: (id: string) => `/clients/${id}`,
    },
    CASES: {
      BASE: '/cases',
      BY_ID: (id: string) => `/cases/${id}`,
      TIMELINE: (id: string) => `/cases/${id}/timeline`,
      TIMELINE_EVENT: (id: string, eventId: string) => `/cases/${id}/timeline/${eventId}`,
    },
    DOCUMENTS: {
      BASE: '/documents',
      BY_ID: (id: string) => `/documents/${id}`,
            UPLOAD: '/documents/file-upload',
            DOWNLOAD: (id: string) => `/documents/${id}/download`,
            VERSIONS: (id: string) => `/documents/${id}/file-versions`,
            VERSION: (id: string, versionId: string) => `/documents/${id}/file-versions/${versionId}`,
            VERSION_DOWNLOAD: (id: string, versionId: string) =>
              `/documents/${id}/file-versions/${versionId}/download`,
    },
    CALENDAR: {
      MEETINGS: '/calendar/meetings',
      MEETING_BY_ID: (id: string) => `/calendar/meetings/${id}`,
      DAY: '/calendar/day',
      WEEK: '/calendar/week',
      MONTH: '/calendar/month',
      UPCOMING: '/calendar/upcoming',
      TODAY: '/calendar/today',
      STATS: '/calendar/stats',
    },
    NOTIFICATIONS: {
      WS: '/notifications/ws',
      BASE: '/notifications',
      BY_ID: (id: string) => `/notifications/${id}`,
      UNREAD: '/notifications/unread',
      MARK_READ: (id: string) => `/notifications/${id}/read`,
      MARK_ALL_READ: '/notifications/read-all',
      STATS: '/notifications/stats',
    },
    ANALYTICS: {
      DASHBOARD: '/analytics/dashboard',
      CASES: '/analytics/cases',
      CLIENTS: '/analytics/clients',
      DOCUMENTS: '/analytics/documents',
      MEETINGS: '/analytics/meetings',
    },
  },
};
