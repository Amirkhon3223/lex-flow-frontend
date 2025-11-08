import { create } from 'zustand';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  caseId?: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  createdAt: string;
}

interface DocumentsState {
  documents: Document[];
  selectedDocument: Document | null;
  versions: DocumentVersion[];
  loading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (data: FormData) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  fetchVersions: (documentId: string) => Promise<void>;
  selectDocument: (document: Document | null) => void;
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
  documents: [],
  selectedDocument: null,
  versions: [],
  loading: false,
  error: null,

  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      set({ documents: [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  uploadDocument: async (_data) => {
    set({ loading: true, error: null });
    try {
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteDocument: async (id) => {
    set({ loading: true, error: null });
    try {
      set((state) => ({
        documents: state.documents.filter((d) => d.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchVersions: async (_documentId) => {
    set({ loading: true, error: null });
    try {
      set({ versions: [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  selectDocument: (document) => {
    set({ selectedDocument: document });
  },
}));
