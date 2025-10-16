import type { AxiosError, AxiosResponse } from 'axios';
import { handleApiError } from '../utils/errorHandler';

interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export const errorInterceptor = {
  onFulfilled: (response: AxiosResponse) => {
    return response;
  },

  onRejected: (error: AxiosError<ErrorResponse>) => {
    handleApiError(error);
    return Promise.reject(error);
  },
};
