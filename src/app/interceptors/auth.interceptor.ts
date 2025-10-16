import type { InternalAxiosRequestConfig } from 'axios';

export const authInterceptor = {
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  onRejected: (error: unknown) => {
    return Promise.reject(error);
  },
};
