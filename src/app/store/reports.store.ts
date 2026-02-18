import { create } from 'zustand';
import { reportsService } from '../services/reports/reports.service';
import type {
  ReportType,
  ExportFormat,
  CaseProfitabilityResponse,
  TimeBillingResponse,
  DeadlineComplianceResponse,
  ClientRevenueResponse,
  WorkloadResponse,
} from '../types/reports/reports.interfaces';

interface ReportsState {
  activeReport: ReportType | null;
  startDate: string;
  endDate: string;

  profitability: CaseProfitabilityResponse | null;
  profitabilityLoading: boolean;
  profitabilityError: string | null;

  timeBilling: TimeBillingResponse | null;
  timeBillingLoading: boolean;
  timeBillingError: string | null;

  deadlineCompliance: DeadlineComplianceResponse | null;
  deadlineComplianceLoading: boolean;
  deadlineComplianceError: string | null;

  clientRevenue: ClientRevenueResponse | null;
  clientRevenueLoading: boolean;
  clientRevenueError: string | null;

  workload: WorkloadResponse | null;
  workloadLoading: boolean;
  workloadError: string | null;

  setDateRange: (startDate: string, endDate: string) => void;
  setActiveReport: (report: ReportType | null) => void;
  fetchProfitability: () => Promise<void>;
  fetchTimeBilling: () => Promise<void>;
  fetchDeadlineCompliance: () => Promise<void>;
  fetchClientRevenue: () => Promise<void>;
  fetchWorkload: () => Promise<void>;
  exportReport: (format: ExportFormat) => Promise<void>;
}

const getDefaultDateRange = (): { startDate: string; endDate: string } => {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  const start = new Date(now);
  start.setDate(start.getDate() - 30);
  const startDate = start.toISOString().split('T')[0];
  return { startDate, endDate };
};

const defaults = getDefaultDateRange();

export const useReportsStore = create<ReportsState>((set, get) => ({
  activeReport: null,
  startDate: defaults.startDate,
  endDate: defaults.endDate,

  profitability: null,
  profitabilityLoading: false,
  profitabilityError: null,

  timeBilling: null,
  timeBillingLoading: false,
  timeBillingError: null,

  deadlineCompliance: null,
  deadlineComplianceLoading: false,
  deadlineComplianceError: null,

  clientRevenue: null,
  clientRevenueLoading: false,
  clientRevenueError: null,

  workload: null,
  workloadLoading: false,
  workloadError: null,

  setDateRange: (startDate: string, endDate: string) => {
    set({ startDate, endDate });
  },

  setActiveReport: (report: ReportType | null) => {
    set({ activeReport: report });
  },

  fetchProfitability: async () => {
    const { startDate, endDate } = get();
    set({ profitabilityLoading: true, profitabilityError: null });
    try {
      const data = await reportsService.getCaseProfitability(startDate, endDate);
      set({ profitability: data, profitabilityLoading: false });
    } catch (err) {
      set({
        profitabilityError: (err as Error).message,
        profitabilityLoading: false,
      });
    }
  },

  fetchTimeBilling: async () => {
    const { startDate, endDate } = get();
    set({ timeBillingLoading: true, timeBillingError: null });
    try {
      const data = await reportsService.getTimeBilling(startDate, endDate);
      set({ timeBilling: data, timeBillingLoading: false });
    } catch (err) {
      set({
        timeBillingError: (err as Error).message,
        timeBillingLoading: false,
      });
    }
  },

  fetchDeadlineCompliance: async () => {
    const { startDate, endDate } = get();
    set({ deadlineComplianceLoading: true, deadlineComplianceError: null });
    try {
      const data = await reportsService.getDeadlineCompliance(startDate, endDate);
      set({ deadlineCompliance: data, deadlineComplianceLoading: false });
    } catch (err) {
      set({
        deadlineComplianceError: (err as Error).message,
        deadlineComplianceLoading: false,
      });
    }
  },

  fetchClientRevenue: async () => {
    const { startDate, endDate } = get();
    set({ clientRevenueLoading: true, clientRevenueError: null });
    try {
      const data = await reportsService.getClientRevenue(startDate, endDate);
      set({ clientRevenue: data, clientRevenueLoading: false });
    } catch (err) {
      set({
        clientRevenueError: (err as Error).message,
        clientRevenueLoading: false,
      });
    }
  },

  fetchWorkload: async () => {
    const { startDate, endDate } = get();
    set({ workloadLoading: true, workloadError: null });
    try {
      const data = await reportsService.getWorkload(startDate, endDate);
      set({ workload: data, workloadLoading: false });
    } catch (err) {
      set({
        workloadError: (err as Error).message,
        workloadLoading: false,
      });
    }
  },

  exportReport: async (format: ExportFormat) => {
    const { activeReport, startDate, endDate } = get();
    if (!activeReport) return;

    try {
      const blob = await reportsService.exportReport(activeReport, format, startDate, endDate);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${activeReport}-${startDate}-${endDate}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // error handled silently
    }
  },
}));
