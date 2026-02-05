import { httpClient } from '@/app/interceptors/http.interceptor';

export interface SearchResultItem {
  id: string;
  type: 'client' | 'case' | 'document' | 'meeting' | 'chat';
  title: string;
  subtitle?: string;
  status?: string;
  createdAt?: string;
}

export interface GlobalSearchResponse {
  query: string;
  clients: SearchResultItem[];
  cases: SearchResultItem[];
  documents: SearchResultItem[];
  meetings: SearchResultItem[];
  chats: SearchResultItem[];
  counts: {
    clients: number;
    cases: number;
    documents: number;
    meetings: number;
    chats: number;
    total: number;
  };
}

export interface DocumentContentSearchResult {
  documentId: string;
  documentName: string;
  versionId: string;
  blockId: string;
  content: string;
  highlight: string;
  rank: number;
  caseId?: string;
  caseName?: string;
}

export interface DocumentContentSearchResponse {
  query: string;
  total: number;
  results: DocumentContentSearchResult[];
  limit: number;
  offset: number;
  hasMore: boolean;
}

export const searchService = {
  globalSearch: async (query: string, limit = 5): Promise<GlobalSearchResponse> => {
    const response = await httpClient.get<GlobalSearchResponse>('/search', {
      params: { q: query, limit },
    });
    return response.data;
  },

  searchDocumentContent: async (
    query: string,
    limit = 20,
    offset = 0
  ): Promise<DocumentContentSearchResponse> => {
    const response = await httpClient.get<DocumentContentSearchResponse>('/search/documents', {
      params: { q: query, limit, offset },
    });
    return response.data;
  },
};
