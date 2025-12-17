import type { AccountType } from '../users/users.interfaces';

export type TeamRole = 'owner' | 'admin' | 'lawyer' | 'assistant';
export type MemberStatus = 'active' | 'pending' | 'suspended';
export type InviteStatus = 'pending' | 'accepted' | 'expired';

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  role: TeamRole;
  accountType: AccountType;
  status: MemberStatus;
  invitedBy: string | null;
  createdAt: string;
}

export interface TeamMembersListResponse {
  members: TeamMember[];
  total: number;
  maxMembers: number;
  availableSlots: number;
}

export interface InviteTeamMemberRequest {
  email: string;
  role: 'admin' | 'lawyer' | 'assistant';
}

export interface TeamInvite {
  id: string;
  email: string;
  role: TeamRole;
  status: InviteStatus;
  invitedBy: {
    id: string;
    name: string;
  };
  expiresAt: string;
  createdAt: string;
}

export interface InviteTeamMemberResponse {
  message: string;
  invite: TeamInvite;
}

export interface TeamInvitesListResponse {
  invites: TeamInvite[];
  total: number;
}

export interface UpdateMemberRoleRequest {
  role: 'admin' | 'lawyer' | 'assistant';
}
