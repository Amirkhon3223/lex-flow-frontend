import { create } from 'zustand';
import { analyticsService } from '../services/analytics/analytics.service';
import type {
  DashboardStatsResponse,
  CaseAnalyticsResponse,
  ClientAnalyticsResponse,
  DocumentAnalyticsResponse,
  MeetingAnalyticsResponse,
} from '../types/analytics/analytics.interfaces';

interface AnalyticsState {
  dashboardStats: DashboardStatsResponse | null;
  casesAnalytics: CaseAnalyticsResponse | null;
  clientsAnalytics: ClientAnalyticsResponse | null;
  documentsAnalytics: DocumentAnalyticsResponse | null;
  meetingsAnalytics: MeetingAnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  fetchDashboardStats: () => Promise<void>;
  fetchCasesAnalytics: () => Promise<void>;
  fetchClientsAnalytics: () => Promise<void>;
  fetchDocumentsAnalytics: () => Promise<void>;
  fetchMeetingsAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  dashboardStats: null,
  casesAnalytics: null,
  clientsAnalytics: null,
  documentsAnalytics: null,
  meetingsAnalytics: null,
  loading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      const dashboardStats = await analyticsService.getDashboardStats();
      set({ dashboardStats, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchCasesAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const casesAnalytics = await analyticsService.getCasesAnalytics();
      set({ casesAnalytics, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchClientsAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const clientsAnalytics = await analyticsService.getClientsAnalytics();
      set({ clientsAnalytics, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchDocumentsAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const documentsAnalytics = await analyticsService.getDocumentsAnalytics();
      set({ documentsAnalytics, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchMeetingsAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const meetingsAnalytics = await analyticsService.getMeetingsAnalytics();
      set({ meetingsAnalytics, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
