import { httpClient } from '../../interceptors/http.interceptor';
import type {
  TaskTemplate,
  CreateTaskTemplateRequest,
  UpdateTaskTemplateRequest,
  CategoryTemplateCount,
  TaskTemplateListResponse,
} from '../../types/taskTemplates/taskTemplates.interfaces';

export const taskTemplatesService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<TaskTemplateListResponse> => {
    const cleanParams: Record<string, string | number> = {};

    if (params?.page !== undefined) cleanParams.page = params.page;
    if (params?.limit !== undefined) cleanParams.limit = params.limit;
    if (params?.category && params.category !== 'all') cleanParams.category = params.category;

    const response = await httpClient.get<TaskTemplateListResponse>('/task-templates', {
      params: cleanParams,
    });
    return response.data;
  },

  getById: async (id: string): Promise<TaskTemplate> => {
    const response = await httpClient.get<TaskTemplate>(`/task-templates/${id}`);
    return response.data;
  },

  create: async (data: CreateTaskTemplateRequest): Promise<TaskTemplate> => {
    const response = await httpClient.post<TaskTemplate>('/task-templates', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTaskTemplateRequest): Promise<TaskTemplate> => {
    const response = await httpClient.put<TaskTemplate>(`/task-templates/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/task-templates/${id}`);
  },

  applyToCase: async (templateId: string, caseId: string): Promise<void> => {
    await httpClient.post(`/task-templates/${templateId}/apply/${caseId}`);
  },

  getCategories: async (): Promise<CategoryTemplateCount[]> => {
    const response = await httpClient.get<CategoryTemplateCount[]>('/task-templates/categories');
    return response.data;
  },
};
