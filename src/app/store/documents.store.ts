import { create } from 'zustand';
import { documentsService } from '../services/documents/documents.service';
import type { Pagination } from '../types/api/api.types';
import type {
  DocumentInterface,
  CreateDocumentInterface,
  UpdateDocumentInterface,
  DocumentVersionInterface,
  CreateDocumentVersionInterface,
  CompareVersionsResponse,
} from '../types/documents/documents.interfaces';

interface DocumentsState {
  documents: DocumentInterface[];
  selectedDocument: DocumentInterface | null;
  versions: DocumentVersionInterface[];
  comparisonData: CompareVersionsResponse | null;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  fetchDocuments: (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    search?: string;
    category?: string;
    caseId?: string;
    clientId?: string;
  }) => Promise<void>;
  fetchDocumentById: (id: string) => Promise<void>;
  createDocument: (data: CreateDocumentInterface) => Promise<void>;
  updateDocument: (id: string, data: UpdateDocumentInterface) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  createVersion: (documentId: string, data: CreateDocumentVersionInterface) => Promise<void>;
  fetchVersions: (documentId: string) => Promise<void>;
  compareVersions: (documentId: string, version1Id: string, version2Id: string) => Promise<void>;
  selectDocument: (document: DocumentInterface | null) => void;
}

export const useDocumentsStore = create<DocumentsState>((set, get) => ({
  documents: [],
  selectedDocument: null,
  versions: [],
  comparisonData: null,
  pagination: {
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  },
  loading: false,
  error: null,

  fetchDocuments: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await documentsService.list(params);
      set({
        documents: response.documents,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchDocumentById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const document = await documentsService.getById(id);
      set({ selectedDocument: document, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createDocument: async (data: CreateDocumentInterface) => {
    set({ loading: true, error: null });
    try {
      await documentsService.create(data);
      await get().fetchDocuments();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateDocument: async (id: string, data: UpdateDocumentInterface) => {
    set({ loading: true, error: null });
    try {
      const updated = await documentsService.update(id, data);
      set((state) => ({
        documents: state.documents.map((d) => (d.id === id ? updated : d)),
        selectedDocument: state.selectedDocument?.id === id ? updated : state.selectedDocument,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteDocument: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await documentsService.delete(id);
      await get().fetchDocuments();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createVersion: async (documentId: string, data: CreateDocumentVersionInterface) => {
    set({ loading: true, error: null });
    try {
      await documentsService.createVersion(documentId, data);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchVersions: async (documentId: string) => {
    set({ loading: true, error: null });
    try {
      const versions = await documentsService.getVersions(documentId);
      set({
        versions: versions,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  compareVersions: async (documentId: string, version1Id: string, version2Id: string) => {
    set({ loading: true, error: null });
    try {
      const comparisonData = await documentsService.compareVersions(
        documentId,
        version1Id,
        version2Id
      );
      set({ comparisonData, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  selectDocument: (document: DocumentInterface | null) => {
    set({ selectedDocument: document });
  },
}));
