import type { InternalAxiosRequestConfig } from 'axios';

/**
 * CSRF Interceptor
 * Automatically adds CSRF token to requests that modify data
 */
export const csrfInterceptor = {
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toUpperCase();

    // Only add CSRF token for unsafe methods
    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const csrfToken = getCsrfToken();

      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
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
 */
function getCsrfToken(): string | null {
  const cookies = document.cookie.split('; ');
  const csrfCookie = cookies.find((cookie) => cookie.startsWith('csrf_token='));

  if (csrfCookie) {
    const encodedToken = csrfCookie.split('=')[1];
    // Decode the token because Gin URL-encodes cookie values
    return decodeURIComponent(encodedToken);
  }

  return null;
}
