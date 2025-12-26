import type { MembershipRole } from '../membership'

/**
 * Роль участника команды
 * Используется для UI - отличается от MembershipRole
 */
export type TeamRole = 'owner' | 'admin' | 'member'

export type MemberStatus = 'active' | 'pending' | 'suspended'
export type InviteStatus = 'pending' | 'accepted' | 'expired'

/**
 * Член команды (TeamMember)
 * Объединяет User + Membership
 */
export interface TeamMember {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar: string | null
  role: TeamRole
  status: MemberStatus
  invitedBy: string | null
  createdAt: string
}

/**
 * Ответ со списком участников команды
 */
export interface TeamMembersListResponse {
  members: TeamMember[]
  total: number
  maxMembers: number
  availableSlots: number
}

/**
 * Запрос на приглашение участника
 * Только для Pro Max плана
 */
export interface InviteTeamMemberRequest {
  email: string
  role: 'admin' | 'member'
}

/**
 * Приглашение участника
 * workspaceId - в какой workspace приглашают
 */
export interface TeamInvite {
  id: string
  email: string
  workspaceId: string
  role: TeamRole
  status: InviteStatus
  invitedBy: {
    id: string
    name: string
  }
  expiresAt: string
  createdAt: string
}

/**
 * Ответ при создании приглашения
 */
export interface InviteTeamMemberResponse {
  message: string
  invite: TeamInvite
}

/**
 * Ответ со списком приглашений
 */
export interface TeamInvitesListResponse {
  invites: TeamInvite[]
  total: number
}

/**
 * Запрос на обновление роли участника
 */
export interface UpdateMemberRoleRequest {
  role: 'admin' | 'member'
}
