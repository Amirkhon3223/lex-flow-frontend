import type { CaseFiltersProps } from '@/app/types/cases/cases.interfaces';
import { FilterBar } from '@/shared/components/filters/FilterBar';

export function CaseFilters({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterCategory,
  setFilterCategory,
}: CaseFiltersProps) {
  return (
    <FilterBar
      searchConfig={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: 'Поиск дел...',
        className: 'max-w-md',
      }}
      filters={[
        {
          value: filterStatus,
          onChange: setFilterStatus,
          placeholder: 'Статус',
          width: 'w-[180px]',
          options: [
            { value: 'all', label: 'Все статусы' },
            { value: 'in_progress', label: 'В работе' },
            { value: 'review', label: 'На проверке' },
            { value: 'completed', label: 'Завершено' },
            { value: 'on_hold', label: 'Приостановлено' },
          ],
        },
        {
          value: filterPriority,
          onChange: setFilterPriority,
          placeholder: 'Приоритет',
          width: 'w-[160px]',
          options: [
            { value: 'all', label: 'Все приоритеты' },
            { value: 'high', label: 'Высокий' },
            { value: 'medium', label: 'Средний' },
            { value: 'low', label: 'Низкий' },
          ],
        },
        {
          value: filterCategory,
          onChange: setFilterCategory,
          placeholder: 'Категория',
          width: 'w-[200px]',
          options: [
            { value: 'all', label: 'Все категории' },
            { value: 'Трудовое право', label: 'Трудовое право' },
            { value: 'Договорное право', label: 'Договорное право' },
            { value: 'Наследственное право', label: 'Наследственное право' },
            { value: 'Семейное право', label: 'Семейное право' },
            { value: 'Защита прав потребителей', label: 'Защита прав потребителей' },
          ],
        },
      ]}
    />
  );
}
