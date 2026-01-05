import type { InternalAxiosRequestConfig } from 'axios';

export const authInterceptor = {
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    return config;
  },

  onRejected: (error: unknown) => {
    return Promise.reject(error);
  },
};
