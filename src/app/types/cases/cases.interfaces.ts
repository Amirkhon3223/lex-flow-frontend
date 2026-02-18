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
  courtDate?: string;
  progress: number;
  description: string;
  fee: number;
  paidAmount: number;
  billingMethod: string;
  hourlyRate: number;
  totalHours: number;
  billableAmount: number;
  documents: number;
  commentsCount: number;
  tasksCount: number;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  lastUpdate: string;
  notes?: string;
}

export interface CaseDocumentInterface {
  id: string;
  caseId: string;
  name: string;
  size: string;
  fileSize: number;
  date: string;
  versions: number;
  status: DocumentStatusEnum;
  fileUrl: string;
  mimeType: string;
  type: string;
  category: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  lastModified: string;
}

export interface TimelineEventInterface {
  id: string;
  caseId: string;
  eventDate: string;
  title: string;
  description: string;
  eventType: TimelineEventTypeEnum;
  createdAt: string;
  updatedAt: string;
}

export interface CaseTaskInterface {
  id: string;
  caseId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentInterface {
  id: string;
  caseId: string;
  content: string;
  createdBy: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIInsightInterface {
  type: AIInsightTypeEnum;
  title: string;
  description: string;
  priority: AIInsightPriorityEnum;
}

export interface CaseCardInterface {
  id: string;
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
  courtDate?: string;
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

export interface TimeEntryInterface {
  id: string;
  caseId: string;
  taskId?: string;
  userId: string;
  userName: string;
  description: string;
  duration: number;
  hourlyRate: number;
  billableAmount: number;
  isBillable: boolean;
  entryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeEntryInterface {
  description: string;
  duration: number;
  hourlyRate?: number;
  isBillable?: boolean;
  entryDate: string;
  taskId?: string;
}

export interface UpdateTimeEntryInterface {
  description?: string;
  duration?: number;
  hourlyRate?: number;
  isBillable?: boolean;
  entryDate?: string;
}

export interface TimeEntriesListResponse {
  entries: TimeEntryInterface[];
  totalDuration: number;
  totalBillable: number;
}

export interface CasePartyInterface {
  id: string;
  caseId: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  companyName?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateCasePartyInterface {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  companyName?: string;
  notes?: string;
}

export interface UpdateCasePartyInterface {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  notes?: string;
}

export interface ConflictCheckResultInterface {
  matchType: 'client' | 'case_party';
  matchedName: string;
  matchedField: string;
  clientId?: string;
  clientName?: string;
  clientType?: string;
  clientStatus?: string;
  partyId?: string;
  partyRole?: string;
  caseId?: string;
  caseTitle?: string;
  caseStatus?: string;
  caseClientName?: string;
  conflictLevel: 'high' | 'medium' | 'low';
}

export interface ConflictCheckResponseInterface {
  query: string;
  results: ConflictCheckResultInterface[];
  total: number;
}

export interface CreateCaseInterface {
  title: string;
  clientId: string;
  category: string;
  priority: CasePriorityEnum;
  deadline: string;
  courtDate?: string;
  description: string;
  fee: number;
  billingMethod?: string;
  hourlyRate?: number;
  assignedTo?: string;
}

export interface UpdateCaseInterface {
  title?: string;
  status?: CaseStatusEnum;
  priority?: CasePriorityEnum;
  deadline?: string;
  courtDate?: string;
  progress?: number;
  description?: string;
  fee?: number;
  billingMethod?: string;
  hourlyRate?: number;
  assignedTo?: string;
  notes?: string;
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
