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
  description?: string;
}

export interface AddMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface MeetingCardProps {
  title: string;
  client: string;
  clientInitials: string;
  duration: string;
  location: string;
  case?: string;
  type: MeetingTypeEnum;
  status: MeetingStatusEnum;
  priority?: MeetingPriorityEnum;
  statusText: string;
  planned?: boolean;
}
