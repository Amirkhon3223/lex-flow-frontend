import { httpClient } from '../../interceptors/http.interceptor';
import type { DashboardStatsResponse } from '../../types/analytics/analytics.interfaces';
import type {
  PriorityCasesResponse,
  TodayMeetingsResponse,
} from '../../types/dashboard/dashboard.interfaces';

export const dashboardService = {
  /**
   * Get dashboard stats with trends and tasksToday
   * Endpoint: GET /analytics/dashboard
   */
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const response = await httpClient.get<DashboardStatsResponse>('/analytics/dashboard');
    return response.data;
  },

  /**
   * Get priority cases for dashboard
   *
   * Фильтр priority=high показывает:
   * - Дела с приоритетом "urgent" или "high"
   * - ИЛИ дела с дедлайном в ближайшие 3 дня
   *
   * Сортировка по дедлайну - сначала ближайшие
   * Limit = 5 дел
   *
   * Доступные статусы: new, in_progress, waiting, closed, won, lost, settled
   * Доступные приоритеты: low, medium, high, urgent
   */
  getPriorityCases: async (limit = 5): Promise<PriorityCasesResponse> => {
    const response = await httpClient.get<PriorityCasesResponse>('/cases', {
      params: {
        priority: 'high',
        sortBy: 'deadline',
        limit,
      },
    });
    return response.data;
  },

  /**
   * Get today's meetings
   * Endpoint: GET /calendar/today
   */
  getTodayMeetings: async (): Promise<TodayMeetingsResponse> => {
    const response = await httpClient.get<TodayMeetingsResponse>('/calendar/today');
    return response.data;
  },
};
