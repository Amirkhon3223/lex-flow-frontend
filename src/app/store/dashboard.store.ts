import { create } from 'zustand';
import { dashboardService } from '../services/dashboard/dashboard.service';
import type { DashboardStatsResponse } from '../types/analytics/analytics.interfaces';
import type {
  PriorityCaseItem,
  TodayMeetingItem,
} from '../types/dashboard/dashboard.interfaces';

interface DashboardState {
  dashboardStats: DashboardStatsResponse | null;
  dashboardLoading: boolean;
  dashboardError: string | null;

  priorityCases: PriorityCaseItem[];
  casesLoading: boolean;
  casesError: string | null;

  todayMeetings: TodayMeetingItem[];
  meetingsLoading: boolean;
  meetingsError: string | null;

  fetchDashboard: () => Promise<void>;
  fetchPriorityCases: (limit?: number) => Promise<void>;
  fetchTodayMeetings: () => Promise<void>;
  fetchAllDashboardData: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  dashboardStats: null,
  dashboardLoading: false,
  dashboardError: null,
  priorityCases: [],
  casesLoading: false,
  casesError: null,
  todayMeetings: [],
  meetingsLoading: false,
  meetingsError: null,
};

export const useDashboardStore = create<DashboardState>((set) => ({
  ...initialState,

  fetchDashboard: async () => {
    set({ dashboardLoading: true, dashboardError: null });
    try {
      const data = await dashboardService.getDashboardStats();
      set({ dashboardStats: data, dashboardLoading: false });
    } catch (error) {
      set({
        dashboardError: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
        dashboardLoading: false,
      });
    }
  },

  fetchPriorityCases: async (limit = 5) => {
    set({ casesLoading: true, casesError: null });
    try {
      const data = await dashboardService.getPriorityCases(limit);
      set({ priorityCases: data.cases || [], casesLoading: false });
    } catch (error) {
      set({
        casesError: error instanceof Error ? error.message : 'Failed to fetch priority cases',
        casesLoading: false,
      });
    }
  },

  fetchTodayMeetings: async () => {
    set({ meetingsLoading: true, meetingsError: null });
    try {
      const data = await dashboardService.getTodayMeetings();
      set({ todayMeetings: data.meetings || [], meetingsLoading: false });
    } catch (error) {
      set({
        meetingsError: error instanceof Error ? error.message : 'Failed to fetch today meetings',
        meetingsLoading: false,
      });
    }
  },

  fetchAllDashboardData: async () => {
    try {
      await Promise.all([
        useDashboardStore.getState().fetchDashboard(),
        useDashboardStore.getState().fetchPriorityCases(5),
        useDashboardStore.getState().fetchTodayMeetings(),
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  },

  reset: () => set(initialState),
}));
