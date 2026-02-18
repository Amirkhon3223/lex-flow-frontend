/**
 * @file templates.store.ts
 * @description Zustand store for Document Templates feature
 */

import { create } from 'zustand';
import { templatesService } from '../services/templates/templates.service';
import type {
  DocumentTemplate,
  GeneratedDocument,
  CreateTemplateInterface,
  UpdateTemplateInterface,
  GenerateDocumentInterface,
  AvailableVariablesResponse,
  TemplateVariable,
} from '../types/templates/templates.types';

interface TemplatesState {
  templates: DocumentTemplate[];
  selectedTemplate: DocumentTemplate | null;
  generatedDocuments: GeneratedDocument[];
  availableVariables: AvailableVariablesResponse | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  generatedPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchTemplates: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
  }) => Promise<void>;
  fetchTemplateById: (id: string) => Promise<void>;
  createTemplate: (data: CreateTemplateInterface) => Promise<DocumentTemplate>;
  updateTemplate: (id: string, data: UpdateTemplateInterface) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  selectTemplate: (template: DocumentTemplate | null) => void;

  generateDocument: (data: GenerateDocumentInterface) => Promise<GeneratedDocument>;
  fetchGeneratedDocuments: (params?: {
    page?: number;
    limit?: number;
    templateId?: string;
    clientId?: string;
    caseId?: string;
    search?: string;
  }) => Promise<void>;
  downloadGeneratedDocument: (id: string, fileName: string) => Promise<void>;
  deleteGeneratedDocument: (id: string) => Promise<void>;

  fetchAvailableVariables: () => Promise<void>;
  getAllVariables: () => TemplateVariable[];

  clearError: () => void;
  reset: () => void;
}

const initialPagination = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
};

export const useTemplatesStore = create<TemplatesState>((set, get) => ({
  templates: [],
  selectedTemplate: null,
  generatedDocuments: [],
  availableVariables: null,
  loading: false,
  generating: false,
  error: null,
  pagination: { ...initialPagination },
  generatedPagination: { ...initialPagination },

  fetchTemplates: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await templatesService.list(params);
      set({
        templates: response.data,
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchTemplateById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const template = await templatesService.getById(id);
      set({ selectedTemplate: template, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createTemplate: async (data: CreateTemplateInterface) => {
    set({ loading: true, error: null });
    try {
      const template = await templatesService.create(data);
      set((state) => ({
        templates: [template, ...state.templates],
        loading: false,
      }));
      return template;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateTemplate: async (id: string, data: UpdateTemplateInterface) => {
    set({ loading: true, error: null });
    try {
      const updatedTemplate = await templatesService.update(id, data);
      set((state) => ({
        templates: state.templates.map((t) => (t.id === id ? updatedTemplate : t)),
        selectedTemplate: state.selectedTemplate?.id === id ? updatedTemplate : state.selectedTemplate,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteTemplate: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await templatesService.delete(id);
      set((state) => ({
        templates: state.templates.filter((t) => t.id !== id),
        selectedTemplate: state.selectedTemplate?.id === id ? null : state.selectedTemplate,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  selectTemplate: (template: DocumentTemplate | null) => {
    set({ selectedTemplate: template });
  },

  generateDocument: async (data: GenerateDocumentInterface) => {
    set({ generating: true, error: null });
    try {
      const generatedDocument = await templatesService.generateDocument(data);
      set((state) => ({
        generatedDocuments: [generatedDocument, ...state.generatedDocuments],
        generating: false,
      }));
      return generatedDocument;
    } catch (error) {
      set({ error: (error as Error).message, generating: false });
      throw error;
    }
  },

  fetchGeneratedDocuments: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await templatesService.listGeneratedDocuments(params);
      set({
        generatedDocuments: response.data,
        generatedPagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  downloadGeneratedDocument: async (id: string, fileName: string) => {
    try {
      const blob = await templatesService.downloadGeneratedDocument(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteGeneratedDocument: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await templatesService.deleteGeneratedDocument(id);
      set((state) => ({
        generatedDocuments: state.generatedDocuments.filter((d) => d.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchAvailableVariables: async () => {
    try {
      const variables = await templatesService.getAvailableVariables();
      set({ availableVariables: variables });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  getAllVariables: () => {
    const { availableVariables } = get();
    if (!availableVariables) return [];
    return [
      ...availableVariables.client,
      ...availableVariables.case,
      ...availableVariables.user,
      ...availableVariables.custom,
    ];
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      templates: [],
      selectedTemplate: null,
      generatedDocuments: [],
      loading: false,
      generating: false,
      error: null,
      pagination: { ...initialPagination },
      generatedPagination: { ...initialPagination },
    });
  },
}));
