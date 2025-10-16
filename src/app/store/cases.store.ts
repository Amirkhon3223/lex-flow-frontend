import { create } from 'zustand';

interface Case {
  id: string;
  title: string;
  clientId: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: string;
  caseId: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

interface CasesState {
  cases: Case[];
  selectedCase: Case | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchCases: () => Promise<void>;
  createCase: (data: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCase: (id: string, data: Partial<Case>) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  fetchTasks: (caseId: string) => Promise<void>;
  selectCase: (caseItem: Case | null) => void;
}

export const useCasesStore = create<CasesState>((set) => ({
  cases: [],
  selectedCase: null,
  tasks: [],
  loading: false,
  error: null,

  fetchCases: async () => {
    set({ loading: true, error: null });
    try {
      set({ cases: [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createCase: async (data) => {
    set({ loading: true, error: null });
    try {
      const newCase: Case = {
        ...data,
        id: Math.random().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => ({
        cases: [...state.cases, newCase],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateCase: async (id, data) => {
    set({ loading: true, error: null });
    try {
      set((state) => ({
        cases: state.cases.map((c) => (c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c)),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteCase: async (id) => {
    set({ loading: true, error: null });
    try {
      set((state) => ({
        cases: state.cases.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchTasks: async (caseId) => {
    set({ loading: true, error: null });
    try {
      set({ tasks: [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  selectCase: (caseItem) => {
    set({ selectedCase: caseItem });
  },
}));
