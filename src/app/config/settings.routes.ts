import { ROUTES } from '@/app/config/routes.config';

export type SettingsTab = 'profile' | 'notifications' | 'security' | 'billing';

export const SETTINGS_TAB_TO_ROUTE = {
  profile: ROUTES.SETTINGS.PROFILE,
  notifications: ROUTES.SETTINGS.NOTIFICATIONS,
  security: ROUTES.SETTINGS.SECURITY,
  billing: ROUTES.SETTINGS.BILLING,
} satisfies Record<SettingsTab, string>;

export const ROUTE_TO_SETTINGS_TAB = {
  [ROUTES.SETTINGS.PROFILE]: 'profile',
  [ROUTES.SETTINGS.NOTIFICATIONS]: 'notifications',
  [ROUTES.SETTINGS.SECURITY]: 'security',
  [ROUTES.SETTINGS.BILLING]: 'billing',
} satisfies Record<string, SettingsTab>;

export const getSettingsTabFromPath = (path: string): SettingsTab => {
  if (path in ROUTE_TO_SETTINGS_TAB) {
    return ROUTE_TO_SETTINGS_TAB[path as keyof typeof ROUTE_TO_SETTINGS_TAB];
  }
  return 'profile';
};
