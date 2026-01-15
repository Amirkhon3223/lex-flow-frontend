import type { ReactNode } from 'react';
import { MeetingTypeEnum, MeetingStatusEnum, MeetingPriorityEnum } from './calendar.enums';
import type { Pagination } from '../api/api.types';

export interface MeetingClientInterface {
  name: string;
  avatar: string;
}

export interface MeetingInterface {
  id: string;
  title: string;
  clientId?: string;
  clientName?: string;
  clientAvatar?: string;
  caseId?: string;
  caseName?: string;
  date: string;
  time: string;
  duration: string;
  type: MeetingTypeEnum;
  status: MeetingStatusEnum;
  priority: MeetingPriorityEnum;
  location: string | null;
  videoLink: string | null;
  participants: string | null;
  description: string | null;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting?: MeetingInterface | null;
  onSubmit?: () => void;
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
  getMeetingTypeIcon: (type: MeetingInterface['type'], title?: string) => ReactNode;
  getMeetingTypeColor: (type: MeetingInterface['type']) => string;
  getPriorityColor: (priority?: MeetingInterface['priority']) => string;
}

export interface SelectedDateMeetingsProps {
  date: Date | undefined;
  meetings: MeetingInterface[];
  getMeetingTypeIcon: (type: MeetingInterface['type'], title?: string) => ReactNode;
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

export interface CreateMeetingInterface {
  title: string;
  clientId?: string;
  caseId?: string;
  date: string;
  time: string;
  duration: string;
  type: MeetingTypeEnum;
  priority: MeetingPriorityEnum;
  location?: string;
  videoLink?: string;
  participants?: string;
  description?: string;
  notes?: string;
}

export interface UpdateMeetingInterface {
  title?: string;
  date?: string;
  time?: string;
  duration?: string;
  status?: MeetingStatusEnum;
  priority?: MeetingPriorityEnum;
  location?: string;
  videoLink?: string;
  participants?: string;
  description?: string;
  notes?: string;
}

export interface MeetingListResponse {
  meetings: MeetingInterface[];
  pagination: Pagination;
}

export interface CalendarDayMeeting {
  id: string;
  title: string;
  time: string;
  duration: string;
  clientName: string;
  type: MeetingTypeEnum;
  status: MeetingStatusEnum;
}

export interface CalendarDayResponse {
  date: string;
  meetings: CalendarDayMeeting[];
  totalMeetings: number;
}

export interface CalendarWeekDay {
  date: string;
  meetings: CalendarDayMeeting[];
  totalMeetings: number;
}

export interface CalendarWeekResponse {
  startDate: string;
  endDate: string;
  days: CalendarWeekDay[];
  totalMeetings: number;
}

export interface CalendarMonthDay {
  date: string;
  meetings: MeetingInterface[];
  count: number;
}

export interface CalendarMonthResponse {
  year: number;
  month: number;
  days: CalendarMonthDay[];
  totalMeetings: number;
}

export interface MeetingStatsByType {
  in_person: number;
  video: number;
  phone: number;
}

export interface MeetingStatsByPriority {
  low: number;
  medium: number;
  high: number;
}

export interface MeetingStatsResponse {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  byType: MeetingStatsByType;
  byPriority: MeetingStatsByPriority;
  thisWeek: number;
  thisMonth: number;
}
