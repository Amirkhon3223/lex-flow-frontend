import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { handleApiError } from '../utils/errorHandler';

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

    if (error.response?.status === 429) {
      const retryCount = originalRequest._retryCount || 0;
      const maxRetries = 3;

      if (retryCount < maxRetries) {
        const retryAfter = error.response.data?.retry_after ||
                          parseInt(error.response.headers?.['retry-after'] || '60');

        const backoffDelay = Math.min(retryAfter * 1000, Math.pow(2, retryCount) * 1000);

        originalRequest._retryCount = retryCount + 1;

        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        return axios(originalRequest);
      }

      handleApiError(error);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        handleApiError(error);
        return Promise.reject(error);
      }

      if (isRefreshing) {
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
        await axios.post(
          `${API_CONFIG.BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        processQueue(null);
        isRefreshing = false;

        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(new Error('Token refresh failed'));
        isRefreshing = false;

        handleApiError(error);

        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    handleApiError(error);
    return Promise.reject(error);
  },
};
