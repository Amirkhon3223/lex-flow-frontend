import { useReportsStore } from '@/app/store/reports.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';

function getWorkloadColor(activeCases: number): string {
  if (activeCases >= 15) return 'text-red-600';
  if (activeCases >= 8) return 'text-amber-600';
  return 'text-green-600';
}

function getWorkloadBg(activeCases: number): string {
  if (activeCases >= 15) return 'bg-red-50';
  if (activeCases >= 8) return 'bg-amber-50';
  return 'bg-green-50';
}

export function WorkloadReport() {
  const { t } = useI18n();

  const { workload, workloadLoading } = useReportsStore();

  if (workloadLoading) {
    return (
      <Card>
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </Card>
    );
  }

  if (!workload || workload.items.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        {t('REPORTS.NO_DATA')}
      </div>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">{t('COMMON.NAME')}</TableHead>
              <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.WORKLOAD.ACTIVE_CASES')}</TableHead>
              <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.WORKLOAD.TASKS')}</TableHead>
              <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.WORKLOAD.TASK_COMPLETION')}</TableHead>
              <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.WORKLOAD.MEETINGS')}</TableHead>
              <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.WORKLOAD.HOURS')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workload.items.map((item) => (
              <TableRow key={item.lawyerId}>
                <TableCell className="text-xs sm:text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getWorkloadBg(item.activeCases)} ${getWorkloadColor(item.activeCases).replace('text-', 'bg-')}`} />
                    {item.lawyerName}
                  </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm text-right">
                  <span className={getWorkloadColor(item.activeCases)}>
                    {item.activeCases}
                  </span>
                </TableCell>
                <TableCell className="text-xs sm:text-sm text-right">
                  {item.completedTasks}/{item.totalTasks}
                </TableCell>
                <TableCell className="text-xs sm:text-sm text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.taskCompletion >= 80 ? 'bg-green-500' : item.taskCompletion >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.taskCompletion}%` }}
                      />
                    </div>
                    <span>{item.taskCompletion.toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm text-right">{item.meetingsCount}</TableCell>
                <TableCell className="text-xs sm:text-sm text-right">{item.totalHoursLogged.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
