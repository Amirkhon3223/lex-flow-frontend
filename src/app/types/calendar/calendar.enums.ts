export enum MeetingTypeEnum {
  IN_PERSON = 'in_person',
  VIDEO = 'video',
  PHONE = 'phone',
}

export enum MeetingStatusEnum {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum MeetingPriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum VideoProviderEnum {
  JITSI = 'jitsi',
  GOOGLE_MEET = 'google_meet',
  ZOOM = 'zoom',
  CUSTOM = 'custom',
}
