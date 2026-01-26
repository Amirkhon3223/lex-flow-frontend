import { httpClient } from '../../interceptors/http.interceptor';
import type {
  ChatInterface,
  ChatListResponse,
  ChatWithMessagesResponse,
  CreateChatRequest,
  SendMessageRequest,
  MessageInterface,
  QuickChatRequest,
  QuickChatResponse,
  AnalyzeDocumentRequest,
  DocumentAnalysisResponse,
  TokenBalanceResponse,
  TokenPacksResponse,
  TokenUsageListResponse,
  InsightsListResponse,
} from '../../types/ai/ai.interfaces';

// Helper to get CSRF token from cookies (for native fetch requests)
const getCsrfToken = (): string | null => {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrf_token='));
  if (match) {
    return decodeURIComponent(match.split('=')[1]);
  }
  return null;
};

export const aiService = {
  // Chat methods
  createChat: async (data: CreateChatRequest): Promise<ChatInterface> => {
    const response = await httpClient.post<ChatInterface>('/ai/chats', data);
    return response.data;
  },

  getChats: async (params?: { offset?: number; limit?: number }): Promise<ChatListResponse> => {
    const response = await httpClient.get<ChatListResponse>('/ai/chats', { params });
    return response.data;
  },

  getChat: async (chatId: string): Promise<ChatWithMessagesResponse> => {
    const response = await httpClient.get<ChatWithMessagesResponse>(`/ai/chats/${chatId}`);
    return response.data;
  },

  deleteChat: async (chatId: string): Promise<void> => {
    await httpClient.delete(`/ai/chats/${chatId}`);
  },

  archiveChat: async (chatId: string): Promise<void> => {
    await httpClient.post(`/ai/chats/${chatId}/archive`);
  },

  // Message methods
  sendMessage: async (chatId: string, data: SendMessageRequest): Promise<MessageInterface> => {
    const response = await httpClient.post<MessageInterface>(
      `/ai/chats/${chatId}/messages`,
      data
    );
    return response.data;
  },

  // Streaming message
  streamMessage: async (
    chatId: string,
    data: SendMessageRequest,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (error: string) => void
  ): Promise<void> => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    const csrfToken = getCsrfToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    const response = await fetch(`${baseUrl}/ai/chats/${chatId}/messages/stream`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      onError(error);
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      onError('No response body');
      return;
    }

    // Buffer for incomplete SSE events
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Append new data to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events (separated by double newline)
        const events = buffer.split(/\r?\n\r?\n/);

        // Keep the last potentially incomplete event in buffer
        buffer = events.pop() || '';

        for (const event of events) {
          if (!event.trim()) continue;

          const lines = event.split(/\r?\n/);
          let eventType = '';
          let eventData = '';

          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventType = line.slice(6).trim();
            } else if (line.startsWith('data:')) {
              // Get data after "data:" - preserve spaces!
              eventData = line.slice(5);
              // Remove only leading space if present (SSE spec says one space after colon is optional)
              if (eventData.startsWith(' ')) {
                eventData = eventData.slice(1);
              }
            }
          }

          if (eventType === 'done') {
            onDone();
            return;
          }

          if (eventType === 'error') {
            onError(eventData || 'Stream error');
            return;
          }

          if (eventType === 'message' && eventData !== undefined) {
            // Send chunk even if it's just whitespace - preserve all characters
            onChunk(eventData);
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        const lines = buffer.split(/\r?\n/);
        for (const line of lines) {
          if (line.startsWith('data:')) {
            let eventData = line.slice(5);
            if (eventData.startsWith(' ')) {
              eventData = eventData.slice(1);
            }
            if (eventData) {
              onChunk(eventData);
            }
          }
        }
      }

      onDone();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Stream error');
    }
  },

  // Quick chat (no session)
  quickChat: async (data: QuickChatRequest): Promise<QuickChatResponse> => {
    const response = await httpClient.post<QuickChatResponse>('/ai/quick-chat', data);
    return response.data;
  },

  // Document analysis
  analyzeDocument: async (
    documentId: string,
    data: AnalyzeDocumentRequest
  ): Promise<DocumentAnalysisResponse> => {
    const response = await httpClient.post<DocumentAnalysisResponse>(
      `/ai/documents/${documentId}/analysis`,
      data
    );
    return response.data;
  },

  getDocumentAnalysis: async (
    documentId: string,
    versionId: string,
    analysisType: string
  ): Promise<DocumentAnalysisResponse> => {
    const response = await httpClient.get<DocumentAnalysisResponse>(
      `/ai/documents/${documentId}/analysis`,
      { params: { versionId, analysisType } }
    );
    return response.data;
  },

  // Version comparison
  compareVersions: async (
    documentId: string,
    data: { version1Id: string; version2Id: string }
  ): Promise<{
    id: string;
    documentId: string;
    version1Id: string;
    version2Id: string;
    summary: string;
    details?: string;
    tokensUsed: number;
    model: string;
    createdAt: string;
  }> => {
    const response = await httpClient.post(`/ai/documents/${documentId}/compare`, data);
    return response.data;
  },

  getVersionComparison: async (
    documentId: string,
    version1Id: string,
    version2Id: string
  ): Promise<{
    id: string;
    documentId: string;
    version1Id: string;
    version2Id: string;
    summary: string;
    details?: string;
    tokensUsed: number;
    model: string;
    createdAt: string;
  } | null> => {
    try {
      const response = await httpClient.get(`/ai/documents/${documentId}/compare`, {
        params: { version1Id, version2Id },
      });
      return response.data;
    } catch {
      return null;
    }
  },

  // Token methods
  getTokenBalance: async (): Promise<TokenBalanceResponse> => {
    const response = await httpClient.get<TokenBalanceResponse>('/ai/tokens/balance');
    return response.data;
  },

  getTokenPacks: async (): Promise<TokenPacksResponse> => {
    const response = await httpClient.get<TokenPacksResponse>('/ai/tokens/packs');
    return response.data;
  },

  getTokenUsage: async (params?: {
    offset?: number;
    limit?: number;
  }): Promise<TokenUsageListResponse> => {
    const response = await httpClient.get<TokenUsageListResponse>('/ai/tokens/usage', { params });
    return response.data;
  },

  purchaseTokens: async (packType: string): Promise<{ checkoutUrl: string; sessionId: string }> => {
    const response = await httpClient.post<{ checkoutUrl: string; sessionId: string }>(
      '/ai/tokens/purchase',
      { packType }
    );
    return response.data;
  },

  // Insights
  getInsights: async (): Promise<InsightsListResponse> => {
    const response = await httpClient.get<InsightsListResponse>('/ai/insights');
    return response.data;
  },
};
