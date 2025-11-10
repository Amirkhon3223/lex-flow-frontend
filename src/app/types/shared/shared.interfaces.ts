/**
 * @file shared.interfaces.ts
 * @description Интерфейсы для переиспользуемых shared компонентов
 */

import type { LucideIcon } from 'lucide-react';

/**
 * Конфигурация одного фильтра для FilterBar
 */
export interface FilterConfig {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  width?: string;
  icon?: LucideIcon;
  options: Array<{ value: string; label: string }>;
}

/**
 * Конфигурация поиска для FilterBar
 */
export interface SearchConfig {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

/**
 * Пропсы для компонента FilterBar
 */
export interface FilterBarProps {
  searchConfig?: SearchConfig;
  filters: FilterConfig[];
  className?: string;
}

/**
 * Один пункт меню для ActionsMenu
 */
export interface ActionMenuItem {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  separator?: boolean;
}

/**
 * Пропсы для компонента ActionsMenu
 */
export interface ActionsMenuProps {
  items: ActionMenuItem[];
  triggerIcon?: LucideIcon;
  triggerClassName?: string;
}

/**
 * Пропсы для компонента StatCard
 */
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
