import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { workspacesService } from '@/app/services/workspaces';
import type {
  WorkspaceInfo,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from '@/app/types/workspaces';

interface WorkspacesState {
  currentWorkspace: WorkspaceInfo | null
  workspaces: WorkspaceInfo[]
  loading: boolean
  error: string | null

  setCurrentWorkspace: (workspace: WorkspaceInfo | null) => void
  fetchMyWorkspaces: () => Promise<void>
  fetchCurrentWorkspace: () => Promise<void>
  createWorkspace: (data: CreateWorkspaceRequest) => Promise<WorkspaceInfo>
  updateWorkspace: (workspaceId: string, data: UpdateWorkspaceRequest) => Promise<void>
  switchWorkspace: (workspaceId: string) => Promise<void>
  clearWorkspaces: () => void
}

export const useWorkspacesStore = create<WorkspacesState>()(
  persist(
    (set, get) => ({
      currentWorkspace: null,
      workspaces: [],
      loading: false,
      error: null,

      setCurrentWorkspace: (workspace) => {
        set({ currentWorkspace: workspace });
      },

      fetchMyWorkspaces: async () => {
        set({ loading: true, error: null });
        try {
          const workspaces = await workspacesService.getMyWorkspaces();
          set({ workspaces, loading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch workspaces', loading: false });
          throw error;
        }
      },

      fetchCurrentWorkspace: async () => {
        set({ loading: true, error: null });
        try {
          const workspace = await workspacesService.getCurrentWorkspace();
          set({ currentWorkspace: workspace, loading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to fetch current workspace',
            loading: false,
          });
          throw error;
        }
      },

      createWorkspace: async (data) => {
        set({ loading: true, error: null });
        try {
          const workspace = await workspacesService.createWorkspace(data);
          set({ currentWorkspace: workspace, loading: false });
          return workspace;
        } catch (error: any) {
          set({ error: error.message || 'Failed to create workspace', loading: false });
          throw error;
        }
      },

      updateWorkspace: async (workspaceId, data) => {
        set({ loading: true, error: null });
        try {
          const updated = await workspacesService.updateWorkspace(workspaceId, data);
          set({ currentWorkspace: updated, loading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to update workspace', loading: false });
          throw error;
        }
      },

      switchWorkspace: async (workspaceId) => {
        set({ loading: true, error: null });
        try {
          // TODO: Implement workspace switching logic
          const workspace = get().workspaces.find((w) => w.id === workspaceId);
          if (workspace) {
            set({ currentWorkspace: workspace, loading: false });
          } else {
            const fetchedWorkspace = await workspacesService.getCurrentWorkspace();
            set({ currentWorkspace: fetchedWorkspace, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || 'Failed to switch workspace', loading: false });
          throw error;
        }
      },

      clearWorkspaces: () => {
        set({
          currentWorkspace: null,
          workspaces: [],
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: 'workspaces-storage',
      partialize: (state) => ({ currentWorkspace: state.currentWorkspace }),
    }
  )
);
