/**
 * @file templates.types.ts
 * @description TypeScript interfaces and enums for Document Templates feature
 */

export enum TemplateCategoryEnum {
  LAWSUIT = 'lawsuit',
  CONTRACT = 'contract',
  STATEMENT = 'statement',
  LETTER = 'letter',
  POWER_OF_ATTORNEY = 'power_of_attorney',
}

export enum TemplateStatusEnum {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export interface TemplateVariable {
  key: string;
  label: string;
  description?: string;
  defaultValue?: string;
  required?: boolean;
  type: 'text' | 'date' | 'number' | 'select';
  options?: string[];
  group: 'client' | 'case' | 'user' | 'custom';
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategoryEnum;
  status: TemplateStatusEnum;
  content: string;
  variables: string[];
  usageCount: number;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  templateName: string;
  name: string;
  content: string;
  variables: Record<string, string>;
  clientId?: string;
  clientName?: string;
  caseId?: string;
  caseName?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  fileUrl?: string;
  fileSize?: number;
}

export interface CreateTemplateInterface {
  name: string;
  description?: string;
  category: TemplateCategoryEnum;
  content: string;
}

export interface UpdateTemplateInterface {
  name?: string;
  description?: string;
  category?: TemplateCategoryEnum;
  status?: TemplateStatusEnum;
  content?: string;
}

export interface GenerateDocumentInterface {
  templateId: string;
  name: string;
  variables: Record<string, string>;
  clientId?: string;
  caseId?: string;
}

export interface TemplatePreviewInterface {
  content: string;
  variables: Record<string, string>;
}

export interface TemplateListResponse {
  data: DocumentTemplate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GeneratedDocumentListResponse {
  data: GeneratedDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AvailableVariablesResponse {
  client: TemplateVariable[];
  case: TemplateVariable[];
  user: TemplateVariable[];
  custom: TemplateVariable[];
}

// Props interfaces for components
export interface TemplateCardProps {
  template: DocumentTemplate;
  onEdit?: (template: DocumentTemplate) => void;
  onDelete?: (template: DocumentTemplate) => void;
  onGenerate?: (template: DocumentTemplate) => void;
  onPreview?: (template: DocumentTemplate) => void;
}

export interface TemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: DocumentTemplate | null;
  onSuccess?: () => void;
}

export interface TemplatePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: DocumentTemplate | null;
  variables?: Record<string, string>;
}

export interface GenerateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: DocumentTemplate | null;
  onSuccess?: (document: GeneratedDocument) => void;
}

export interface VariableSelectorProps {
  onSelect: (variable: string) => void;
  className?: string;
}
