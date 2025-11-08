import { DocumentChangeTypeEnum, DocumentStatusEnum, DocumentCategoryEnum } from './documents.enums';

export interface DocumentChangeInterface {
  id: number;
  type: DocumentChangeTypeEnum;
  lineNumber: number;
  oldText?: string;
  newText?: string;
}

export interface DocumentVersionInterface {
  version: number;
  date: string;
  author: string;
}

export interface DocumentInterface {
  id: number;
  name: string;
  case: string;
  client: string;
  type: string;
  size: string;
  date: string;
  versions: number;
  status: DocumentStatusEnum;
  category: DocumentCategoryEnum;
  lastModified: string;
  starred: boolean;
}

export interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: 'all' | 'favorite';
  onFilterChange: (filter: 'all' | 'favorite') => void;
}
