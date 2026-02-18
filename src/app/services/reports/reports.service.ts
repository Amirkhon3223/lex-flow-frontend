import { httpClient } from '../../interceptors/http.interceptor';
import type {
  CaseProfitabilityResponse,
  TimeBillingResponse,
  DeadlineComplianceResponse,
  ClientRevenueResponse,
  WorkloadResponse,
} from '../../types/reports/reports.interfaces';

export const reportsService = {
  getCaseProfitability: async (startDate: string, endDate: string): Promise<CaseProfitabilityResponse> => {
    const res = await httpClient.get('/reports/profitability', { params: { startDate, endDate } });
    return res.data;
  },

  getTimeBilling: async (startDate: string, endDate: string): Promise<TimeBillingResponse> => {
    const res = await httpClient.get('/reports/time-billing', { params: { startDate, endDate } });
    return res.data;
  },

  getDeadlineCompliance: async (startDate: string, endDate: string): Promise<DeadlineComplianceResponse> => {
    const res = await httpClient.get('/reports/deadline-compliance', { params: { startDate, endDate } });
    return res.data;
  },

  getClientRevenue: async (startDate: string, endDate: string): Promise<ClientRevenueResponse> => {
    const res = await httpClient.get('/reports/client-revenue', { params: { startDate, endDate } });
    return res.data;
  },

  getWorkload: async (startDate: string, endDate: string): Promise<WorkloadResponse> => {
    const res = await httpClient.get('/reports/workload', { params: { startDate, endDate } });
    return res.data;
  },

  exportReport: async (reportType: string, format: string, startDate: string, endDate: string): Promise<Blob> => {
    const res = await httpClient.get('/reports/export', {
      params: { reportType, format, startDate, endDate },
      responseType: 'blob',
    });
    return res.data;
  },
};
