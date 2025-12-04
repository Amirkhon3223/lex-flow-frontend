import { create } from 'zustand';
import { casesService } from '../services/cases/cases.service';
import type { CaseInterface, CreateCaseInterface, UpdateCaseInterface, TimelineEventInterface } from '../types/cases/cases.interfaces';

interface CasesState {
  cases: CaseInterface[];
  selectedCase: CaseInterface | null;
  timeline: TimelineEventInterface[];
  loading: boolean;
  error: string | null;
  fetchCases: (params?: { page?: number; limit?: number; status?: string; priority?: string }) => Promise<void>;
  fetchCaseById: (id: string) => Promise<void>;
  createCase: (data: CreateCaseInterface) => Promise<void>;
  updateCase: (id: string, data: UpdateCaseInterface) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  fetchTimeline: (caseId: string) => Promise<void>;
  selectCase: (caseItem: CaseInterface | null) => void;
}

export const useCasesStore = create<CasesState>((set) => ({
  cases: [],
  selectedCase: null,
  timeline: [],
  loading: false,
  error: null,

  fetchCases: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await casesService.list(params);
      set({ cases: response.cases, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchCaseById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const caseData = await casesService.getById(id);
      set({ selectedCase: caseData, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createCase: async (data: CreateCaseInterface) => {
    set({ loading: true, error: null });
    try {
      const newCase = await casesService.create(data);
      set((state) => ({
        cases: [...state.cases, newCase],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateCase: async (id: string, data: UpdateCaseInterface) => {
    set({ loading: true, error: null });
    try {
      const updatedCase = await casesService.update(id, data);
      set((state) => ({
        cases: state.cases.map((c) => (c.id === id ? updatedCase : c)),
        selectedCase: state.selectedCase?.id === id ? updatedCase : state.selectedCase,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteCase: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await casesService.delete(id);
      set((state) => ({
        cases: state.cases.filter((c) => c.id !== id),
        selectedCase: state.selectedCase?.id === id ? null : state.selectedCase,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchTimeline: async (caseId: string) => {
    set({ loading: true, error: null });
    try {
      const timeline = await casesService.getTimeline(caseId);
      set({ timeline, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  selectCase: (caseItem: CaseInterface | null) => {
    set({ selectedCase: caseItem });
  },
}));
