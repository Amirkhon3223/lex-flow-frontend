export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },

  DASHBOARD: '/',

  CLIENTS: {
    BASE: '/clients',
    DETAIL: (id: string) => `/clients/${id}`,
    CREATE: '/clients/create',
  },

  CASES: {
    BASE: '/cases',
    DETAIL: (id: string) => `/cases/${id}`,
    CREATE: '/cases/create',
  },

  DOCUMENTS: {
    BASE: '/documents',
    DETAIL: (id: string) => `/documents/${id}/file-versions`,
    COMPARE: (id: string) => `/documents/${id}/compare`,
  },

  CALENDAR: '/calendar',
  CALENDAR_MEETING: (id: string) => `/calendar/meetings/${id}`,

  ANALYTICS: '/analytics',
  AI_ASSISTANT: '/ai-assistant',
  NOTIFICATIONS: '/notifications',

  SETTINGS: {
    ROOT: '/settings',
    PROFILE: '/settings',
    NOTIFICATIONS: '/settings/notifications',
    SECURITY: '/settings/security',
    BILLING: '/settings/billing',
  },

  USER_PROFILE: '/user-profile',
} as const;
