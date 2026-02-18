import { create } from 'zustand';
import { deadlineService } from '../services/deadline/deadline.service';
import type {
  CaseDeadline,
  CreateDeadlineRequest,
  CalculateProceduralRequest,
  CalculateStatuteRequest,
  DeadlineRule,
} from '../types/deadline/deadline.interfaces';

interface DeadlineState {
  deadlines: CaseDeadline[];
  rules: DeadlineRule[];
  loading: boolean;
  error: string | null;

  fetchDeadlines: (caseId: string) => Promise<void>;
  createDeadline: (caseId: string, data: CreateDeadlineRequest) => Promise<void>;
  calculateProcedural: (caseId: string, data: CalculateProceduralRequest) => Promise<void>;
  calculateStatute: (caseId: string, data: CalculateStatuteRequest) => Promise<void>;
  completeDeadline: (caseId: string, deadlineId: string) => Promise<void>;
  deleteDeadline: (caseId: string, deadlineId: string) => Promise<void>;
  fetchRules: (jurisdiction?: string) => Promise<void>;
  reset: () => void;
}

export const useDeadlineStore = create<DeadlineState>((set) => ({
  deadlines: [],
  rules: [],
  loading: false,
  error: null,

  fetchDeadlines: async (caseId: string) => {
    set({ loading: true, error: null });
    try {
      const deadlines = await deadlineService.getDeadlines(caseId);
      set({ deadlines, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createDeadline: async (caseId: string, data: CreateDeadlineRequest) => {
    set({ loading: true, error: null });
    try {
      const deadline = await deadlineService.createDeadline(caseId, data);
      set((state) => ({
        deadlines: [...state.deadlines, deadline],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  calculateProcedural: async (caseId: string, data: CalculateProceduralRequest) => {
    set({ loading: true, error: null });
    try {
      const calculated = await deadlineService.calculateProcedural(caseId, data);
      set((state) => ({
        deadlines: [...state.deadlines, ...calculated],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  calculateStatute: async (caseId: string, data: CalculateStatuteRequest) => {
    set({ loading: true, error: null });
    try {
      const deadline = await deadlineService.calculateStatute(caseId, data);
      set((state) => ({
        deadlines: [...state.deadlines, deadline],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  completeDeadline: async (caseId: string, deadlineId: string) => {
    set({ loading: true, error: null });
    try {
      const updated = await deadlineService.completeDeadline(caseId, deadlineId);
      set((state) => ({
        deadlines: state.deadlines.map((d) => (d.id === deadlineId ? updated : d)),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteDeadline: async (caseId: string, deadlineId: string) => {
    set({ loading: true, error: null });
    try {
      await deadlineService.deleteDeadline(caseId, deadlineId);
      set((state) => ({
        deadlines: state.deadlines.filter((d) => d.id !== deadlineId),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchRules: async (jurisdiction?: string) => {
    set({ loading: true, error: null });
    try {
      const rules = await deadlineService.getProceduralRules(jurisdiction);
      set({ rules, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  reset: () => {
    set({ deadlines: [], rules: [], loading: false, error: null });
  },
}));
