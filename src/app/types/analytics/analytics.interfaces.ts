export interface MonthlyStats {
  count: number;
  month: string;
}

/* CASES */
export interface RecentCaseItem {
  id: string;
  title: string;
  clientName: string;
  priority: string;
  status: string;
  createdAt: string;
}

export interface CaseAnalyticsResponse {
  averageProgress: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  byStatus: Record<string, number>;
  casesByMonth: MonthlyStats[];
  recentCases: RecentCaseItem[];
  totalCases: number;
}

/* CLIENTS */
export interface TopClientItem {
  id: string;
  name: string;
  category: string;
  type: string;
  casesCount: number;
}

export interface ClientAnalyticsResponse {
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  clientsByMonth: MonthlyStats[];
  topClients: TopClientItem[];
  totalClients: number;
}

/* DOCUMENTS */
export interface RecentDocumentItem {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  createdAt: string;
  fileSize: number;
}

export interface DocumentAnalyticsResponse {
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  documentsByMonth: MonthlyStats[];
  recentDocuments: RecentDocumentItem[];
  totalDocuments: number;
  totalSize: number;
}

/* MEETINGS */
export interface RecentMeetingItem {
  id: string;
  title: string;
  clientName: string;
  date: string;
  type: string;
  status: string;
}

export interface MeetingAnalyticsResponse {
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  completedCount: number;
  meetingsByMonth: MonthlyStats[];
  recentMeetings: RecentMeetingItem[];
  totalMeetings: number;
  upcomingCount: number;
}

/* DASHBOARD */
export interface ActivityItem {
  timestamp: string;
  title: string;
  type: string;
  userName: string;
}

export interface DashboardTrends {
  activeCases: string; // "+8%" or "-3%"
  clients: string; // "+12%"
  documents: string; // "+23%"
}

export interface DashboardStatsResponse {
  activeCases: number;
  closedCases: number;
  totalCases: number;
  totalClients: number;
  totalDocuments: number;
  totalMeetings: number;
  upcomingMeetings: number;
  trends: DashboardTrends;
  tasksToday: number;
  recentActivity: ActivityItem[];
}

/* FINANCE */
export interface MonthlyRevenueStats {
  month: string;
  amount: number;
}

export interface FinanceAnalyticsResponse {
  revenueByMonth: MonthlyRevenueStats[];
  totalRevenue: number;
  avgRevenuePerCase: number;
  avgRevenuePerClient: number;
}

/* TEAM */
export interface LawyerStats {
  id: string;
  name: string;
  casesCount: number;
  wonCases: number;
  revenue: number;
}

export interface TeamAnalyticsResponse {
  lawyers: LawyerStats[];
}
