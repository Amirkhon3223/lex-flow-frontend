import { create } from 'zustand';
import { analyticsService } from '../services/analytics/analytics.service';
import type {
  DashboardStatsResponse,
  CaseAnalyticsResponse,
  ClientAnalyticsResponse,
  DocumentAnalyticsResponse,
  MeetingAnalyticsResponse,
  FinanceAnalyticsResponse,
  TeamAnalyticsResponse,
} from '../types/analytics/analytics.interfaces';

interface AnalyticsState {
  dashboard: DashboardStatsResponse | null;
  dashboardLoading: boolean;
  dashboardError: string | null;

  cases: CaseAnalyticsResponse | null;
  casesLoading: boolean;
  casesError: string | null;
  clients: ClientAnalyticsResponse | null;
  clientsLoading: boolean;
  clientsError: string | null;

  documents: DocumentAnalyticsResponse | null;
  documentsLoading: boolean;
  documentsError: string | null;

  meetings: MeetingAnalyticsResponse | null;
  meetingsLoading: boolean;
  meetingsError: string | null;

  finance: FinanceAnalyticsResponse | null;
  financeLoading: boolean;
  financeError: string | null;

  team: TeamAnalyticsResponse | null;
  teamLoading: boolean;
  teamError: string | null;

  fetchDashboard: () => Promise<void>;
  fetchCases: () => Promise<void>;
  fetchClients: () => Promise<void>;
  fetchDocuments: () => Promise<void>;
  fetchMeetings: () => Promise<void>;
  fetchFinance: () => Promise<void>;
  fetchTeam: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  dashboard: null,
  dashboardLoading: false,
  dashboardError: null,

  cases: null,
  casesLoading: false,
  casesError: null,
  clients: null,
  clientsLoading: false,
  clientsError: null,

  documents: null,
  documentsLoading: false,
  documentsError: null,

  meetings: null,
  meetingsLoading: false,
  meetingsError: null,

  finance: null,
  financeLoading: false,
  financeError: null,

  team: null,
  teamLoading: false,
  teamError: null,

  fetchDashboard: async () => {
    set({ dashboardLoading: true, dashboardError: null });
    try {
      const data = await analyticsService.getDashboardStats();
      set({ dashboard: data, dashboardLoading: false });
    } catch (err) {
      set({
        dashboardError: (err as Error).message,
        dashboardLoading: false,
      });
    }
  },

  fetchCases: async () => {
    set({ casesLoading: true, casesError: null });
    try {
      const data = await analyticsService.getCasesAnalytics();
      set({ cases: data, casesLoading: false });
    } catch (err) {
      set({
        casesError: (err as Error).message,
        casesLoading: false,
      });
    }
  },

  fetchClients: async () => {
    set({ clientsLoading: true, clientsError: null });
    try {
      const data = await analyticsService.getClientsAnalytics();
      set({ clients: data, clientsLoading: false });
    } catch (err) {
      set({
        clientsError: (err as Error).message,
        clientsLoading: false,
      });
    }
  },

  fetchDocuments: async () => {
    set({ documentsLoading: true, documentsError: null });
    try {
      const data = await analyticsService.getDocumentsAnalytics();
      set({ documents: data, documentsLoading: false });
    } catch (err) {
      set({
        documentsError: (err as Error).message,
        documentsLoading: false,
      });
    }
  },

  fetchMeetings: async () => {
    set({ meetingsLoading: true, meetingsError: null });
    try {
      const data = await analyticsService.getMeetingsAnalytics();
      set({ meetings: data, meetingsLoading: false });
    } catch (err) {
      set({
        meetingsError: (err as Error).message,
        meetingsLoading: false,
      });
    }
  },

  fetchFinance: async () => {
    set({ financeLoading: true, financeError: null });
    try {
      const data = await analyticsService.getFinanceAnalytics();
      set({ finance: data, financeLoading: false });
    } catch (err) {
      set({
        financeError: (err as Error).message,
        financeLoading: false,
      });
    }
  },

  fetchTeam: async () => {
    set({ teamLoading: true, teamError: null });
    try {
      const data = await analyticsService.getTeamAnalytics();
      set({ team: data, teamLoading: false });
    } catch (err) {
      set({
        teamError: (err as Error).message,
        teamLoading: false,
      });
    }
  },
}));
