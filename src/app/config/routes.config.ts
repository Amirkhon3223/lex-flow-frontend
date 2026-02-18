export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
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

  TEMPLATES: '/templates',

  CALENDAR: '/calendar',
  CALENDAR_MEETING: (id: string) => `/calendar/meetings/${id}`,

  CONFLICT_CHECK: '/conflict-check',
  TRUST_ACCOUNTS: '/trust-accounts',
  ANALYTICS: '/analytics',
  AI_ASSISTANT: '/ai-assistant',
  NOTIFICATIONS: '/notifications',

  SETTINGS: {
    ROOT: '/settings',
    PROFILE: '/settings',
    NOTIFICATIONS: '/settings/notifications',
    SECURITY: '/settings/security',
    BILLING: '/settings/billing',
    AUDIT: '/settings/audit',
  },

  USER_PROFILE: '/user-profile',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
} as const;
