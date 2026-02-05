import { useState, useEffect, useCallback, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  isStandalone: boolean;
  updateAvailable: boolean;
}

interface UsePWAReturn extends PWAState {
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'not-available'>;
  dismissInstallPrompt: () => void;
  isInstallPromptDismissed: boolean;
  checkForUpdates: () => Promise<void>;
  updateServiceWorker: () => void;
}

const INSTALL_DISMISSED_KEY = 'lexflow-pwa-install-dismissed';
const INSTALL_DISMISSED_TIMESTAMP_KEY = 'lexflow-pwa-install-dismissed-at';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function usePWA(): UsePWAReturn {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isStandalone: false,
    updateAvailable: false,
  });

  const [isInstallPromptDismissed, setIsInstallPromptDismissed] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const serviceWorkerRef = useRef<ServiceWorker | null>(null);

  // Check if PWA is installed or running in standalone mode
  const checkInstallStatus = useCallback(() => {
    if (typeof window === 'undefined') return false;

    // Check if running in standalone mode (installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    // Check iOS specific
    const isIOSInstalled =
      'standalone' in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone;

    return isStandalone || isIOSInstalled || false;
  }, []);

  // Check if install prompt was dismissed recently
  const checkDismissedStatus = useCallback(() => {
    try {
      const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY);
      const dismissedAt = localStorage.getItem(INSTALL_DISMISSED_TIMESTAMP_KEY);

      if (dismissed === 'true' && dismissedAt) {
        const dismissedTime = parseInt(dismissedAt, 10);
        const now = Date.now();

        // If dismiss duration has passed, reset
        if (now - dismissedTime > DISMISS_DURATION_MS) {
          localStorage.removeItem(INSTALL_DISMISSED_KEY);
          localStorage.removeItem(INSTALL_DISMISSED_TIMESTAMP_KEY);
          return false;
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Handle the beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setState((prev) => ({ ...prev, isInstallable: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle app installed event
  useEffect(() => {
    const handleAppInstalled = () => {
      setState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
      }));
      deferredPromptRef.current = null;
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setState((prev) => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setState((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle display mode changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');

    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setState((prev) => ({
        ...prev,
        isStandalone: e.matches,
        isInstalled: e.matches,
      }));
    };

    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  // Listen for service worker updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New service worker available
                serviceWorkerRef.current = newWorker;
                setState((prev) => ({ ...prev, updateAvailable: true }));
              }
            });
          }
        });
      });

      // Listen for controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload to use new service worker
        window.location.reload();
      });
    }
  }, []);

  // Initial state
  useEffect(() => {
    const isInstalled = checkInstallStatus();
    const dismissed = checkDismissedStatus();

    setState((prev) => ({
      ...prev,
      isInstalled,
      isStandalone: isInstalled,
    }));
    setIsInstallPromptDismissed(dismissed);
  }, [checkInstallStatus, checkDismissedStatus]);

  // Prompt install
  const promptInstall = useCallback(async (): Promise<
    'accepted' | 'dismissed' | 'not-available'
  > => {
    if (!deferredPromptRef.current) {
      return 'not-available';
    }

    try {
      await deferredPromptRef.current.prompt();
      const { outcome } = await deferredPromptRef.current.userChoice;

      if (outcome === 'accepted') {
        setState((prev) => ({
          ...prev,
          isInstalled: true,
          isInstallable: false,
        }));
      }

      deferredPromptRef.current = null;
      return outcome;
    } catch (error) {
      console.error('Error prompting install:', error);
      return 'not-available';
    }
  }, []);

  // Dismiss install prompt
  const dismissInstallPrompt = useCallback(() => {
    try {
      localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
      localStorage.setItem(INSTALL_DISMISSED_TIMESTAMP_KEY, Date.now().toString());
      setIsInstallPromptDismissed(true);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Check for service worker updates
  const checkForUpdates = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
    }
  }, []);

  // Apply service worker update
  const updateServiceWorker = useCallback(() => {
    if (serviceWorkerRef.current) {
      serviceWorkerRef.current.postMessage({ type: 'SKIP_WAITING' });
    }
  }, []);

  return {
    ...state,
    promptInstall,
    dismissInstallPrompt,
    isInstallPromptDismissed,
    checkForUpdates,
    updateServiceWorker,
  };
}

export default usePWA;
