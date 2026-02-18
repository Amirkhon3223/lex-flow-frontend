export interface TaskTemplateItem {
  title: string;
  description: string;
  priority: string;
  daysOffset: number;
  order: number;
}

export interface TaskTemplate {
  id: string;
  workspaceId: string;
  name: string;
  category: string;
  description: string;
  tasks: TaskTemplateItem[];
  isSystem: boolean;
  isActive: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskTemplateRequest {
  name: string;
  category: string;
  description?: string;
  tasks: TaskTemplateItem[];
  isActive?: boolean;
}

export interface UpdateTaskTemplateRequest {
  name?: string;
  description?: string;
  tasks?: TaskTemplateItem[];
  isActive?: boolean;
}

export interface CategoryTemplateCount {
  category: string;
  count: number;
}

export interface TaskTemplateListResponse {
  templates: TaskTemplate[];
  pagination: {
    page: number;
    limit: number;
    totalItems?: number;
    total?: number;
    totalPages: number;
  };
}
