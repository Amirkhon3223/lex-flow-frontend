import type {
  WorkspaceInfo,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from '@/app/types/workspaces';
import { httpClient } from '../../interceptors/http.interceptor';

/**
 * Workspaces Service
 * API для работы с workspace (рабочими пространствами)
 */
export const workspacesService = {
  /**
   * Получить список всех workspaces текущего пользователя
   */
  getMyWorkspaces: async (): Promise<WorkspaceInfo[]> => {
    const response = await httpClient.get<WorkspaceInfo[]>('/workspaces/my');
    return response.data;
  },

  /**
   * Получить текущий активный workspace
   */
  getCurrentWorkspace: async (): Promise<WorkspaceInfo> => {
    const response = await httpClient.get<WorkspaceInfo>('/workspaces/current');
    return response.data;
  },

  /**
   * Создать новый workspace
   */
  createWorkspace: async (data: CreateWorkspaceRequest): Promise<WorkspaceInfo> => {
    const response = await httpClient.post<WorkspaceInfo>('/workspaces', data);
    return response.data;
  },

  /**
   * Обновить workspace
   */
  updateWorkspace: async (
    workspaceId: string,
    data: UpdateWorkspaceRequest
  ): Promise<WorkspaceInfo> => {
    const response = await httpClient.put<WorkspaceInfo>(
      `/workspaces/${workspaceId}`,
      data
    );
    return response.data;
  },

  /**
   * Удалить workspace (только owner)
   */
  deleteWorkspace: async (workspaceId: string): Promise<void> => {
    await httpClient.delete(`/workspaces/${workspaceId}`);
  },
};
