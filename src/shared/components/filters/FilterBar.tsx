/**
 * @file FilterBar.tsx
 * @description Универсальный компонент фильтрации с поиском и множественными Select фильтрами
 *
 * ИСПОЛЬЗОВАНИЕ:
 * - Используется во всех модулях где есть поиск + фильтры (Cases, Clients, Calendar)
 * - Заменяет дублирующийся код с SearchBar + N Select компонентов
 *
 * ОСОБЕННОСТИ:
 * - Configurable filters через массив FilterConfig
 * - Опциональный SearchBar
 * - Единый стиль для всех модулей
 * - Поддержка иконок в фильтрах
 */

import { Filter } from 'lucide-react';
import type { FilterBarProps } from '@/app/types/shared/shared.interfaces';
import { SearchBar } from '@/shared/ui/search-bar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

export function FilterBar({ searchConfig, filters, className = '' }: FilterBarProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {searchConfig && (
        <SearchBar
          value={searchConfig.value}
          onChange={searchConfig.onChange}
          placeholder={searchConfig.placeholder}
          className={searchConfig.className || 'flex-1 max-w-md'}
        />
      )}

      {filters.map((filter, index) => (
        <Select key={index} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger className={`${filter.width || 'w-[180px]'} h-10 rounded-xl border-gray-200`}>
            {filter.icon ? (
              <filter.icon className="w-4 h-4 mr-2" strokeWidth={2} />
            ) : (
              <Filter className="w-4 h-4 mr-2" strokeWidth={2} />
            )}
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
