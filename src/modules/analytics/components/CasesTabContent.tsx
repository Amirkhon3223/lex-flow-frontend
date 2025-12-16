import { useMemo } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAnalyticsStore } from '@/app/store/analytics.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { IconContainer } from '@/shared/ui/common/IconContainer';
import { Progress } from '@/shared/ui/progress';
import { Skeleton } from '@/shared/ui/skeleton';

const STATUS_CONFIG: Record<
  string,
  {
    color: string;
    bgColor: string;
    icon: typeof CheckCircle;
  }
> = {
  completed: {
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: CheckCircle,
  },
  in_progress: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: Clock,
  },
  pending: {
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    icon: Clock,
  },
  closed: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    icon: XCircle,
  },
  cancelled: {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: XCircle,
  },
};

export function CasesTabContent() {
  const { t } = useI18n();
  const { cases, casesLoading } = useAnalyticsStore();

  const statusCards = useMemo(() => {
    if (!cases?.byStatus) return [];

    const total = Object.values(cases.byStatus).reduce((sum, count) => sum + count, 0);
    if (total === 0) return [];

    return Object.entries(cases.byStatus).map(([status, count]) => {
      const percentage = Math.round((count / total) * 100);
      const config = STATUS_CONFIG[status.toLowerCase()] || STATUS_CONFIG.in_progress;

      return {
        status,
        count,
        percentage,
        ...config,
      };
    });
  }, [cases?.byStatus]);

  const categoryData = useMemo(() => {
    if (!cases?.byCategory) return [];

    return Object.entries(cases.byCategory).map(([category, total]) => ({
      category,
      total,
    }));
  }, [cases?.byCategory]);

  if (casesLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => (
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
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {statusCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {statusCards.map((item) => (
            <Card key={item.status}>
              <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                <IconContainer icon={item.icon} bgColor={item.bgColor} iconColor={item.color} />
                <Badge className="bg-muted text-muted-foreground border-0 text-xs">
                  {item.percentage}%
                </Badge>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-0.5 sm:mb-1">
                {item.count}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {t(`CASE.STATUS.${item.status.toUpperCase()}`)}
              </div>
            </Card>
          ))}
        </div>
      )}

      {categoryData.length > 0 && (
        <Card>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
            {t('ANALYTICS.CASES_BY_CATEGORY')}
          </h3>
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {categoryData.map((item) => {
              const totalCases = categoryData.reduce((sum, cat) => sum + cat.total, 0);
              const percentage = totalCases > 0 ? Math.round((item.total / totalCases) * 100) : 0;

              return (
                <div
                  key={item.category}
                  className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-muted/50 hover:bg-muted transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="tracking-tight mb-0.5 sm:mb-2 text-sm sm:text-base truncate">
                        {t(`CASE.CATEGORY.${item.category.toUpperCase()}`)}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span>{t('COMMON.TOTAL')}: {item.total}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex sm:block items-center gap-2">
                      <div className="text-lg sm:text-xl md:text-2xl tracking-tight sm:mb-1">
                        {item.total}
                      </div>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-1.5 sm:h-2 mt-3" />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {statusCards.length === 0 && categoryData.length === 0 && (
        <Card>
          <div className="text-center py-12 text-muted-foreground">{t('COMMON.NO_DATA')}</div>
        </Card>
      )}
    </div>
  );
}
