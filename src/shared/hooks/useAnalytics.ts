/**
 * useAnalytics Hook
 *
 * A React hook for easy analytics event tracking throughout the application.
 * Provides memoized tracking functions and automatic page view tracking.
 *
 * @module useAnalytics
 */

import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  trackPageView,
  trackEvent,
  trackLogin,
  trackRegistration,
  trackSubscription,
  trackAIUsage,
  trackDocumentAction,
  trackCaseAction,
  trackClientAction,
  trackMeetingAction,
  trackFeatureUsage,
  trackError,
  setUserProperties,
  clearUserProperties,
  getConsentStatus,
  setConsentStatus,
} from '../utils/analytics';

interface UseAnalyticsOptions {
  /**
   * Whether to automatically track page views on route changes
   * @default true
   */
  autoTrackPageViews?: boolean;
}

interface UseAnalyticsReturn {
  // Page tracking
  trackPageView: (path: string, title?: string) => void;

  // Generic event tracking
  trackEvent: (eventName: string, params?: Record<string, string | number | boolean | undefined>) => void;

  // Authentication tracking
  trackLogin: (method?: string) => void;
  trackRegistration: (method?: string) => void;

  // Subscription tracking
  trackSubscription: (
    action: 'subscribe' | 'upgrade' | 'downgrade' | 'cancel' | 'reactivate',
    planId?: string,
    interval?: 'monthly' | 'yearly'
  ) => void;

  // AI tracking
  trackAIUsage: (
    action: 'chat_message' | 'quick_chat' | 'document_analysis' | 'version_comparison' | 'token_purchase',
    details?: Record<string, string | number>
  ) => void;

  // Document tracking
  trackDocumentAction: (
    action: 'upload' | 'download' | 'delete' | 'compare' | 'create_version',
    documentType?: string,
    fileSize?: number
  ) => void;

  // Case tracking
  trackCaseAction: (action: 'create' | 'update' | 'delete' | 'close', caseCategory?: string) => void;

  // Client tracking
  trackClientAction: (action: 'create' | 'update' | 'delete', clientType?: string) => void;

  // Meeting tracking
  trackMeetingAction: (action: 'create' | 'update' | 'delete' | 'complete', meetingType?: string) => void;

  // Feature tracking
  trackFeatureUsage: (featureName: string) => void;

  // Error tracking
  trackError: (errorType: string, errorMessage: string) => void;

  // User properties
  setUserProperties: (userId: string, properties?: Record<string, string | number | boolean>) => void;
  clearUserProperties: () => void;

  // Consent management
  getConsentStatus: () => boolean | null;
  setConsentStatus: (granted: boolean) => void;
  hasConsent: boolean | null;
}

/**
 * Hook for analytics tracking with automatic page view tracking
 *
 * @example
 * ```tsx
 * const { trackLogin, trackFeatureUsage } = useAnalytics();
 *
 * const handleLogin = async () => {
 *   await login(credentials);
 *   trackLogin('email');
 * };
 *
 * const handleExport = () => {
 *   trackFeatureUsage('export_report');
 *   exportData();
 * };
 * ```
 */
export const useAnalytics = (options: UseAnalyticsOptions = {}): UseAnalyticsReturn => {
  const { autoTrackPageViews = true } = options;
  const location = useLocation();
  const prevPathRef = useRef<string>('');

  // Automatic page view tracking on route changes
  useEffect(() => {
    if (!autoTrackPageViews) return;

    const currentPath = location.pathname + location.search;

    // Only track if path has changed to avoid duplicate tracking
    if (currentPath !== prevPathRef.current) {
      prevPathRef.current = currentPath;
      trackPageView(currentPath);
    }
  }, [location, autoTrackPageViews]);

  // Memoized tracking functions
  const memoizedTrackPageView = useCallback((path: string, title?: string) => {
    trackPageView(path, title);
  }, []);

  const memoizedTrackEvent = useCallback(
    (eventName: string, params?: Record<string, string | number | boolean | undefined>) => {
      trackEvent(eventName, params);
    },
    []
  );

  const memoizedTrackLogin = useCallback((method?: string) => {
    trackLogin(method);
  }, []);

  const memoizedTrackRegistration = useCallback((method?: string) => {
    trackRegistration(method);
  }, []);

  const memoizedTrackSubscription = useCallback(
    (
      action: 'subscribe' | 'upgrade' | 'downgrade' | 'cancel' | 'reactivate',
      planId?: string,
      interval?: 'monthly' | 'yearly'
    ) => {
      trackSubscription(action, planId, interval);
    },
    []
  );

  const memoizedTrackAIUsage = useCallback(
    (
      action: 'chat_message' | 'quick_chat' | 'document_analysis' | 'version_comparison' | 'token_purchase',
      details?: Record<string, string | number>
    ) => {
      trackAIUsage(action, details);
    },
    []
  );

  const memoizedTrackDocumentAction = useCallback(
    (
      action: 'upload' | 'download' | 'delete' | 'compare' | 'create_version',
      documentType?: string,
      fileSize?: number
    ) => {
      trackDocumentAction(action, documentType, fileSize);
    },
    []
  );

  const memoizedTrackCaseAction = useCallback(
    (action: 'create' | 'update' | 'delete' | 'close', caseCategory?: string) => {
      trackCaseAction(action, caseCategory);
    },
    []
  );

  const memoizedTrackClientAction = useCallback(
    (action: 'create' | 'update' | 'delete', clientType?: string) => {
      trackClientAction(action, clientType);
    },
    []
  );

  const memoizedTrackMeetingAction = useCallback(
    (action: 'create' | 'update' | 'delete' | 'complete', meetingType?: string) => {
      trackMeetingAction(action, meetingType);
    },
    []
  );

  const memoizedTrackFeatureUsage = useCallback((featureName: string) => {
    trackFeatureUsage(featureName);
  }, []);

  const memoizedTrackError = useCallback((errorType: string, errorMessage: string) => {
    trackError(errorType, errorMessage);
  }, []);

  const memoizedSetUserProperties = useCallback(
    (userId: string, properties?: Record<string, string | number | boolean>) => {
      setUserProperties(userId, properties);
    },
    []
  );

  const memoizedClearUserProperties = useCallback(() => {
    clearUserProperties();
  }, []);

  const memoizedSetConsentStatus = useCallback((granted: boolean) => {
    setConsentStatus(granted);
  }, []);

  return {
    trackPageView: memoizedTrackPageView,
    trackEvent: memoizedTrackEvent,
    trackLogin: memoizedTrackLogin,
    trackRegistration: memoizedTrackRegistration,
    trackSubscription: memoizedTrackSubscription,
    trackAIUsage: memoizedTrackAIUsage,
    trackDocumentAction: memoizedTrackDocumentAction,
    trackCaseAction: memoizedTrackCaseAction,
    trackClientAction: memoizedTrackClientAction,
    trackMeetingAction: memoizedTrackMeetingAction,
    trackFeatureUsage: memoizedTrackFeatureUsage,
    trackError: memoizedTrackError,
    setUserProperties: memoizedSetUserProperties,
    clearUserProperties: memoizedClearUserProperties,
    getConsentStatus,
    setConsentStatus: memoizedSetConsentStatus,
    hasConsent: getConsentStatus(),
  };
};

/**
 * Standalone hook for page view tracking only
 * Use this when you only need automatic page tracking without other analytics functions
 *
 * @example
 * ```tsx
 * // In your root layout component
 * function Layout() {
 *   usePageTracking();
 *   return <Outlet />;
 * }
 * ```
 */
export const usePageTracking = (): void => {
  const location = useLocation();
  const prevPathRef = useRef<string>('');

  useEffect(() => {
    const currentPath = location.pathname + location.search;

    if (currentPath !== prevPathRef.current) {
      prevPathRef.current = currentPath;
      trackPageView(currentPath);
    }
  }, [location]);
};

export default useAnalytics;
