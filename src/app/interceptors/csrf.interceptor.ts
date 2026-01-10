import type { InternalAxiosRequestConfig } from 'axios';

/**
 * CSRF Interceptor
 * Automatically adds CSRF token to requests that modify data
 */
export const csrfInterceptor = {
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toUpperCase();

    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const csrfToken = getCsrfToken();

      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
        // Debug logging for production troubleshooting
        if (import.meta.env.PROD) {
          console.log('[CSRF] Token found and added to request:', {
            method,
            url: config.url,
            tokenPrefix: csrfToken.substring(0, 10) + '...',
            hasToken: !!csrfToken,
          });
        }
      } else {
        // CRITICAL: Log if token is missing
        console.warn('[CSRF] ⚠️ Token NOT found in cookies for', method, config.url);
        console.warn('[CSRF] Available cookies:', document.cookie);
      }
    }

    return config;
  },

  onRejected: (error: unknown) => {
    return Promise.reject(error);
  },
};

/**
 * Get CSRF token from cookie
 * Supports both url-encoded and plain tokens
 */
function getCsrfToken(): string | null {
  const cookies = document.cookie.split('; ');
  const csrfCookie = cookies.find((cookie) => cookie.startsWith('csrf_token='));

  if (csrfCookie) {
    const encodedToken = csrfCookie.split('=')[1];
    try {
      // Try to decode URI component
      return decodeURIComponent(encodedToken);
    } catch {
      // If decoding fails, return as-is
      return encodedToken;
    }
  }

  return null;
}
