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
