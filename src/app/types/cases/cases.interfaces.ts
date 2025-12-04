import {
  CaseStatusEnum,
  CasePriorityEnum,
  DocumentStatusEnum,
  TimelineEventTypeEnum,
  AIInsightTypeEnum,
  AIInsightPriorityEnum,
} from './cases.enums';
import type { Pagination } from '../api/api.types';

export interface ClientInfoInterface {
  name: string;
  avatar: string;
}

export interface CaseInterface {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  clientAvatar: string | null;
  category: string;
  status: CaseStatusEnum;
  priority: CasePriorityEnum;
  deadline: string;
  progress: number;
  description: string;
  fee: number;
  documents: number;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  lastUpdate: string;
}

export interface CaseDocumentInterface {
  id: number;
  name: string;
  size: string;
  date: string;
  versions: number;
  status: DocumentStatusEnum;
}

export interface TimelineEventInterface {
  id: string;
  caseId: string;
  eventDate: string;
  title: string;
  description: string;
  eventType: TimelineEventTypeEnum;
  createdAt: string;
}

export interface CaseTaskInterface {
  id: number;
  title: string;
  completed: boolean;
}

export interface AIInsightInterface {
  type: AIInsightTypeEnum;
  title: string;
  description: string;
  priority: AIInsightPriorityEnum;
}

export interface CaseCardInterface {
  id: number;
  title: string;
  client: string;
  clientInitials: string;
  category: string;
  deadline: string;
  daysLeft: number;
  progress: number;
  documents: number;
  events: number;
  status: string;
  statusText: string;
}

export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface FilterTabsProps {
  filterStatus: 'all' | 'urgent' | 'medium' | 'completed';
  setFilterStatus: (status: 'all' | 'urgent' | 'medium' | 'completed') => void;
}

export interface CaseCardProps {
  caseItem: CaseCardInterface;
}

export interface CaseFormData {
  title: string;
  client: string;
  category: string;
  deadline: string;
  fee: string;
  description: string;
  priority: string;
}

export interface AddCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (caseData: CaseFormData) => void;
}

export interface EditCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CaseFormData;
  onSubmit?: (caseData: CaseFormData) => void;
}

export interface CaseFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
}

export interface CaseTypeData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface CreateCaseInterface {
  title: string;
  clientId: string;
  category: string;
  priority: CasePriorityEnum;
  deadline: string;
  description: string;
  fee: number;
  assignedTo?: string;
}

export interface UpdateCaseInterface {
  title?: string;
  status?: CaseStatusEnum;
  priority?: CasePriorityEnum;
  deadline?: string;
  progress?: number;
  description?: string;
  fee?: number;
  assignedTo?: string;
}

export interface CaseListResponse {
  cases: CaseInterface[];
  pagination: Pagination;
}

export interface CreateTimelineEventInterface {
  eventDate: string;
  title: string;
  description: string;
  eventType: TimelineEventTypeEnum;
}
