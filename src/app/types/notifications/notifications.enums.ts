export enum NotificationCategory {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum NotificationEventType {
  CASE_DEADLINE = 'case_deadline',
  TASK_DEADLINE = 'task_deadline',
  COURT_DATE = 'court_date',
  NEW_COMMENT = 'new_comment',
  CASE_UPDATE = 'case_update',
  NEW_DOCUMENT = 'new_document',
  NEW_MEETING = 'new_meeting',
  MEETING_UPDATE = 'meeting_update',
  STATUS_UPDATE = 'status_update',
  NEW_TASK = 'new_task',
  TASK_UPDATE = 'task_update',
  TIMELINE_UPDATE = 'timeline_update',
}