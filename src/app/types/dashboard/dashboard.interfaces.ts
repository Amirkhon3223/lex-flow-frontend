
export interface DashboardTrends {
  activeCases: string;
  clients: string;
  documents: string;
}

export interface DashboardStatsData {
  activeCases: number;
  totalCases: number;
  closedCases: number;
  totalClients: number;
  totalDocuments: number;
  totalMeetings: number;
  upcomingMeetings: number;
  trends: DashboardTrends;
  tasksToday: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: string;
  title: string;
  userName: string;
  timestamp: string;
}

export interface PriorityCaseItem {
  id: string;
  title: string;
  client: {
    id: string;
    name: string;
  };
  deadline: string;
  priority: 'high' | 'medium' | 'low' | 'urgent';
  status: string;
  progress?: number;
  category?: string;
  fee?: number;
  documents?: number;
}

export interface PriorityCasesResponse {
  cases: PriorityCaseItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TodayMeetingItem {
  id: string;
  time: string;
  title: string;
  date?: string;
  duration?: string;
  type?: string;
  status?: string;
  client?: {
    id: string;
    name: string;
    avatar?: string;
  };
  videoLink?: string;
  location?: string;
  description?: string;
}

export interface TodayMeetingsResponse {
  meetings: TodayMeetingItem[];
}


export interface CaseItemProps {
  id: number;
  title: string;
  client: string;
  deadline: string;
  status?: 'urgent' | 'completed' | 'medium';
  onClick?: () => void;
}

export interface ActivityItemProps {
  action: string;
  item: string;
  client: string;
  time: string;
  isLast?: boolean;
}

export interface PriorityCaseInterface {
  id: number;
  title: string;
  client: string;
  deadline: string;
  progress: number;
  status: 'urgent' | 'medium' | 'completed';
}

export interface UpcomingEventInterface {
  time: string;
  title: string;
}

export interface RecentActivityInterface {
  action: string;
  item: string;
  client: string;
  time: string;
}
