export enum CaseStatusEnum {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  WAITING = 'waiting',
  CLOSED = 'closed',
  WON = 'won',
  LOST = 'lost',
  SETTLED = 'settled',
}

export enum CasePriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
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
