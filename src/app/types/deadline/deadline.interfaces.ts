export type DeadlineType = 'procedural' | 'statute_of_limitations' | 'manual';
export type DeadlineStatus = 'pending' | 'completed' | 'overdue' | 'dismissed';
export type Jurisdiction = 'russia' | 'tajikistan' | 'us';

export interface CaseDeadline {
  id: string;
  caseId: string;
  name: string;
  description: string;
  deadlineType: DeadlineType;
  status: DeadlineStatus;
  jurisdiction: string;
  eventType: string;
  eventDate: string | null;
  dueDate: string;
  reminderDays: string;
  notes: string;
  ruleKey: string;
  completedAt: string | null;
  daysRemaining: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeadlineRequest {
  name: string;
  description?: string;
  deadlineType: string;
  jurisdiction?: string;
  dueDate: string;
  reminderDays?: string;
  notes?: string;
}

export interface UpdateDeadlineRequest {
  name?: string;
  description?: string;
  dueDate?: string;
  reminderDays?: string;
  notes?: string;
  status?: string;
}

export interface CalculateProceduralRequest {
  jurisdiction: string;
  eventType: string;
  eventDate: string;
}

export interface CalculateStatuteRequest {
  jurisdiction: string;
  category: string;
  incidentDate: string;
}

export interface DeadlineRule {
  key: string;
  name: string;
  nameEn: string;
  nameTj: string;
  days: number;
  months: number;
  years: number;
  jurisdiction: string;
  category?: string;
}

export interface StatuteInfo {
  rule: DeadlineRule;
  dueDate: string | null;
}
