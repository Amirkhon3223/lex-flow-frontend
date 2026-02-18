/**
 * @file prefetch.ts
 * @description Prefetching utilities for route data, hover-based prefetching, and image preloading.
 * These utilities help improve perceived performance by loading resources before they're needed.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Route component map for dynamic imports
 * Maps route paths to their lazy-loaded component modules
 */
const routeComponentMap: Record<string, () => Promise<unknown>> = {
  '/': () => import('@/pages/DashboardPage'),
  '/clients': () => import('@/pages/ClientsPage'),
  '/cases': () => import('@/pages/CasesPage'),
  '/documents': () => import('@/pages/DocumentsPage'),
  '/calendar': () => import('@/pages/CalendarPage'),
  '/analytics': () => import('@/pages/AnalyticsPage'),
  '/ai-assistant': () => import('@/pages/AiAssistantPage'),
  '/settings': () => import('@/pages/SettingsPage'),
  '/notifications': () => import('@/pages/NotificationsPage'),
  '/user-profile': () => import('@/pages/UserProfilePage'),
};

// Track which routes have been prefetched to avoid duplicate requests
const prefetchedRoutes = new Set<string>();

/**
 * Prefetch a route's component code
 * This loads the JavaScript bundle for a route before navigation
 *
 * @param path - The route path to prefetch
 * @returns Promise that resolves when prefetch is complete
 *
 * @example
 * // Prefetch the clients page
 * prefetchRoute('/clients');
 */
export async function prefetchRoute(path: string): Promise<void> {
  // Normalize path
  const normalizedPath = path.split('?')[0].split('#')[0];

  // Don't prefetch if already done
  if (prefetchedRoutes.has(normalizedPath)) {
    return;
  }

  // Find matching route (handle dynamic routes)
  let componentLoader = routeComponentMap[normalizedPath];

  // Try base paths for dynamic routes
  if (!componentLoader) {
    const basePath = normalizedPath.split('/').slice(0, 2).join('/');
    componentLoader = routeComponentMap[basePath];
  }

  if (componentLoader) {
    try {
      await componentLoader();
      prefetchedRoutes.add(normalizedPath);
    } catch (error) {
      // Silently fail - prefetching is an optimization, not critical
      if (import.meta.env.DEV) {
        console.debug('[Prefetch] Failed to prefetch route:', normalizedPath, error);
      }
    }
  }
}

/**
 * Hook for prefetching routes on hover
 * Returns event handlers to attach to navigation elements
 *
 * @param path - The route path to prefetch on hover
 * @param delay - Delay in ms before prefetching (default: 100ms)
 * @returns Object with onMouseEnter and onFocus handlers
 *
 * @example
 * const prefetchHandlers = usePrefetchOnHover('/clients');
 *
 * <Link to="/clients" {...prefetchHandlers}>
 *   Clients
 * </Link>
 */
export function usePrefetchOnHover(path: string, delay: number = 100) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInteraction = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Prefetch after a short delay to avoid prefetching on quick mouse passes
    timeoutRef.current = setTimeout(() => {
      prefetchRoute(path);
    }, delay);
  }, [path, delay]);

  const handleLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    onMouseEnter: handleInteraction,
    onFocus: handleInteraction,
    onMouseLeave: handleLeave,
    onBlur: handleLeave,
  };
}

/**
 * Hook to preload images
 * Useful for preloading images that will be needed soon
 *
 * @param urls - Array of image URLs to preload
 * @param options - Configuration options
 * @returns Object with loading state and preloaded status
 *
 * @example
 * const { isLoading, preloadedCount, hasErrors } = usePreloadImages([
 *   '/images/hero.jpg',
 *   '/images/avatar.png'
 * ]);
 */
export function usePreloadImages(
  urls: string[],
  options: {
    /** Whether to start preloading immediately */
    immediate?: boolean;
    /** Priority hint for loading */
    priority?: 'high' | 'low' | 'auto';
  } = {}
) {
  const { immediate = true, priority = 'auto' } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [preloadedCount, setPreloadedCount] = useState(0);
  const [hasErrors, setHasErrors] = useState(false);

  const preload = useCallback(async () => {
    if (urls.length === 0) return;

    setIsLoading(true);
    setPreloadedCount(0);
    setHasErrors(false);

    const loadImage = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();

        // Set loading priority if supported
        if ('loading' in img && priority !== 'auto') {
          img.loading = priority === 'high' ? 'eager' : 'lazy';
        }

        img.onload = () => {
          setPreloadedCount((prev) => prev + 1);
          resolve();
        };

        img.onerror = () => {
          setHasErrors(true);
          setPreloadedCount((prev) => prev + 1);
          resolve(); // Resolve anyway to continue with other images
        };

        img.src = url;
      });
    };

    try {
      await Promise.all(urls.map(loadImage));
    } finally {
      setIsLoading(false);
    }
  }, [urls, priority]);

  // Preload on mount if immediate
  useEffect(() => {
    if (immediate && urls.length > 0) {
      preload();
    }
  }, [immediate, preload, urls.length]);

  return {
    isLoading,
    preloadedCount,
    totalCount: urls.length,
    hasErrors,
    preload, // Manual trigger
  };
}

/**
 * Preload a single image
 * Returns a promise that resolves when the image is loaded
 *
 * @param url - Image URL to preload
 * @returns Promise that resolves to true on success, false on error
 *
 * @example
 * await preloadImage('/images/hero.jpg');
 * // Image is now cached in browser
 */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Preload multiple images in parallel
 *
 * @param urls - Array of image URLs to preload
 * @returns Promise that resolves to array of results (true = success)
 *
 * @example
 * const results = await preloadImages(['/img1.jpg', '/img2.jpg']);
 * // results: [true, false] - first succeeded, second failed
 */
export function preloadImages(urls: string[]): Promise<boolean[]> {
  return Promise.all(urls.map(preloadImage));
}

/**
 * Check if a route has been prefetched
 *
 * @param path - Route path to check
 * @returns Whether the route has been prefetched
 */
export function isRoutePrefetched(path: string): boolean {
  return prefetchedRoutes.has(path);
}

/**
 * Clear prefetch cache
 * Useful for testing or when routes need to be re-prefetched
 */
export function clearPrefetchCache(): void {
  prefetchedRoutes.clear();
}

export default {
  prefetchRoute,
  usePrefetchOnHover,
  usePreloadImages,
  preloadImage,
  preloadImages,
  isRoutePrefetched,
  clearPrefetchCache,
};
