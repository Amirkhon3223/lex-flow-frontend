export interface CaseStatDataInterface {
  month: string;
  cases: number;
  won: number;
  lost: number;
  pending: number;
}

export interface RevenueDataInterface {
  month: string;
  revenue: number;
}

export interface CaseTypeDataInterface {
  name: string;
  value: number;
  color: string;
}

export interface LawyerStatsInterface {
  name: string;
  cases: number;
  winRate: number;
  revenue: number;
}

export interface StatsCardInterface {
  title: string;
  value: string;
  change: string;
  iconBgColor: string;
  iconColor: string;
}

export interface DashboardClientsStats {
  total: number;
  active: number;
  new: number;
}

export interface DashboardCasesStats {
  total: number;
  inProgress: number;
  new: number;
  closed: number;
}

export interface DashboardDocumentsStats {
  total: number;
  uploaded: number;
}

export interface DashboardMeetingsStats {
  today: number;
  thisWeek: number;
  upcoming: number;
}

export interface DashboardRevenueStats {
  total: number;
  thisMonth: number;
}

export interface DashboardStatsResponse {
  clients: DashboardClientsStats;
  cases: DashboardCasesStats;
  documents: DashboardDocumentsStats;
  meetings: DashboardMeetingsStats;
  revenue: DashboardRevenueStats;
}

export interface CasesByStatus {
  new: number;
  in_progress: number;
  waiting: number;
  closed: number;
  won: number;
  lost: number;
  settled: number;
}

export interface CasesByPriority {
  low: number;
  medium: number;
  high: number;
}

export interface CasesByCategory {
  civil: number;
  criminal: number;
  administrative: number;
}

export interface CaseMonthlyTrend {
  month: string;
  created: number;
  closed: number;
}

export interface CaseAnalyticsResponse {
  total: number;
  byStatus: CasesByStatus;
  byPriority: CasesByPriority;
  byCategory: CasesByCategory;
  avgProgress: number;
  monthlyTrend: CaseMonthlyTrend[];
}

export interface ClientsByType {
  individual: number;
  legal: number;
  company: number;
  entrepreneur: number;
}

export interface ClientsByCategory {
  standard: number;
  premium: number;
  vip: number;
}

export interface ClientsByStatus {
  active: number;
  inactive: number;
  pending: number;
}

export interface ClientMonthlyTrend {
  month: string;
  new: number;
  revenue: number;
}

export interface ClientAnalyticsResponse {
  total: number;
  byType: ClientsByType;
  byCategory: ClientsByCategory;
  byStatus: ClientsByStatus;
  totalRevenue: number;
  avgRevenue: number;
  monthlyTrend: ClientMonthlyTrend[];
}

export interface DocumentsByCategory {
  legal: number;
  contract: number;
  administrative: number;
}

export interface DocumentsByStatus {
  draft: number;
  review: number;
  final: number;
}

export interface DocumentMonthlyTrend {
  month: string;
  uploaded: number;
}

export interface DocumentAnalyticsResponse {
  total: number;
  byCategory: DocumentsByCategory;
  byStatus: DocumentsByStatus;
  totalSize: number;
  avgSize: number;
  monthlyTrend: DocumentMonthlyTrend[];
}

export interface MeetingsByType {
  in_person: number;
  video: number;
  phone: number;
}

export interface MeetingsByStatus {
  scheduled: number;
  completed: number;
  cancelled: number;
}

export interface MeetingsByPriority {
  low: number;
  medium: number;
  high: number;
}

export interface MeetingMonthlyTrend {
  month: string;
  total: number;
  completed: number;
}

export interface MeetingAnalyticsResponse {
  total: number;
  byType: MeetingsByType;
  byStatus: MeetingsByStatus;
  byPriority: MeetingsByPriority;
  thisWeek: number;
  thisMonth: number;
  monthlyTrend: MeetingMonthlyTrend[];
}
