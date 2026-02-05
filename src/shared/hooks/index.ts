/**
 * @file index.ts
 * @description Barrel export for all shared hooks
 */

// Performance hooks
export { useDebounce } from './useDebounce';

// Analytics hooks
export { useAnalytics, usePageTracking } from './useAnalytics';

// UI/UX hooks
export { useHighlightItem } from './useHighlightItem';
export { usePWA } from './usePWA';
export { useSEO } from './useSEO';

// Accessibility hooks
export { useKeyboardNavigation } from './useKeyboardNavigation';
export { useKeyboardShortcuts } from './useKeyboardShortcuts';
export { useReducedMotion } from './useReducedMotion';

// Integration hooks
export { useGoogleCalendar } from './useGoogleCalendar';
export type { UseGoogleCalendarState, UseGoogleCalendarReturn } from './useGoogleCalendar';
