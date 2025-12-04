import { httpClient } from '../../interceptors/http.interceptor';
import type {
  MeetingInterface,
  CreateMeetingInterface,
  UpdateMeetingInterface,
  MeetingListResponse,
  CalendarDayResponse,
  CalendarWeekResponse,
  CalendarMonthResponse,
  MeetingStatsResponse,
} from '../../types/calendar/calendar.interfaces';

export const calendarService = {
  create: async (data: CreateMeetingInterface): Promise<MeetingInterface> => {
    const response = await httpClient.post<MeetingInterface>('/calendar/meetings', data);
    return response.data;
  },

  list: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    priority?: string;
    clientId?: string;
    caseId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<MeetingListResponse> => {
    const response = await httpClient.get<MeetingListResponse>('/calendar/meetings', {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<MeetingInterface> => {
    const response = await httpClient.get<MeetingInterface>(`/calendar/meetings/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateMeetingInterface): Promise<MeetingInterface> => {
    const response = await httpClient.put<MeetingInterface>(
      `/calendar/meetings/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/calendar/meetings/${id}`);
  },

  getDay: async (date: string): Promise<CalendarDayResponse> => {
    const response = await httpClient.get<CalendarDayResponse>('/calendar/day', {
      params: { date },
    });
    return response.data;
  },

  getWeek: async (startDate: string): Promise<CalendarWeekResponse> => {
    const response = await httpClient.get<CalendarWeekResponse>('/calendar/week', {
      params: { startDate },
    });
    return response.data;
  },

  getMonth: async (year: number, month: number): Promise<CalendarMonthResponse> => {
    const response = await httpClient.get<CalendarMonthResponse>('/calendar/month', {
      params: { year, month },
    });
    return response.data;
  },

  getUpcoming: async (limit?: number): Promise<MeetingInterface[]> => {
    const response = await httpClient.get<MeetingInterface[]>('/calendar/upcoming', {
      params: { limit },
    });
    return response.data;
  },

  getToday: async (): Promise<MeetingInterface[]> => {
    const response = await httpClient.get<MeetingInterface[]>('/calendar/today');
    return response.data;
  },

  getStats: async (): Promise<MeetingStatsResponse> => {
    const response = await httpClient.get<MeetingStatsResponse>('/calendar/stats');
    return response.data;
  },
};
