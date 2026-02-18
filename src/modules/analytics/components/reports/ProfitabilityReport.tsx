import { DollarSign, TrendingUp, Calculator, Percent } from 'lucide-react';
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

export function ProfitabilityReport() {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const userCurrency = user?.currency || 'USD';

  const { profitability, profitabilityLoading } = useReportsStore();

  if (profitabilityLoading) {
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

  if (!profitability || profitability.items.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        {t('REPORTS.NO_DATA')}
      </div>
    );
  }

  const summaryCards = [
    {
      title: t('REPORTS.PROFITABILITY.TOTAL_FEES'),
      value: formatCurrency(profitability.totalFees, userCurrency),
      icon: DollarSign,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: t('REPORTS.PROFITABILITY.TOTAL_COST'),
      value: formatCurrency(profitability.totalTimeCost, userCurrency),
      icon: Calculator,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      title: t('REPORTS.PROFITABILITY.TOTAL_PROFIT'),
      value: formatCurrency(profitability.totalProfit, userCurrency),
      icon: TrendingUp,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: t('REPORTS.PROFITABILITY.AVG_MARGIN'),
      value: `${profitability.avgProfitMargin.toFixed(1)}%`,
      icon: Percent,
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">{t('CASES.CASE')}</TableHead>
                <TableHead className="text-xs sm:text-sm">{t('CASES.CLIENT')}</TableHead>
                <TableHead className="text-xs sm:text-sm">{t('CASES.CATEGORY')}</TableHead>
                <TableHead className="text-xs sm:text-sm">{t('CASES.STATUS')}</TableHead>
                <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.PROFITABILITY.FEE')}</TableHead>
                <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.PROFITABILITY.TIME_COST')}</TableHead>
                <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.TIME_BILLING.TOTAL_HOURS')}</TableHead>
                <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.PROFITABILITY.PROFIT_MARGIN')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profitability.items.map((item) => (
                <TableRow key={item.caseId}>
                  <TableCell className="text-xs sm:text-sm font-medium">{item.caseTitle}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-muted-foreground">{item.clientName}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{item.category}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{item.status}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-right">{formatCurrency(item.fee, userCurrency)}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-right">{formatCurrency(item.totalTimeCost, userCurrency)}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-right">{item.totalHours.toFixed(1)}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-right">
                    <span className={item.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {item.profitMargin.toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
