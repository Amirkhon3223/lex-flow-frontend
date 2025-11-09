import type { LucideIcon } from 'lucide-react';
import { StatCardVariantEnum } from './dashboard.enums';
import { CasePriorityEnum } from '../cases/cases.enums';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: StatCardVariantEnum;
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
