import { httpClient } from '@/app/interceptors/http.interceptor';

export interface TelegramBotStatusResponse {
  enabled: boolean;
  botUsername?: string;
  botName?: string;
  message: string;
}

export interface TelegramTestMessageRequest {
  chatId: string;
}

export interface TelegramSuccessResponse {
  message: string;
}

export const telegramService = {
  /**
   * Get Telegram bot status
   */
  getBotStatus: async (): Promise<TelegramBotStatusResponse> => {
    const response = await httpClient.get<TelegramBotStatusResponse>('/telegram/status');
    return response.data;
  },

  /**
   * Send test message to verify integration
   */
  sendTestMessage: async (chatId: string): Promise<TelegramSuccessResponse> => {
    const response = await httpClient.post<TelegramSuccessResponse>('/telegram/test', { chatId });
    return response.data;
  },
};
