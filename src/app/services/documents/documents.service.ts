import { httpClient } from '../../interceptors/http.interceptor';
import type {
  DocumentInterface,
  CreateDocumentInterface,
  UpdateDocumentInterface,
  DocumentListResponse,
  UploadDocumentResponse,
  DocumentVersionInterface,
  CreateDocumentVersionInterface,
  DocumentVersionListResponse,
} from '../../types/documents/documents.interfaces';

export const documentsService = {
  upload: async (file: File): Promise<UploadDocumentResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await httpClient.post<UploadDocumentResponse>('/documents/file-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    type?: string;
    caseId?: string;
    clientId?: string;
    search?: string;
  }): Promise<DocumentListResponse> => {
    const response = await httpClient.get<DocumentListResponse>('/documents', { params });
    return response.data;
  },

  getById: async (id: string): Promise<DocumentInterface> => {
    const response = await httpClient.get<DocumentInterface>(`/documents/${id}`);
    return response.data;
  },

  create: async (data: CreateDocumentInterface): Promise<DocumentInterface> => {
    const response = await httpClient.post<DocumentInterface>('/documents', data);
    return response.data;
  },

  update: async (id: string, data: UpdateDocumentInterface): Promise<DocumentInterface> => {
    const response = await httpClient.put<DocumentInterface>(`/documents/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/documents/${id}`);
  },

  download: async (id: string): Promise<Blob> => {
    const response = await httpClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getVersions: async (id: string): Promise<DocumentVersionInterface[]> => {
    const response = await httpClient.get<DocumentVersionInterface[]>(
      `/documents/${id}/file-versions`
    );
    return response.data;
  },

  createVersion: async (
    id: string,
    data: CreateDocumentVersionInterface
  ): Promise<DocumentVersionInterface> => {
    const response = await httpClient.post<DocumentVersionInterface>(
      `/documents/${id}/file-versions`,
      data
    );
    return response.data;
  },

  getVersion: async (id: string, versionId: string): Promise<DocumentVersionInterface> => {
    const response = await httpClient.get<DocumentVersionInterface>(
      `/documents/${id}/file-versions/${versionId}`
    );
    return response.data;
  },

  downloadVersion: async (id: string, versionId: string): Promise<Blob> => {
    const response = await httpClient.get(`/documents/${id}/file-versions/${versionId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
