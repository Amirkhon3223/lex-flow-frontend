import { create } from 'zustand';
import { casesService } from '../services/cases/cases.service';
import type { Pagination } from '../types/api/api.types';
import type {
  CaseInterface,
  CreateCaseInterface,
  UpdateCaseInterface,
  TimelineEventInterface,
  CommentInterface,
  CaseTaskInterface,
} from '../types/cases/cases.interfaces';

interface CasesState {
  cases: CaseInterface[];
  selectedCase: CaseInterface | null;
  timeline: TimelineEventInterface[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;

  // Comments state
  comments: CommentInterface[];
  commentsLoading: boolean;
  commentsError: string | null;

  // Tasks state
  tasks: CaseTaskInterface[];
  tasksLoading: boolean;
  tasksError: string | null;

  fetchCases: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    clientId?: string;
    search?: string;
  }) => Promise<void>;
  fetchCaseById: (id: string) => Promise<void>;
  createCase: (data: CreateCaseInterface) => Promise<void>;
  updateCase: (id: string, data: UpdateCaseInterface) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  fetchTimeline: (caseId: string) => Promise<void>;
  selectCase: (caseItem: CaseInterface | null) => void;

  // Comments actions
  fetchComments: (caseId: string) => Promise<void>;
  addComment: (caseId: string, content: string) => Promise<void>;
  updateComment: (caseId: string, commentId: string, content: string) => Promise<void>;
  deleteComment: (caseId: string, commentId: string) => Promise<void>;

  // Tasks actions
  fetchTasks: (caseId: string) => Promise<void>;
  addTask: (caseId: string, title: string) => Promise<void>;
  updateTask: (
    caseId: string,
    taskId: string,
    data: { title?: string; completed?: boolean }
  ) => Promise<void>;
  deleteTask: (caseId: string, taskId: string) => Promise<void>;
  toggleTask: (caseId: string, taskId: string) => Promise<void>;
}

// Helper function to extract error message
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

export const useCasesStore = create<CasesState>((set, get) => ({
  cases: [],
  selectedCase: null,
  timeline: [],
  pagination: null,
  loading: false,
  error: null,

  // Comments state
  comments: [],
  commentsLoading: false,
  commentsError: null,

  // Tasks state
  tasks: [],
  tasksLoading: false,
  tasksError: null,

  fetchCases: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await casesService.list(params);
      set({ cases: response.cases, pagination: response.pagination, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchCaseById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const caseData = await casesService.getById(id);
      set({ selectedCase: caseData, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createCase: async (data: CreateCaseInterface) => {
    set({ loading: true, error: null });
    try {
      await casesService.create(data);
      const response = await casesService.list({ page: 1, limit: 10 });
      set({
        cases: response.cases,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateCase: async (id: string, data: UpdateCaseInterface) => {
    set({ loading: true, error: null });
    try {
      const updatedCase = await casesService.update(id, data);
      set((state) => ({
        cases: state.cases.map((c) => (c.id === id ? updatedCase : c)),
        selectedCase: state.selectedCase?.id === id ? updatedCase : state.selectedCase,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteCase: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await casesService.delete(id);
      set((state) => ({
        cases: state.cases.filter((c) => c.id !== id),
        selectedCase: state.selectedCase?.id === id ? null : state.selectedCase,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchTimeline: async (caseId: string) => {
    set({ loading: true, error: null });
    try {
      const timeline = await casesService.getTimeline(caseId);
      set({ timeline, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  selectCase: (caseItem: CaseInterface | null) => {
    set({ selectedCase: caseItem });
  },

  // Comments actions
  fetchComments: async (caseId: string) => {
    set({ commentsLoading: true, commentsError: null });
    try {
      const comments = await casesService.getComments(caseId);
      set({ comments, commentsLoading: false });
    } catch (error) {
      set({
        commentsError: getErrorMessage(error, 'Failed to fetch comments'),
        commentsLoading: false,
      });
    }
  },

  addComment: async (caseId: string, content: string) => {
    set({ commentsLoading: true, commentsError: null });
    try {
      const newComment = await casesService.addComment(caseId, content);
      set((state) => ({
        comments: [...state.comments, newComment],
        commentsLoading: false,
      }));
    } catch (error) {
      set({
        commentsError: getErrorMessage(error, 'Failed to add comment'),
        commentsLoading: false,
      });
    }
  },

  updateComment: async (caseId: string, commentId: string, content: string) => {
    set({ commentsLoading: true, commentsError: null });
    try {
      const updatedComment = await casesService.updateComment(caseId, commentId, content);
      set((state) => ({
        comments: state.comments.map((c) => (c.id === commentId ? updatedComment : c)),
        commentsLoading: false,
      }));
    } catch (error) {
      set({
        commentsError: getErrorMessage(error, 'Failed to update comment'),
        commentsLoading: false,
      });
    }
  },

  deleteComment: async (caseId: string, commentId: string) => {
    set({ commentsLoading: true, commentsError: null });
    try {
      await casesService.deleteComment(caseId, commentId);
      set((state) => ({
        comments: state.comments.filter((c) => c.id !== commentId),
        commentsLoading: false,
      }));
    } catch (error) {
      set({
        commentsError: getErrorMessage(error, 'Failed to delete comment'),
        commentsLoading: false,
      });
    }
  },

  // Tasks actions
  fetchTasks: async (caseId: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const tasks = await casesService.getTasks(caseId);
      set({ tasks, tasksLoading: false });
    } catch (error) {
      set({
        tasksError: getErrorMessage(error, 'Failed to fetch tasks'),
        tasksLoading: false,
      });
    }
  },

  addTask: async (caseId: string, title: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const newTask = await casesService.addTask(caseId, title);
      set((state) => ({
        tasks: [...state.tasks, newTask],
        tasksLoading: false,
      }));
    } catch (error) {
      set({
        tasksError: getErrorMessage(error, 'Failed to add task'),
        tasksLoading: false,
      });
    }
  },

  updateTask: async (
    caseId: string,
    taskId: string,
    data: { title?: string; completed?: boolean }
  ) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const updatedTask = await casesService.updateTask(caseId, taskId, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        tasksLoading: false,
      }));
    } catch (error) {
      set({
        tasksError: getErrorMessage(error, 'Failed to update task'),
        tasksLoading: false,
      });
    }
  },

  deleteTask: async (caseId: string, taskId: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      await casesService.deleteTask(caseId, taskId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
        tasksLoading: false,
      }));
    } catch (error) {
      set({
        tasksError: getErrorMessage(error, 'Failed to delete task'),
        tasksLoading: false,
      });
    }
  },

  toggleTask: async (caseId: string, taskId: string) => {
    const state = get();
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    set({ tasksLoading: true, tasksError: null });
    try {
      const updatedTask = await casesService.updateTask(caseId, taskId, {
        completed: !task.completed,
      });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        tasksLoading: false,
      }));
    } catch (error) {
      set({
        tasksError: getErrorMessage(error, 'Failed to toggle task'),
        tasksLoading: false,
      });
    }
  },
}));
