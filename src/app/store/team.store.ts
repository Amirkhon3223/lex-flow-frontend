import { create } from 'zustand';
import { teamService } from '../services/team/team.service';
import type {
  TeamMember,
  TeamInvite,
  InviteTeamMemberRequest,
  UpdateMemberRoleRequest,
} from '../types/team/team.interfaces';

interface TeamState {
  members: TeamMember[];
  invites: TeamInvite[];
  total: number;
  maxMembers: number;
  availableSlots: number;
  loading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  fetchInvites: () => Promise<void>;
  inviteMember: (data: InviteTeamMemberRequest) => Promise<void>;
  cancelInvite: (inviteId: string) => Promise<void>;
  updateMemberRole: (memberId: string, data: UpdateMemberRoleRequest) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: [],
  invites: [],
  total: 0,
  maxMembers: 8,
  availableSlots: 8,
  loading: false,
  error: null,

  fetchMembers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await teamService.getMembers();
      set({
        members: response.members,
        total: response.total,
        maxMembers: response.maxMembers,
        availableSlots: response.availableSlots,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchInvites: async () => {
    set({ loading: true, error: null });
    try {
      const response = await teamService.getInvites();
      set({
        invites: response.invites,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  inviteMember: async (data: InviteTeamMemberRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await teamService.inviteMember(data);
      set((state) => ({
        invites: [response.invite, ...state.invites],
        availableSlots: Math.max(0, state.availableSlots - 1),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  cancelInvite: async (inviteId: string) => {
    set({ loading: true, error: null });
    try {
      await teamService.cancelInvite(inviteId);
      set((state) => ({
        invites: state.invites.filter((invite) => invite.id !== inviteId),
        availableSlots: state.availableSlots + 1,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateMemberRole: async (memberId: string, data: UpdateMemberRoleRequest) => {
    set({ loading: true, error: null });
    try {
      const updatedMember = await teamService.updateMemberRole(memberId, data);
      set((state) => ({
        members: state.members.map((member) =>
          member.id === memberId ? updatedMember : member
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  removeMember: async (memberId: string) => {
    set({ loading: true, error: null });
    try {
      await teamService.removeMember(memberId);
      set((state) => ({
        members: state.members.filter((member) => member.id !== memberId),
        total: state.total - 1,
        availableSlots: state.availableSlots + 1,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));
