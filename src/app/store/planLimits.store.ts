import { create } from 'zustand';
import { billingService } from '../services/billing/billing.service';
import type { PlanUsageResponse } from '../types/billing/billing.interfaces';

interface PlanLimitsState {
  usage: PlanUsageResponse | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchUsage: () => Promise<void>;
  refreshUsage: () => Promise<void>;
  invalidate: () => void;
}

const CACHE_TTL = 60_000; // 1 minute

export const usePlanLimitsStore = create<PlanLimitsState>((set, get) => ({
  usage: null,
  loading: false,
  error: null,
  lastFetched: null,

  fetchUsage: async () => {
    const { lastFetched, loading } = get();
    // Skip if recently fetched or already loading
    if (loading) return;
    if (lastFetched && Date.now() - lastFetched < CACHE_TTL) return;

    set({ loading: true, error: null });
    try {
      const response = await billingService.getUsage();
      set({ usage: response, loading: false, lastFetched: Date.now() });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  refreshUsage: async () => {
    set({ loading: true, error: null, lastFetched: null });
    try {
      const response = await billingService.getUsage();
      set({ usage: response, loading: false, lastFetched: Date.now() });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  invalidate: () => {
    set({ lastFetched: null });
  },
}));
