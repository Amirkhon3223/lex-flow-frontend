import type { InternalAxiosRequestConfig } from 'axios';

export const authInterceptor = {
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    // Cookie is automatically sent by browser with withCredentials: true
    // No need to manually add Authorization header anymore
    return config;
  },

  onRejected: (error: unknown) => {
    return Promise.reject(error);
  },
};
