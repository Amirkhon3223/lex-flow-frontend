/**
 * @file templates.service.ts
 * @description API service for Document Templates feature
 */

import { httpClient } from '../../interceptors/http.interceptor';
import type {
  DocumentTemplate,
  GeneratedDocument,
  CreateTemplateInterface,
  UpdateTemplateInterface,
  GenerateDocumentInterface,
  TemplatePreviewInterface,
  TemplateListResponse,
  GeneratedDocumentListResponse,
  AvailableVariablesResponse,
} from '../../types/templates/templates.types';

export const templatesService = {
  /**
   * List all templates with pagination and filters
   */
  list: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<TemplateListResponse> => {
    const cleanParams: Record<string, string | number> = {};

    if (params?.page !== undefined) cleanParams.page = params.page;
    if (params?.limit !== undefined) cleanParams.limit = params.limit;
    if (params?.category && params.category !== 'all') cleanParams.category = params.category;
    if (params?.status && params.status !== 'all') cleanParams.status = params.status;
    if (params?.search && params.search.trim()) cleanParams.search = params.search.trim();

    const response = await httpClient.get<TemplateListResponse>('/templates', { params: cleanParams });
    return response.data;
  },

  /**
   * Get a single template by ID
   */
  getById: async (id: string): Promise<DocumentTemplate> => {
    const response = await httpClient.get<DocumentTemplate>(`/templates/${id}`);
    return response.data;
  },

  /**
   * Create a new template
   */
  create: async (data: CreateTemplateInterface): Promise<DocumentTemplate> => {
    const response = await httpClient.post<DocumentTemplate>('/templates', data);
    return response.data;
  },

  /**
   * Update an existing template
   */
  update: async (id: string, data: UpdateTemplateInterface): Promise<DocumentTemplate> => {
    const response = await httpClient.put<DocumentTemplate>(`/templates/${id}`, data);
    return response.data;
  },

  /**
   * Delete a template
   */
  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/templates/${id}`);
  },

  /**
   * Generate a document from a template
   */
  generateDocument: async (data: GenerateDocumentInterface): Promise<GeneratedDocument> => {
    const response = await httpClient.post<GeneratedDocument>('/templates/generate', data);
    return response.data;
  },

  /**
   * Preview a template with sample data
   */
  previewTemplate: async (templateId: string, sampleData: Record<string, string>): Promise<TemplatePreviewInterface> => {
    const response = await httpClient.post<TemplatePreviewInterface>(`/templates/${templateId}/preview`, {
      variables: sampleData,
    });
    return response.data;
  },

  /**
   * Get all available variables for templates
   */
  getAvailableVariables: async (): Promise<AvailableVariablesResponse> => {
    const response = await httpClient.get<AvailableVariablesResponse>('/templates/variables');
    return response.data;
  },

  /**
   * List all generated documents
   */
  listGeneratedDocuments: async (params?: {
    page?: number;
    limit?: number;
    templateId?: string;
    clientId?: string;
    caseId?: string;
    search?: string;
  }): Promise<GeneratedDocumentListResponse> => {
    const cleanParams: Record<string, string | number> = {};

    if (params?.page !== undefined) cleanParams.page = params.page;
    if (params?.limit !== undefined) cleanParams.limit = params.limit;
    if (params?.templateId) cleanParams.templateId = params.templateId;
    if (params?.clientId) cleanParams.clientId = params.clientId;
    if (params?.caseId) cleanParams.caseId = params.caseId;
    if (params?.search && params.search.trim()) cleanParams.search = params.search.trim();

    const response = await httpClient.get<GeneratedDocumentListResponse>('/templates/generated', { params: cleanParams });
    return response.data;
  },

  /**
   * Get a single generated document by ID
   */
  getGeneratedDocument: async (id: string): Promise<GeneratedDocument> => {
    const response = await httpClient.get<GeneratedDocument>(`/templates/generated/${id}`);
    return response.data;
  },

  /**
   * Download a generated document
   */
  downloadGeneratedDocument: async (id: string): Promise<Blob> => {
    const response = await httpClient.get<Blob>(`/templates/generated/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Delete a generated document
   */
  deleteGeneratedDocument: async (id: string): Promise<void> => {
    await httpClient.delete(`/templates/generated/${id}`);
  },
};
