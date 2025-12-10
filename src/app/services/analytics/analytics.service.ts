import { httpClient } from '../../interceptors/http.interceptor';
import type {
  DashboardStatsResponse,
  CaseAnalyticsResponse,
  ClientAnalyticsResponse,
  DocumentAnalyticsResponse,
  MeetingAnalyticsResponse,
} from '../../types/analytics/analytics.interfaces';

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const response = await httpClient.get<DashboardStatsResponse>('/analytics/dashboard');
    return response.data;
  },

  getCasesAnalytics: async (): Promise<CaseAnalyticsResponse> => {
    const response = await httpClient.get<CaseAnalyticsResponse>('/analytics/cases');
    return response.data;
  },

  getClientsAnalytics: async (): Promise<ClientAnalyticsResponse> => {
    const response = await httpClient.get<ClientAnalyticsResponse>('/analytics/clients');
    return response.data;
  },

  getDocumentsAnalytics: async (): Promise<DocumentAnalyticsResponse> => {
    const response = await httpClient.get<DocumentAnalyticsResponse>('/analytics/documents');
    return response.data;
  },

  getMeetingsAnalytics: async (): Promise<MeetingAnalyticsResponse> => {
    const response = await httpClient.get<MeetingAnalyticsResponse>('/analytics/meetings');
    return response.data;
  },
};
