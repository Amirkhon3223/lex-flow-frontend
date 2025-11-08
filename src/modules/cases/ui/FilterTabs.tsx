import { Button } from '@/shared/ui/button';

interface FilterTabsProps {
  filterStatus: 'all' | 'urgent' | 'medium' | 'completed';
  setFilterStatus: (status: 'all' | 'urgent' | 'medium' | 'completed') => void;
}

export function FilterTabs({ filterStatus, setFilterStatus }: FilterTabsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={filterStatus === 'all' ? 'default' : 'outline'}
        onClick={() => setFilterStatus('all')}
        size="sm"
      >
        Все
      </Button>
      <Button
        variant={filterStatus === 'urgent' ? 'default' : 'outline'}
        onClick={() => setFilterStatus('urgent')}
        size="sm"
      >
        Срочные
      </Button>
      <Button
        variant={filterStatus === 'medium' ? 'default' : 'outline'}
        onClick={() => setFilterStatus('medium')}
        size="sm"
      >
        В работе
      </Button>
      <Button
        variant={filterStatus === 'completed' ? 'default' : 'outline'}
        onClick={() => setFilterStatus('completed')}
        size="sm"
      >
        Завершенные
      </Button>
    </div>
  );
}
