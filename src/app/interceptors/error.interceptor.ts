import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { handleApiError } from '../utils/errorHandler';
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  retry_after?: number;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

export const errorInterceptor = {
  onFulfilled: (response: AxiosResponse) => {
    return response;
  },

  onRejected: async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    // Handle 429 Rate Limit with automatic retry and exponential backoff
    if (error.response?.status === 429) {
      const retryCount = originalRequest._retryCount || 0;
      const maxRetries = 3;

      if (retryCount < maxRetries) {
        const retryAfter = error.response.data?.retry_after ||
                          parseInt(error.response.headers?.['retry-after'] || '60');

        // Exponential backoff: 1s, 2s, 4s
        const backoffDelay = Math.min(retryAfter * 1000, Math.pow(2, retryCount) * 1000);

        originalRequest._retryCount = retryCount + 1;

        // Wait and retry
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        return axios(originalRequest);
      }

      // Max retries exceeded, show error
      handleApiError(error);
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints to avoid infinite loop
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        handleApiError(error);
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        await axios.post(
          `${API_CONFIG.BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true, // Send cookies with refresh request
          }
        );

        processQueue(null);
        isRefreshing = false;

        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(new Error('Token refresh failed'));
        isRefreshing = false;

        // Refresh failed, handle error and redirect to login
        handleApiError(error);

        // Redirect to login page
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    // For non-401 errors or if retry failed
    handleApiError(error);
    return Promise.reject(error);
  },
};
