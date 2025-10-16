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
    DETAIL: (id: string) => `/documents/${id}`,
  },
  CALENDAR: '/calendar',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
};
