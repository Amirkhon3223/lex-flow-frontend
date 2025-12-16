import {
  DocumentChangeTypeEnum,
  DocumentStatusEnum,
  DocumentCategoryEnum,
} from './documents.enums';
import type { Pagination } from '../api/api.types';

export interface DocumentChangeInterface {
  id: number;
  type: DocumentChangeTypeEnum;
  lineNumber: number;
  oldText?: string;
  newText?: string;
}

export interface DocumentVersionInterface {
  id: string;
  documentId: string;
  versionNumber: number;
  originalFileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  isCurrent: boolean;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
  authorName: string;
  version?: number;
}

export interface DocumentInterface {
  id: string;
  name: string;
  originalFileName: string;
  caseId: string | null;
  caseName: string | null;
  clientId: string | null;
  clientName: string | null;
  type: string;
  category: DocumentCategoryEnum;
  status: DocumentStatusEnum;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  versionsCount: number;
  notes: string | null;
  starred: boolean;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: 'all' | 'favorite';
  onFilterChange: (filter: 'all' | 'favorite') => void;
}

export interface DocumentCardProps {
  id: string;
  title: string;
  case: string;
  author: string;
  type: string;
  size: string;
  date: string;
  versions: number;
  status: DocumentStatusEnum;
  statusText: string;
  favorite: boolean;
}

export interface StatusBadgeProps {
  status: DocumentStatusEnum;
}

export interface UploadDocumentFormData {
  name: string;
  case: string;
  type: string;
  status?: string;
  notes?: string;
  file: File;
}

export interface CreateDocumentInterface {
  name: string;
  originalFileName: string;
  caseId: string;
  clientId: string;
  type: string;
  category: DocumentCategoryEnum;
  status: DocumentStatusEnum;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  notes?: string;
}

export interface UpdateDocumentInterface {
  name?: string;
  status?: DocumentStatusEnum;
  notes?: string;
  starred?: boolean;
}

export interface UploadDocumentResponse {
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  originalFileName: string;
}

export interface DocumentListResponse {
  documents: DocumentInterface[];
  pagination: Pagination;
}

export interface DocumentVersionListResponse {
  versions: DocumentVersionInterface[];
  pagination: Pagination;
}

export interface CreateDocumentVersionInterface {
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  originalFileName: string;
  notes?: string;
}
