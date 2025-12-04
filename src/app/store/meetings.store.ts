import { create } from 'zustand';
import { calendarService } from '../services/calendar/calendar.service';
import type {
  MeetingInterface,
  CreateMeetingInterface,
  UpdateMeetingInterface,
} from '../types/calendar/calendar.interfaces';
import type { Pagination } from '../types/api/api.types';

interface MeetingsState {
  meetings: MeetingInterface[];
  selectedMeeting: MeetingInterface | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  fetchMeetings: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    priority?: string;
    clientId?: string;
    caseId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => Promise<void>;
  fetchMeetingById: (id: string) => Promise<void>;
  createMeeting: (data: CreateMeetingInterface) => Promise<void>;
  updateMeeting: (id: string, data: UpdateMeetingInterface) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  selectMeeting: (meeting: MeetingInterface | null) => void;
}

export const useMeetingsStore = create<MeetingsState>((set) => ({
  meetings: [],
  selectedMeeting: null,
  pagination: null,
  loading: false,
  error: null,

  fetchMeetings: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await calendarService.list(params);
      set({ meetings: response.meetings, pagination: response.pagination, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchMeetingById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const meeting = await calendarService.getById(id);
      set({ selectedMeeting: meeting, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createMeeting: async (data: CreateMeetingInterface) => {
    set({ loading: true, error: null });
    try {
      const meeting = await calendarService.create(data);
      set((state) => ({
        meetings: [meeting, ...state.meetings],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateMeeting: async (id: string, data: UpdateMeetingInterface) => {
    set({ loading: true, error: null });
    try {
      const updatedMeeting = await calendarService.update(id, data);
      set((state) => ({
        meetings: state.meetings.map((m) => (m.id === id ? updatedMeeting : m)),
        selectedMeeting: state.selectedMeeting?.id === id ? updatedMeeting : state.selectedMeeting,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteMeeting: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await calendarService.delete(id);
      set((state) => ({
        meetings: state.meetings.filter((m) => m.id !== id),
        selectedMeeting: state.selectedMeeting?.id === id ? null : state.selectedMeeting,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  selectMeeting: (meeting: MeetingInterface | null) => {
    set({ selectedMeeting: meeting });
  },
}));
