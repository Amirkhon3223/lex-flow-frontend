import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { authInterceptor } from './auth.interceptor';
import { errorInterceptor } from './error.interceptor';
import { API_CONFIG } from '../config/api.config';

export const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(
    authInterceptor.onFulfilled,
    authInterceptor.onRejected
  );

  client.interceptors.response.use(
    errorInterceptor.onFulfilled,
    errorInterceptor.onRejected
  );

  return client;
};

export const httpClient = createHttpClient();
