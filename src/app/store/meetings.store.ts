import { create } from 'zustand';
import { calendarService } from '../services/calendar/calendar.service';
import type { Pagination } from '../types/api/api.types';
import type {
  MeetingInterface,
  CreateMeetingInterface,
  UpdateMeetingInterface,
  CalendarDayResponse,
  CalendarWeekResponse,
  CalendarMonthResponse,
  MeetingStatsResponse,
} from '../types/calendar/calendar.interfaces';

interface MeetingsState {
  meetings: MeetingInterface[];
  selectedMeeting: MeetingInterface | null;
  todayMeetings: MeetingInterface[];
  upcomingMeetings: MeetingInterface[];
  dayMeetings: CalendarDayResponse | null;
  weekMeetings: CalendarWeekResponse | null;
  monthMeetings: CalendarMonthResponse | null;
  stats: MeetingStatsResponse | null;
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
  fetchToday: () => Promise<void>;
  fetchUpcoming: (limit?: number) => Promise<void>;
  fetchDay: (date: string) => Promise<void>;
  fetchWeek: (startDate: string) => Promise<void>;
  fetchMonth: (year: number, month: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  createMeeting: (data: CreateMeetingInterface) => Promise<void>;
  updateMeeting: (id: string, data: UpdateMeetingInterface) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  selectMeeting: (meeting: MeetingInterface | null) => void;
}

export const useMeetingsStore = create<MeetingsState>((set) => ({
  meetings: [],
  selectedMeeting: null,
  todayMeetings: [],
  upcomingMeetings: [],
  dayMeetings: null,
  weekMeetings: null,
  monthMeetings: null,
  stats: null,
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
      throw error;
    }
  },

  fetchToday: async () => {
    set({ loading: true, error: null });
    try {
      const meetings = await calendarService.getToday();
      set({ todayMeetings: meetings, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchUpcoming: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const meetings = await calendarService.getUpcoming(limit);
      set({ upcomingMeetings: meetings, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchDay: async (date: string) => {
    set({ loading: true, error: null });
    try {
      const dayMeetings = await calendarService.getDay(date);
      set({ dayMeetings, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchWeek: async (startDate: string) => {
    set({ loading: true, error: null });
    try {
      const weekMeetings = await calendarService.getWeek(startDate);
      set({ weekMeetings, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchMonth: async (year: number, month: number) => {
    set({ loading: true, error: null });
    try {
      const monthMeetings = await calendarService.getMonth(year, month);
      set({ monthMeetings, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await calendarService.getStats();
      set({ stats, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchMeetingById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const meeting = await calendarService.getById(id);
      set({ selectedMeeting: meeting, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
    }
  },

  selectMeeting: (meeting: MeetingInterface | null) => {
    set({ selectedMeeting: meeting });
  },
}));
