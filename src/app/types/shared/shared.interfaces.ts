
import type { LucideIcon } from 'lucide-react';

export interface FilterConfig {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  width?: string;
  icon?: LucideIcon;
  options: Array<{ value: string; label: string }>;
}

export interface SearchConfig {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export interface FilterBarProps {
  searchConfig?: SearchConfig;
  filters: FilterConfig[];
  className?: string;
}

export interface ActionMenuItem {
  icon: LucideIcon;
  label: string;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: 'default' | 'danger';
  separator?: boolean;
}

export interface ActionsMenuProps {
  items: ActionMenuItem[];
  triggerIcon?: LucideIcon;
  triggerClassName?: string;
}

export interface StatCardProps {
  label?: string;
  title?: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  valueColor?: string;
  variant?: 'default' | 'urgent';
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
}
