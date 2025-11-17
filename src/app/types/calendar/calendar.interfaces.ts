import type { ReactNode } from "react";
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

export interface CalendarHeaderProps {
  viewMode: 'calendar' | 'list';
  setViewMode: (mode: 'calendar' | 'list') => void;
  onAddMeeting: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterClient: string;
  setFilterClient: (client: string) => void;
  uniqueClients: string[];
}

export interface CalendarWidgetProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  meetingDates: Date[];
  meetings: MeetingInterface[];
}


export interface MeetingsListProps {
  meetings: MeetingInterface[];
  getMeetingTypeIcon: (type: MeetingInterface['type']) => ReactNode;
  getMeetingTypeColor: (type: MeetingInterface['type']) => string;
  getPriorityColor: (priority?: MeetingInterface['priority']) => string;
}

export interface SelectedDateMeetingsProps {
  date: Date | undefined;
  meetings: MeetingInterface[];
  getMeetingTypeIcon: (type: MeetingInterface['type']) => ReactNode;
  getMeetingTypeColor: (type: MeetingInterface['type']) => string;
  getPriorityColor: (priority?: MeetingInterface['priority']) => string;
}

export interface TodayCardProps {
  meetingsCount: number;
}

export interface UpcomingMeetingsProps {
  meetings: MeetingInterface[];
  onSelectDate: (date: Date) => void;
}

export interface ViewToggleProps {
  viewMode: 'calendar' | 'list';
  onViewChange: (mode: 'calendar' | 'list') => void;
}

export interface DateBlockProps {
  date: Date;
  time?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface MeetingBadgesProps {
  type: MeetingInterface['type'];
  priority?: MeetingInterface['priority'];
  status: MeetingInterface['status'];
}

export interface InfoBlockProps {
  icon: ReactNode;
  iconBgColor: string;
  label: string;
  value: string;
}

export interface ParticipantItemProps {
  name: string;
  role?: string;
}

export interface EmptyStateProps {
  icon: ReactNode;
  message: string;
  size?: 'sm' | 'md';
}

export interface QuickActionsCardProps {
  onComplete: () => void;
  onReschedule: () => void;
  onCancel: () => void;
}
