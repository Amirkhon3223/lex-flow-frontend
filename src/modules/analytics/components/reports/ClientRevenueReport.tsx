import { DollarSign, CreditCard, AlertCircle } from 'lucide-react';
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

export function ClientRevenueReport() {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const userCurrency = user?.currency || 'USD';

  const { clientRevenue, clientRevenueLoading } = useReportsStore();

  if (clientRevenueLoading) {
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
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!clientRevenue || clientRevenue.items.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        {t('REPORTS.NO_DATA')}
      </div>
    );
  }

  const summaryCards = [
    {
      title: t('REPORTS.CLIENT_REVENUE.TOTAL_REVENUE'),
      value: formatCurrency(clientRevenue.totalRevenue, userCurrency),
      icon: DollarSign,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: t('REPORTS.CLIENT_REVENUE.PAID'),
      value: formatCurrency(clientRevenue.totalPaid, userCurrency),
      icon: CreditCard,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: t('REPORTS.CLIENT_REVENUE.OUTSTANDING'),
      value: formatCurrency(clientRevenue.totalOutstanding, userCurrency),
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ];

  const sortedItems = [...clientRevenue.items].sort((a, b) => b.totalFees - a.totalFees);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
                <TableHead className="text-xs sm:text-sm">{t('COMMON.NAME')}</TableHead>
                <TableHead className="text-xs sm:text-sm">{t('COMMON.TYPE')}</TableHead>
                <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.CLIENT_REVENUE.CASES')}</TableHead>
                <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.PROFITABILITY.FEE')}</TableHead>
                <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.CLIENT_REVENUE.PAID')}</TableHead>
                <TableHead className="text-xs sm:text-sm text-right">{t('REPORTS.CLIENT_REVENUE.OUTSTANDING')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => (
                <TableRow key={item.clientId}>
                  <TableCell className="text-xs sm:text-sm font-medium">{item.clientName}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-muted-foreground">{item.clientType}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-right">{item.totalCases}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-right">{formatCurrency(item.totalFees, userCurrency)}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-right text-green-600">{formatCurrency(item.paidAmount, userCurrency)}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-right">
                    <span className={item.outstanding > 0 ? 'text-red-600' : 'text-muted-foreground'}>
                      {formatCurrency(item.outstanding, userCurrency)}
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
