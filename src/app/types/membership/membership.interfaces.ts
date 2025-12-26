/**
 * Membership Interfaces
 * Связь между User и Workspace с ролью
 * ЕДИНСТВЕННЫЙ источник прав доступа в системе
 */

/**
 * Роли в Workspace
 */
export type MembershipRole = 'owner' | 'admin' | 'member'

/**
 * Membership - связь пользователя с workspace
 * Определяет роль и права доступа
 */
export interface Membership {
  id: string
  userId: string
  workspaceId: string
  role: MembershipRole
  createdAt: string
}

/**
 * Запрос на создание Membership
 */
export interface CreateMembershipRequest {
  userId: string
  workspaceId: string
  role: MembershipRole
}

/**
 * Запрос на обновление роли в Membership
 */
export interface UpdateMembershipRoleRequest {
  role: MembershipRole
}
