import type { CaseFiltersProps } from '@/app/types/cases/cases.interfaces';
import { FilterBar } from '@/shared/components/filters/FilterBar';
import { useI18n } from '@/shared/context/I18nContext';

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
  const { t } = useI18n();
  return (
    <FilterBar
      searchConfig={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: t('CASES.SEARCH_PLACEHOLDER'),
        className: 'max-w-md',
      }}
      filters={[
        {
          value: filterStatus,
          onChange: setFilterStatus,
          placeholder: t('COMMON.STATUS.STATUS'),
          width: 'w-[180px]',
          options: [
            { value: 'all', label: t('CASES.FILTERS.ALL_STATUSES') },
            { value: 'in_progress', label: t('COMMON.STATUS.IN_PROGRESS') },
            { value: 'review', label: t('COMMON.STATUS.REVIEW') },
            { value: 'completed', label: t('COMMON.STATUS.COMPLETED') },
            { value: 'on_hold', label: t('COMMON.STATUS.ON_HOLD') },
          ],
        },
        {
          value: filterPriority,
          onChange: setFilterPriority,
          placeholder: t('COMMON.PRIORITY.PRIORITY'),
          width: 'w-[160px]',
          options: [
            { value: 'all', label: t('CASES.FILTERS.ALL_PRIORITIES') },
            { value: 'high', label: t('COMMON.PRIORITY.HIGH') },
            { value: 'medium', label: t('COMMON.PRIORITY.MEDIUM') },
            { value: 'low', label: t('COMMON.PRIORITY.LOW') },
          ],
        },
        {
          value: filterCategory,
          onChange: setFilterCategory,
          placeholder: t('CASES.FIELDS.CATEGORY'),
          width: 'w-[200px]',
          options: [
            { value: 'all', label: t('CASES.FILTERS.ALL_CATEGORIES') },
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
