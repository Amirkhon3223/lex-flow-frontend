import { MeetingTypeEnum, MeetingStatusEnum, MeetingPriorityEnum } from './calendar.enums';

export interface MeetingClientInterface {
  name: string;
  avatar: string;
}

export interface MeetingInterface {
  id: number;
  title: string;
  client: MeetingClientInterface;
  case?: string;
  date: Date;
  time: string;
  duration: string;
  type: MeetingTypeEnum;
  location?: string;
  participants?: string[];
  status: MeetingStatusEnum;
  priority?: MeetingPriorityEnum;
}
