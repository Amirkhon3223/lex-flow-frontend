import { Clock, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { useReportsStore } from '@/app/store/reports.store';
import { useAuthStore } from '@/app/store/auth.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';
import { IconContainer } from '@/shared/ui/common/IconContainer';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { formatCurrency } from '@/shared/utils';

export function TimeBillingReport() {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const userCurrency = user?.currency || 'USD';

  const { timeBilling, timeBillingLoading } = useReportsStore();

  if (timeBillingLoading) {
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
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!timeBilling || timeBilling.items.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        {t('REPORTS.NO_DATA')}
      </div>
    );
  }

  const summaryCards = [
    {
      title: t('REPORTS.TIME_BILLING.TOTAL_HOURS'),
      value: timeBilling.totalHours.toFixed(1),
      icon: Clock,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: t('REPORTS.TIME_BILLING.BILLABLE_HOURS'),
      value: timeBilling.totalBillable.toFixed(1),
      icon: Activity,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: t('REPORTS.TIME_BILLING.UTILIZATION'),
      value: `${timeBilling.overallUtilization.toFixed(1)}%`,
      icon: TrendingUp,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: t('REPORTS.TIME_BILLING.REVENUE'),
      value: formatCurrency(timeBilling.totalRevenue, userCurrency),
      icon: DollarSign,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-2 sm:mb-4">
            {t('ANALYTICS.TOP_LAWYERS')}
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">{t('COMMON.NAME')}</TableHead>
                  <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.TIME_BILLING.TOTAL_HOURS')}</TableHead>
                  <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.TIME_BILLING.BILLABLE_HOURS')}</TableHead>
                  <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.TIME_BILLING.UTILIZATION')}</TableHead>
                  <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.TIME_BILLING.REVENUE')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeBilling.items.map((item) => (
                  <TableRow key={item.lawyerId}>
                    <TableCell className="text-xs sm:text-sm font-medium">{item.lawyerName}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-right">{item.totalHours.toFixed(1)}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-right">{item.billableHours.toFixed(1)}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-right">
                      <span className={item.utilizationRate >= 70 ? 'text-green-600' : item.utilizationRate >= 50 ? 'text-amber-600' : 'text-red-600'}>
                        {item.utilizationRate.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-right">{formatCurrency(item.revenue, userCurrency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-2 sm:mb-4">
            {t('ANALYTICS.REVENUE_BY_MONTH')}
          </h3>
          {timeBilling.byMonth.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {timeBilling.byMonth.map((item) => (
                <div key={item.month} className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-muted/50">
                  <span className="text-xs sm:text-sm text-muted-foreground">{item.month}</span>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                    <span>{item.totalHours.toFixed(1)}h</span>
                    <span className="text-green-600">{item.billableHours.toFixed(1)}h</span>
                    <span className="font-medium">{formatCurrency(item.revenue, userCurrency)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">{t('REPORTS.NO_DATA')}</div>
          )}
        </Card>
      </div>
    </div>
  );
}
