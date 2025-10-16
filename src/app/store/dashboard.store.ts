import { create } from 'zustand';

interface Stats {
  activeCases: number;
  clients: number;
  documents: number;
  tasks: number;
}

interface Activity {
  id: string;
  action: string;
  user: string;
  time: string;
  type: 'case' | 'document' | 'client';
}

interface PriorityCase {
  id: string;
  title: string;
  client: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
}

interface DashboardState {
  stats: Stats;
  recentActivity: Activity[];
  priorityCases: PriorityCase[];
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchRecentActivity: () => Promise<void>;
  fetchPriorityCases: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: {
    activeCases: 0,
    clients: 0,
    documents: 0,
    tasks: 0,
  },
  recentActivity: [],
  priorityCases: [],
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      set({
        stats: {
          activeCases: 45,
          clients: 150,
          documents: 320,
          tasks: 78,
        },
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchRecentActivity: async () => {
    set({ loading: true, error: null });
    try {
      set({ recentActivity: [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchPriorityCases: async () => {
    set({ loading: true, error: null });
    try {
      set({ priorityCases: [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
