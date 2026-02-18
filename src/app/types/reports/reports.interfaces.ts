export interface ReportPeriod {
  startDate: string;
  endDate: string;
}

export interface CaseProfitabilityItem {
  caseId: string;
  caseTitle: string;
  clientName: string;
  category: string;
  status: string;
  fee: number;
  totalTimeCost: number;
  totalHours: number;
  profitMargin: number;
  billingMethod: string;
}

export interface CaseProfitabilityResponse {
  items: CaseProfitabilityItem[];
  totalFees: number;
  totalTimeCost: number;
  totalProfit: number;
  avgProfitMargin: number;
  period: ReportPeriod;
}

export interface TimeBillingItem {
  lawyerId: string;
  lawyerName: string;
  totalHours: number;
  billableHours: number;
  utilizationRate: number;
  revenue: number;
}

export interface MonthlyTimeBilling {
  month: string;
  totalHours: number;
  billableHours: number;
  revenue: number;
}

export interface TimeBillingResponse {
  items: TimeBillingItem[];
  byMonth: MonthlyTimeBilling[];
  totalHours: number;
  totalBillable: number;
  overallUtilization: number;
  totalRevenue: number;
  period: ReportPeriod;
}

export interface DeadlineComplianceItem {
  category: string;
  totalDeadlines: number;
  onTime: number;
  overdue: number;
  complianceRate: number;
}

export interface DeadlineComplianceResponse {
  byCategory: DeadlineComplianceItem[];
  totalDeadlines: number;
  totalOnTime: number;
  totalOverdue: number;
  overallCompliance: number;
  period: ReportPeriod;
}

export interface ClientRevenueItem {
  clientId: string;
  clientName: string;
  clientType: string;
  totalCases: number;
  totalFees: number;
  paidAmount: number;
  outstanding: number;
}

export interface ClientRevenueResponse {
  items: ClientRevenueItem[];
  totalRevenue: number;
  totalPaid: number;
  totalOutstanding: number;
  period: ReportPeriod;
}

export interface WorkloadItem {
  lawyerId: string;
  lawyerName: string;
  activeCases: number;
  totalTasks: number;
  completedTasks: number;
  taskCompletion: number;
  meetingsCount: number;
  totalHoursLogged: number;
}

export interface WorkloadResponse {
  items: WorkloadItem[];
  period: ReportPeriod;
}

export type ReportType = 'profitability' | 'time_billing' | 'deadline_compliance' | 'client_revenue' | 'workload';
export type ExportFormat = 'csv' | 'excel' | 'pdf';
