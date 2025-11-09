export enum CaseStatusEnum {
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
}

export enum CasePriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum DocumentStatusEnum {
  DRAFT = 'draft',
  REVIEW = 'review',
  FINAL = 'final',
}

export enum TimelineEventTypeEnum {
  DOCUMENT = 'document',
  MEETING = 'meeting',
  SYSTEM = 'system',
  DEADLINE = 'deadline',
  PAYMENT = 'payment',
}

export enum AIInsightTypeEnum {
  RISK = 'risk',
  OPPORTUNITY = 'opportunity',
  DEADLINE = 'deadline',
}

export enum AIInsightPriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}
