import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { authInterceptor } from './auth.interceptor';
import { csrfInterceptor } from './csrf.interceptor';
import { errorInterceptor } from './error.interceptor';
import { API_CONFIG } from '../config/api.config';

export const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable sending cookies with requests
  });

  // Request interceptors (order matters: auth first, then CSRF)
  client.interceptors.request.use(authInterceptor.onFulfilled, authInterceptor.onRejected);
  client.interceptors.request.use(csrfInterceptor.onFulfilled, csrfInterceptor.onRejected);

  // Response interceptors
  client.interceptors.response.use(errorInterceptor.onFulfilled, errorInterceptor.onRejected);

  return client;
};

export const httpClient = createHttpClient();
