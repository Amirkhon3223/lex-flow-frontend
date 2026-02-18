import { CalendarCheck, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useReportsStore } from '@/app/store/reports.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';
import { IconContainer } from '@/shared/ui/common/IconContainer';
import { Skeleton } from '@/shared/ui/skeleton';

export function DeadlineComplianceReport() {
  const { t } = useI18n();

  const { deadlineCompliance, deadlineComplianceLoading } = useReportsStore();

  if (deadlineComplianceLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-10 w-10 rounded-lg mb-4" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </Card>
          ))}
        </div>
        <Card>
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!deadlineCompliance || deadlineCompliance.byCategory.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        {t('REPORTS.NO_DATA')}
      </div>
    );
  }

  const summaryCards = [
    {
      title: t('REPORTS.DEADLINE.TOTAL'),
      value: String(deadlineCompliance.totalDeadlines),
      icon: CalendarCheck,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: t('REPORTS.DEADLINE.ON_TIME'),
      value: String(deadlineCompliance.totalOnTime),
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: t('REPORTS.DEADLINE.OVERDUE'),
      value: String(deadlineCompliance.totalOverdue),
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      title: t('REPORTS.DEADLINE.COMPLIANCE'),
      value: `${deadlineCompliance.overallCompliance.toFixed(1)}%`,
      icon: Clock,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {summaryCards.map((stat) => (
          <Card key={stat.title}>
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <IconContainer icon={stat.icon} bgColor={stat.bgColor} iconColor={stat.iconColor} />
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-0.5 sm:mb-1">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">{stat.title}</div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-4 sm:mb-6">
          {t('REPORTS.DEADLINE.COMPLIANCE')}
        </h3>
        <div className="space-y-4 sm:space-y-5">
          {deadlineCompliance.byCategory.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium">{item.category}</span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-green-600">{item.onTime} {t('REPORTS.DEADLINE.ON_TIME').toLowerCase()}</span>
                  <span className="text-red-600">{item.overdue} {t('REPORTS.DEADLINE.OVERDUE').toLowerCase()}</span>
                  <span className="font-medium">{item.complianceRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="relative h-2 sm:h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${item.complianceRate}%` }}
                />
                <div
                  className="absolute top-0 h-full bg-red-500 rounded-full transition-all"
                  style={{
                    left: `${item.complianceRate}%`,
                    width: `${100 - item.complianceRate}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
