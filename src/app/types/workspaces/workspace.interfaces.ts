/**
 * Workspace Interfaces
 * Заменяет старые Organization интерфейсы
 */

export type WorkspaceStatus = 'trialing' | 'active' | 'past_due' | 'canceled'

/**
 * Информация о Workspace (рабочее пространство)
 * Контейнер для команды и подписки
 */
export interface WorkspaceInfo {
  id: string
  name: string
  ownerId: string
  planId: string
  planName: string
  status: WorkspaceStatus
  trialEnd?: string
  usersCount: number
}

/**
 * Запрос на создание Workspace
 */
export interface CreateWorkspaceRequest {
  name: string
  planId?: string
}

/**
 * Запрос на обновление Workspace
 */
export interface UpdateWorkspaceRequest {
  name: string
}
