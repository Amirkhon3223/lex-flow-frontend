/**
 * Google Analytics 4 (GA4) Integration Utility
 *
 * Provides functions for tracking pageviews, events, and user properties.
 * Only loads in production environment and respects user consent.
 *
 * @module analytics
 */

// GA4 Measurement ID from environment
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

// Check if we're in production mode
const isProduction = import.meta.env.PROD;

// Check if GA is properly configured
const isGAConfigured = (): boolean => {
  return isProduction && !!GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith('G-');
};

// Consent storage key
const CONSENT_STORAGE_KEY = 'lexflow_analytics_consent';

// Type definitions for gtag
type GTagCommand = 'config' | 'event' | 'set' | 'consent' | 'js';

interface GTagEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  page_path?: string;
  page_title?: string;
  page_location?: string;
  user_id?: string;
  [key: string]: string | number | boolean | undefined;
}

interface ConsentParams {
  ad_storage?: 'granted' | 'denied';
  analytics_storage?: 'granted' | 'denied';
  functionality_storage?: 'granted' | 'denied';
  personalization_storage?: 'granted' | 'denied';
  security_storage?: 'granted' | 'denied';
  wait_for_update?: number;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (command: GTagCommand, target: string | Date, params?: GTagEventParams | ConsentParams) => void;
  }
}

// Track if gtag script has been loaded
let gtagScriptLoaded = false;

/**
 * Load the gtag.js script dynamically
 */
const loadGtagScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (gtagScriptLoaded || typeof window === 'undefined' || !GA_MEASUREMENT_ID) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.onload = () => {
      gtagScriptLoaded = true;
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Failed to load Google Analytics script'));
    };
    document.head.appendChild(script);
  });
};

/**
 * Initialize the gtag function if not already present
 */
const initGtag = (): void => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];

  // Create gtag function if it doesn't exist
  if (!window.gtag) {
    window.gtag = function gtag(
      _command: GTagCommand,
      _target: string | Date,
      _params?: GTagEventParams | ConsentParams
    ) {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }
};

/**
 * Get user consent status from localStorage
 */
export const getConsentStatus = (): boolean | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (stored === null) return null;
  return stored === 'true';
};

/**
 * Set user consent status
 */
export const setConsentStatus = (granted: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_STORAGE_KEY, String(granted));

  if (isGAConfigured()) {
    initGtag();
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }
};

/**
 * Initialize Google Analytics with consent mode
 * Call this once when the app starts
 */
export const initializeAnalytics = (): void => {
  if (!isGAConfigured()) {
    if (!isProduction) {
      console.log('[Analytics] Skipped initialization (development mode)');
    } else if (!GA_MEASUREMENT_ID) {
      console.warn('[Analytics] VITE_GA_MEASUREMENT_ID not configured');
    }
    return;
  }

  // Initialize gtag function first (synchronously)
  initGtag();

  // Set default consent to denied (GDPR compliant)
  const hasConsent = getConsentStatus();

  window.gtag('consent', 'default', {
    analytics_storage: hasConsent === true ? 'granted' : 'denied',
    ad_storage: 'denied', // We don't use ads
    functionality_storage: 'granted',
    security_storage: 'granted',
  });

  // Load the gtag script asynchronously
  loadGtagScript()
    .then(() => {
      // Initialize timestamp
      window.gtag('js', new Date());

      // Configure GA4
      window.gtag('config', GA_MEASUREMENT_ID!, {
        send_page_view: false, // We'll handle page views manually for SPA
      });

    })
    .catch(() => {
    });
};

/**
 * Track a page view
 * @param path - The page path (e.g., '/dashboard')
 * @param title - The page title (optional)
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!isGAConfigured() || getConsentStatus() !== true) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

/**
 * Track a custom event
 * @param eventName - The name of the event
 * @param params - Optional event parameters
 */
export const trackEvent = (
  eventName: string,
  params?: GTagEventParams
): void => {
  if (!isGAConfigured() || getConsentStatus() !== true) return;

  window.gtag('event', eventName, params);
};

/**
 * Set user properties (for logged-in users)
 * @param userId - The user's unique ID
 * @param properties - Additional user properties
 */
export const setUserProperties = (
  userId: string,
  properties?: Record<string, string | number | boolean>
): void => {
  if (!isGAConfigured() || getConsentStatus() !== true) return;

  // Set user ID
  window.gtag('config', GA_MEASUREMENT_ID!, {
    user_id: userId,
  });

  // Set custom user properties
  if (properties) {
    window.gtag('set', 'user_properties', properties as GTagEventParams);
  }
};

/**
 * Clear user properties (on logout)
 */
export const clearUserProperties = (): void => {
  if (!isGAConfigured()) return;

  window.gtag('config', GA_MEASUREMENT_ID!, {
    user_id: undefined,
  });
};

// ============================================
// Pre-defined Event Tracking Functions
// ============================================

/**
 * Track login success
 * @param method - The login method used (e.g., 'email', '2fa')
 */
export const trackLogin = (method: string = 'email'): void => {
  trackEvent('login', {
    event_category: 'authentication',
    method,
  });
};

/**
 * Track registration success
 * @param method - The registration method
 */
export const trackRegistration = (method: string = 'email'): void => {
  trackEvent('sign_up', {
    event_category: 'authentication',
    method,
  });
};

/**
 * Track subscription actions
 * @param action - The action (subscribe, upgrade, downgrade, cancel)
 * @param planId - The plan ID
 * @param interval - The billing interval (monthly/yearly)
 */
export const trackSubscription = (
  action: 'subscribe' | 'upgrade' | 'downgrade' | 'cancel' | 'reactivate',
  planId?: string,
  interval?: 'monthly' | 'yearly'
): void => {
  trackEvent('subscription_action', {
    event_category: 'billing',
    event_label: action,
    plan_id: planId,
    billing_interval: interval,
  });
};

/**
 * Track AI Assistant usage
 * @param action - The AI action
 * @param details - Additional details
 */
export const trackAIUsage = (
  action: 'chat_message' | 'quick_chat' | 'document_analysis' | 'version_comparison' | 'token_purchase',
  details?: Record<string, string | number>
): void => {
  trackEvent('ai_assistant_usage', {
    event_category: 'ai',
    event_label: action,
    ...details,
  });
};

/**
 * Track document actions
 * @param action - The document action
 * @param documentType - The type of document
 * @param fileSize - The file size in bytes (optional)
 */
export const trackDocumentAction = (
  action: 'upload' | 'download' | 'delete' | 'compare' | 'create_version',
  documentType?: string,
  fileSize?: number
): void => {
  trackEvent('document_action', {
    event_category: 'documents',
    event_label: action,
    document_type: documentType,
    file_size: fileSize,
  });
};

/**
 * Track case actions
 * @param action - The case action
 * @param caseCategory - The case category
 */
export const trackCaseAction = (
  action: 'create' | 'update' | 'delete' | 'close',
  caseCategory?: string
): void => {
  trackEvent('case_action', {
    event_category: 'cases',
    event_label: action,
    case_category: caseCategory,
  });
};

/**
 * Track client actions
 * @param action - The client action
 * @param clientType - The client type
 */
export const trackClientAction = (
  action: 'create' | 'update' | 'delete',
  clientType?: string
): void => {
  trackEvent('client_action', {
    event_category: 'clients',
    event_label: action,
    client_type: clientType,
  });
};

/**
 * Track meeting actions
 * @param action - The meeting action
 * @param meetingType - The meeting type
 */
export const trackMeetingAction = (
  action: 'create' | 'update' | 'delete' | 'complete',
  meetingType?: string
): void => {
  trackEvent('meeting_action', {
    event_category: 'calendar',
    event_label: action,
    meeting_type: meetingType,
  });
};

/**
 * Track feature usage
 * @param featureName - The feature being used
 */
export const trackFeatureUsage = (featureName: string): void => {
  trackEvent('feature_usage', {
    event_category: 'engagement',
    event_label: featureName,
  });
};

/**
 * Track errors for debugging
 * @param errorType - The type of error
 * @param errorMessage - The error message
 */
export const trackError = (
  errorType: string,
  errorMessage: string
): void => {
  trackEvent('error', {
    event_category: 'errors',
    event_label: errorType,
    error_message: errorMessage.substring(0, 100), // Limit message length
  });
};

// Export the GA Measurement ID for use in index.html
export const GA_ID = GA_MEASUREMENT_ID;

// Default export for convenient import
export default {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  setUserProperties,
  clearUserProperties,
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
  getConsentStatus,
  setConsentStatus,
};
