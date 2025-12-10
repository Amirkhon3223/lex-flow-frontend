import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { IconContainer } from '@/shared/ui/common/IconContainer';
import { TrendingBadge } from '@/shared/ui/common/TrendingBadge';
import { Progress } from '@/shared/ui/progress';

const casesByStatus = [
  {
    status: 'WON',
    count: 42,
    percentage: 68,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: CheckCircle,
  },
  {
    status: 'IN_PROGRESS',
    count: 15,
    percentage: 24,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: Clock,
  },
  {
    status: 'LOST',
    count: 5,
    percentage: 8,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: XCircle,
  },
];

const casesByPractice = [
  { practice: 'LABOR_DISPUTES', total: 28, won: 24, inProgress: 3, lost: 1 },
  { practice: 'CONTRACT_LAW', total: 18, won: 13, inProgress: 4, lost: 1 },
  { practice: 'INHERITANCE', total: 12, won: 10, inProgress: 2, lost: 0 },
  { practice: 'FAMILY_LAW', total: 10, won: 8, inProgress: 1, lost: 1 },
  { practice: 'OTHER', total: 8, won: 5, inProgress: 2, lost: 1 },
];

export function CasesTabContent() {
  const { t } = useI18n();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {casesByStatus.map((item) => (
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
              {t(`ANALYTICS.CASE_STATUS.${item.status}`)}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
          {t('ANALYTICS.CASES_BY_PRACTICE')}
        </h3>
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          {casesByPractice.map((item) => {
            const winRate = Math.round((item.won / item.total) * 100);
            return (
              <div
                key={item.practice}
                className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-muted/50 hover:bg-muted transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="tracking-tight mb-0.5 sm:mb-2 text-sm sm:text-base truncate">
                      {t(`ANALYTICS.PRACTICE_TYPES.${item.practice}`)}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <span className="text-green-600 dark:text-green-400">
                        {item.won} {t('ANALYTICS.PRACTICE_STATS.WON')}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {item.inProgress} {t('ANALYTICS.PRACTICE_STATS.IN_PROGRESS')}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-red-600 dark:text-red-400">
                        {item.lost} {t('ANALYTICS.PRACTICE_STATS.LOST')}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex sm:block items-center gap-2">
                    <div className="text-lg sm:text-xl md:text-2xl tracking-tight sm:mb-1">
                      {item.total}
                    </div>
                    <TrendingBadge value={`${winRate}%`} variant="success" />
                  </div>
                </div>
                <Progress value={winRate} className="h-1.5 sm:h-2 mt-3" />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
