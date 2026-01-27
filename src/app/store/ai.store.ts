import { create } from 'zustand';
import { aiService } from '../services/ai/ai.service';
import { i18nService } from '../services/i18n/i18n.service';
import type {
  ChatInterface,
  MessageInterface,
  TokenBalanceResponse,
  InsightInterface,
  QuickChatResponse,
  DocumentAnalysisResponse,
} from '../types/ai/ai.interfaces';

interface AIState {
  // Chats
  chats: ChatInterface[];
  currentChat: ChatInterface | null;
  messages: MessageInterface[];

  // Token balance
  tokenBalance: TokenBalanceResponse | null;

  // Insights
  insights: InsightInterface[];

  // UI state
  loading: boolean;
  sendingMessage: boolean;
  streamingMessage: string;
  isStreaming: boolean;
  error: string | null;

  // Chat actions
  fetchChats: () => Promise<void>;
  createChat: (title?: string) => Promise<ChatInterface>;
  selectChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  archiveChat: (chatId: string) => Promise<void>;

  // Message actions
  sendMessage: (content: string, documentIds?: string[], caseIds?: string[]) => Promise<void>;
  sendMessageStreaming: (content: string, documentIds?: string[], caseIds?: string[]) => Promise<void>;
  quickChat: (message: string) => Promise<QuickChatResponse>;

  // Document analysis
  analyzeDocument: (
    documentId: string,
    analysisType: 'overview' | 'risks' | 'summary' | 'full'
  ) => Promise<DocumentAnalysisResponse>;

  // Token actions
  fetchTokenBalance: () => Promise<void>;
  purchaseTokens: (packType: 'starter' | 'standard' | 'large') => Promise<string>;

  // Insights actions
  fetchInsights: () => Promise<void>;

  // Clear actions
  clearChat: () => void;
  clearError: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  // Initial state
  chats: [],
  currentChat: null,
  messages: [],
  tokenBalance: null,
  insights: [],
  loading: false,
  sendingMessage: false,
  streamingMessage: '',
  isStreaming: false,
  error: null,

  // Chat actions
  fetchChats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await aiService.getChats({ limit: 50 });
      set({ chats: response.chats || [], loading: false });
    } catch (error) {
      set({ chats: [], error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createChat: async (title?: string) => {
    set({ loading: true, error: null });
    try {
      const chat = await aiService.createChat({ title });
      set((state) => ({
        chats: [chat, ...state.chats],
        currentChat: chat,
        messages: [],
        loading: false,
      }));
      return chat;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  selectChat: async (chatId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await aiService.getChat(chatId);
      set({
        currentChat: response.chat,
        messages: response.messages,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteChat: async (chatId: string) => {
    try {
      await aiService.deleteChat(chatId);
      const { currentChat } = get();
      set((state) => ({
        chats: state.chats.filter((c) => c.id !== chatId),
        currentChat: currentChat?.id === chatId ? null : currentChat,
        messages: currentChat?.id === chatId ? [] : state.messages,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  archiveChat: async (chatId: string) => {
    try {
      await aiService.archiveChat(chatId);
      set((state) => ({
        chats: state.chats.map((c) =>
          c.id === chatId ? { ...c, isArchived: true } : c
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  // Message actions
  sendMessage: async (content: string, documentIds?: string[], caseIds?: string[]) => {
    const { currentChat } = get();
    if (!currentChat) {
      throw new Error(i18nService.t('COMMON.ERRORS.NO_CHAT_SELECTED'));
    }

    // Add user message optimistically
    const userMessage: MessageInterface = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      sendingMessage: true,
      error: null,
    }));

    try {
      const response = await aiService.sendMessage(currentChat.id, {
        content,
        documentIds,
        caseIds,
      });

      // Replace temp message with real one and add AI response
      set((state) => ({
        messages: [
          ...state.messages.filter((m) => m.id !== userMessage.id),
          { ...userMessage, id: `user-${Date.now()}` },
          response,
        ],
        sendingMessage: false,
      }));
    } catch (error) {
      // Remove optimistic message on error
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== userMessage.id),
        sendingMessage: false,
        error: (error as Error).message,
      }));
      throw error;
    }
  },

  sendMessageStreaming: async (content: string, documentIds?: string[], caseIds?: string[]) => {
    const { currentChat } = get();
    if (!currentChat) {
      throw new Error(i18nService.t('COMMON.ERRORS.NO_CHAT_SELECTED'));
    }

    // Add user message optimistically
    const userMessage: MessageInterface = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    // Add placeholder for AI response
    const aiMessageId = `ai-${Date.now()}`;

    set((state) => ({
      messages: [
        ...state.messages,
        userMessage,
        {
          id: aiMessageId,
          role: 'assistant' as const,
          content: '',
          createdAt: new Date().toISOString(),
        },
      ],
      isStreaming: true,
      streamingMessage: '',
      error: null,
    }));

    try {
      await aiService.streamMessage(
        currentChat.id,
        { content, documentIds, caseIds },
        // onChunk
        (chunk: string) => {
          set((state) => {
            const newStreamingMessage = state.streamingMessage + chunk;
            return {
              streamingMessage: newStreamingMessage,
              messages: state.messages.map((m) =>
                m.id === aiMessageId ? { ...m, content: newStreamingMessage } : m
              ),
            };
          });
        },
        // onDone
        () => {
          set({ isStreaming: false, streamingMessage: '' });
        },
        // onError
        (error: string) => {
          set((state) => ({
            isStreaming: false,
            streamingMessage: '',
            error,
            messages: state.messages.filter((m) => m.id !== aiMessageId),
          }));
        }
      );
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== userMessage.id && m.id !== aiMessageId),
        isStreaming: false,
        streamingMessage: '',
        error: (error as Error).message,
      }));
      throw error;
    }
  },

  quickChat: async (message: string) => {
    set({ sendingMessage: true, error: null });
    try {
      const response = await aiService.quickChat({ message });
      set({ sendingMessage: false });
      return response;
    } catch (error) {
      set({ sendingMessage: false, error: (error as Error).message });
      throw error;
    }
  },

  // Document analysis
  analyzeDocument: async (documentId: string, analysisType) => {
    set({ loading: true, error: null });
    try {
      const response = await aiService.analyzeDocument(documentId, { analysisType });
      set({ loading: false });
      return response;
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      throw error;
    }
  },

  // Token actions
  fetchTokenBalance: async () => {
    try {
      const balance = await aiService.getTokenBalance();
      set({ tokenBalance: balance });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  purchaseTokens: async (packType: 'starter' | 'standard' | 'large') => {
    set({ loading: true, error: null });
    try {
      const response = await aiService.purchaseTokens(packType);
      set({ loading: false });
      return response.checkoutUrl;
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      throw error;
    }
  },

  // Insights actions
  fetchInsights: async () => {
    try {
      const response = await aiService.getInsights();
      set({ insights: response.insights || [] });
    } catch (error) {
      // Don't show error for insights - they are optional
      set({ insights: [] });
    }
  },

  // Clear actions
  clearChat: () => {
    set({ currentChat: null, messages: [] });
  },

  clearError: () => {
    set({ error: null });
  },
}));
