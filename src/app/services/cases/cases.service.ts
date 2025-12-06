import { httpClient } from '../../interceptors/http.interceptor';
import type {
  CaseInterface,
  CreateCaseInterface,
  UpdateCaseInterface,
  CaseListResponse,
  TimelineEventInterface,
  CreateTimelineEventInterface,
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
    const cleanParams = params ? Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== '' && value !== 'all')
    ) : {};
    const response = await httpClient.get<CaseListResponse>('/cases', { params: cleanParams });
    return response.data;
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
    const response = await httpClient.post<TimelineEventInterface>(
      `/cases/${id}/timeline`,
      data
    );
    return response.data;
  },
};
