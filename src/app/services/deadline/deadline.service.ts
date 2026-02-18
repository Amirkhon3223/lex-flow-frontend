import { httpClient } from '@/app/interceptors/http.interceptor';
import type {
  CaseDeadline,
  CreateDeadlineRequest,
  UpdateDeadlineRequest,
  CalculateProceduralRequest,
  CalculateStatuteRequest,
  DeadlineRule,
  StatuteInfo,
} from '@/app/types/deadline/deadline.interfaces';

export const deadlineService = {
  getDeadlines: async (caseId: string): Promise<CaseDeadline[]> => {
    const response = await httpClient.get<CaseDeadline[]>(`/cases/${caseId}/deadlines`);
    return response.data;
  },

  getDeadline: async (caseId: string, deadlineId: string): Promise<CaseDeadline> => {
    const response = await httpClient.get<CaseDeadline>(
      `/cases/${caseId}/deadlines/${deadlineId}`
    );
    return response.data;
  },

  createDeadline: async (
    caseId: string,
    data: CreateDeadlineRequest
  ): Promise<CaseDeadline> => {
    const response = await httpClient.post<CaseDeadline>(
      `/cases/${caseId}/deadlines`,
      data
    );
    return response.data;
  },

  calculateProcedural: async (
    caseId: string,
    data: CalculateProceduralRequest
  ): Promise<CaseDeadline[]> => {
    const response = await httpClient.post<CaseDeadline[]>(
      `/cases/${caseId}/deadlines/calculate`,
      data
    );
    return response.data;
  },

  calculateStatute: async (
    caseId: string,
    data: CalculateStatuteRequest
  ): Promise<CaseDeadline> => {
    const response = await httpClient.post<CaseDeadline>(
      `/cases/${caseId}/deadlines/statute`,
      data
    );
    return response.data;
  },

  updateDeadline: async (
    caseId: string,
    deadlineId: string,
    data: UpdateDeadlineRequest
  ): Promise<CaseDeadline> => {
    const response = await httpClient.put<CaseDeadline>(
      `/cases/${caseId}/deadlines/${deadlineId}`,
      data
    );
    return response.data;
  },

  completeDeadline: async (caseId: string, deadlineId: string): Promise<CaseDeadline> => {
    const response = await httpClient.put<CaseDeadline>(
      `/cases/${caseId}/deadlines/${deadlineId}/complete`
    );
    return response.data;
  },

  deleteDeadline: async (caseId: string, deadlineId: string): Promise<void> => {
    await httpClient.delete(`/cases/${caseId}/deadlines/${deadlineId}`);
  },

  getProceduralRules: async (jurisdiction?: string): Promise<DeadlineRule[]> => {
    const params = jurisdiction ? { params: { jurisdiction } } : undefined;
    const response = await httpClient.get<DeadlineRule[]>('/deadline-rules', params);
    return response.data;
  },

  getStatuteInfo: async (jurisdiction: string, category: string): Promise<StatuteInfo> => {
    const response = await httpClient.get<StatuteInfo>(
      `/deadline-rules/statute?jurisdiction=${jurisdiction}&category=${category}`
    );
    return response.data;
  },
};
