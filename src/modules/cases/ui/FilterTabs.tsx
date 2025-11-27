import type { FilterTabsProps } from '@/app/types/cases/cases.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';

export function FilterTabs({ filterStatus, setFilterStatus }: FilterTabsProps) {
  const { t } = useI18n();

  return (
    <div className="flex gap-2">
      <Button
        variant={filterStatus === 'all' ? 'default' : 'outline'}
        onClick={() => setFilterStatus('all')}
        size="sm"
      >
        {t('CASES.FILTERS.ALL')}
      </Button>
      <Button
        variant={filterStatus === 'urgent' ? 'default' : 'outline'}
        onClick={() => setFilterStatus('urgent')}
        size="sm"
      >
        {t('CASES.FILTERS.URGENT')}
      </Button>
      <Button
        variant={filterStatus === 'medium' ? 'default' : 'outline'}
        onClick={() => setFilterStatus('medium')}
        size="sm"
      >
        {t('CASES.FILTERS.MEDIUM')}
      </Button>
      <Button
        variant={filterStatus === 'completed' ? 'default' : 'outline'}
        onClick={() => setFilterStatus('completed')}
        size="sm"
      >
        {t('CASES.FILTERS.COMPLETED')}
      </Button>
    </div>
  );
}
