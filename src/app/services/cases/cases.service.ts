import { httpClient } from '../../interceptors/http.interceptor';
import type {
  CaseInterface,
  CreateCaseInterface,
  UpdateCaseInterface,
  CaseListResponse,
  TimelineEventInterface,
  CreateTimelineEventInterface,
  CommentInterface,
  CaseTaskInterface,
} from '../../types/cases/cases.interfaces';

export const casesService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    clientId?: string;
    search?: string;
  }): Promise<CaseListResponse> => {
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(
            ([_, value]) => value !== undefined && value !== '' && value !== 'all'
          )
        )
      : {};
    const response = await httpClient.get<{
      cases: CaseInterface[];
      pagination: {
        page: number;
        limit: number;
        totalItems?: number;
        total?: number;
        totalPages: number;
      };
    }>('/cases', { params: cleanParams });

    // Маппинг ответа API к нашему типу
    return {
      cases: response.data.cases,
      pagination: {
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.pagination.totalItems ?? response.data.pagination.total ?? 0,
        totalPages: response.data.pagination.totalPages,
      },
    };
  },

  getById: async (id: string): Promise<CaseInterface> => {
    const response = await httpClient.get<CaseInterface>(`/cases/${id}`);
    return response.data;
  },

  create: async (data: CreateCaseInterface): Promise<CaseInterface> => {
    const response = await httpClient.post<CaseInterface>('/cases', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCaseInterface): Promise<CaseInterface> => {
    const response = await httpClient.put<CaseInterface>(`/cases/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/cases/${id}`);
  },

  getTimeline: async (id: string): Promise<TimelineEventInterface[]> => {
    const response = await httpClient.get<TimelineEventInterface[]>(`/cases/${id}/timeline`);
    return response.data;
  },

  addTimelineEvent: async (
    id: string,
    data: CreateTimelineEventInterface
  ): Promise<TimelineEventInterface> => {
    const response = await httpClient.post<TimelineEventInterface>(`/cases/${id}/timeline`, data);
    return response.data;
  },

  // Comments API Methods
  getComments: async (caseId: string): Promise<CommentInterface[]> => {
    const response = await httpClient.get<CommentInterface[]>(`/cases/${caseId}/comments`);
    return response.data;
  },

  addComment: async (caseId: string, content: string): Promise<CommentInterface> => {
    const response = await httpClient.post<CommentInterface>(`/cases/${caseId}/comments`, {
      content,
    });
    return response.data;
  },

  updateComment: async (
    caseId: string,
    commentId: string,
    content: string
  ): Promise<CommentInterface> => {
    const response = await httpClient.put<CommentInterface>(
      `/cases/${caseId}/comments/${commentId}`,
      { content }
    );
    return response.data;
  },

  deleteComment: async (caseId: string, commentId: string): Promise<void> => {
    await httpClient.delete(`/cases/${caseId}/comments/${commentId}`);
  },

  // Tasks API Methods
  getTasks: async (caseId: string): Promise<CaseTaskInterface[]> => {
    const response = await httpClient.get<CaseTaskInterface[]>(`/cases/${caseId}/tasks`);
    return response.data;
  },

  addTask: async (caseId: string, title: string): Promise<CaseTaskInterface> => {
    const response = await httpClient.post<CaseTaskInterface>(`/cases/${caseId}/tasks`, {
      title,
      completed: false,
    });
    return response.data;
  },

  updateTask: async (
    caseId: string,
    taskId: string,
    data: { title?: string; completed?: boolean }
  ): Promise<CaseTaskInterface> => {
    const response = await httpClient.put<CaseTaskInterface>(
      `/cases/${caseId}/tasks/${taskId}`,
      data
    );
    return response.data;
  },

  deleteTask: async (caseId: string, taskId: string): Promise<void> => {
    await httpClient.delete(`/cases/${caseId}/tasks/${taskId}`);
  },
};
