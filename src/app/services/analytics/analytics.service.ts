import { httpClient } from '../../interceptors/http.interceptor';
import type {
  DashboardStatsResponse,
  CaseAnalyticsResponse,
  ClientAnalyticsResponse,
  DocumentAnalyticsResponse,
  MeetingAnalyticsResponse,
  FinanceAnalyticsResponse,
  TeamAnalyticsResponse,
} from '../../types/analytics/analytics.interfaces';

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const res = await httpClient.get('/analytics/dashboard');
    return res.data;
  },

  getCasesAnalytics: async (): Promise<CaseAnalyticsResponse> => {
    const res = await httpClient.get('/analytics/cases');
    return res.data;
  },

  getClientsAnalytics: async (): Promise<ClientAnalyticsResponse> => {
    const res = await httpClient.get('/analytics/clients');
    return res.data;
  },

  getDocumentsAnalytics: async (): Promise<DocumentAnalyticsResponse> => {
    const res = await httpClient.get('/analytics/documents');
    return res.data;
  },

  getMeetingsAnalytics: async (): Promise<MeetingAnalyticsResponse> => {
    const res = await httpClient.get('/analytics/meetings');
    return res.data;
  },

  getFinanceAnalytics: async (): Promise<FinanceAnalyticsResponse> => {
    const res = await httpClient.get('/analytics/finance');
    return res.data;
  },

  getTeamAnalytics: async (): Promise<TeamAnalyticsResponse> => {
    const res = await httpClient.get('/analytics/team');
    return res.data;
  },
};
