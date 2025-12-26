import { httpClient } from '../../interceptors/http.interceptor';
import type { SuccessResponse } from '../../types/api/api.types';
import type {
  TeamMembersListResponse,
  InviteTeamMemberRequest,
  InviteTeamMemberResponse,
  TeamInvitesListResponse,
  UpdateMemberRoleRequest,
  TeamMember,
} from '../../types/team/team.interfaces';

export const teamService = {
  // ==================== TEAM MEMBERS ====================
  // Get team members list
  getMembers: async (): Promise<TeamMembersListResponse> => {
    const response = await httpClient.get<TeamMembersListResponse>('/team/members');
    return response.data;
  },

  // Update member role
  updateMemberRole: async (
    memberId: string,
    data: UpdateMemberRoleRequest
  ): Promise<TeamMember> => {
    const response = await httpClient.put<TeamMember>(
      `/team/members/${memberId}/role`,
      data
    );
    return response.data;
  },

  // Remove team member
  removeMember: async (memberId: string): Promise<SuccessResponse> => {
    const response = await httpClient.delete<SuccessResponse>(`/team/members/${memberId}`);
    return response.data;
  },

  // ==================== TEAM INVITES ====================
  // Get invites list
  getInvites: async (): Promise<TeamInvitesListResponse> => {
    const response = await httpClient.get<TeamInvitesListResponse>('/team/invites');
    return response.data;
  },

  // Invite team member
  inviteMember: async (
    data: InviteTeamMemberRequest
  ): Promise<InviteTeamMemberResponse> => {
    const response = await httpClient.post<InviteTeamMemberResponse>('/team/invites', data);
    return response.data;
  },

  // Cancel invite
  cancelInvite: async (inviteId: string): Promise<SuccessResponse> => {
    const response = await httpClient.delete<SuccessResponse>(`/team/invites/${inviteId}`);
    return response.data;
  },
};
