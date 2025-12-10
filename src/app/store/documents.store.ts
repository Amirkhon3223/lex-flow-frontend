import { create } from 'zustand';
import { documentsService } from '../services/documents/documents.service';
import type {
  DocumentInterface,
  CreateDocumentInterface,
  UpdateDocumentInterface,
  DocumentVersionInterface,
} from '../types/documents/documents.interfaces';

interface DocumentsState {
  documents: DocumentInterface[];
  selectedDocument: DocumentInterface | null;
  versions: DocumentVersionInterface[];
  loading: boolean;
  error: string | null;
  fetchDocuments: (params?: { page?: number; limit?: number; caseId?: string }) => Promise<void>;
  fetchDocumentById: (id: string) => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  createDocument: (data: CreateDocumentInterface) => Promise<void>;
  updateDocument: (id: string, data: UpdateDocumentInterface) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  fetchVersions: (documentId: string) => Promise<void>;
  selectDocument: (document: DocumentInterface | null) => void;
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
  documents: [],
  selectedDocument: null,
  versions: [],
  loading: false,
  error: null,

  fetchDocuments: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await documentsService.list(params);
      set({ documents: response.documents, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchDocumentById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const document = await documentsService.getById(id);
      set({ selectedDocument: document, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  uploadDocument: async (file: File) => {
    set({ loading: true, error: null });
    try {
      await documentsService.upload(file);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createDocument: async (data: CreateDocumentInterface) => {
    set({ loading: true, error: null });
    try {
      const document = await documentsService.create(data);
      set((state) => ({
        documents: [...state.documents, document],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
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
    }
  },

  deleteDocument: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await documentsService.delete(id);
      set((state) => ({
        documents: state.documents.filter((d) => d.id !== id),
        selectedDocument: state.selectedDocument?.id === id ? null : state.selectedDocument,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchVersions: async (documentId: string) => {
    set({ loading: true, error: null });
    try {
      const versions = await documentsService.getVersions(documentId);
      set({ versions, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  selectDocument: (document: DocumentInterface | null) => {
    set({ selectedDocument: document });
  },
}));
