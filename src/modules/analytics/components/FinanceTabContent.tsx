import { useMemo } from 'react';
import { DollarSign, CreditCard, FileText, Calendar } from 'lucide-react';
import { useAnalyticsStore } from '@/app/store/analytics.store';
import { useAuthStore } from '@/app/store/auth.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';
import { IconContainer } from '@/shared/ui/common/IconContainer';
import { Skeleton } from '@/shared/ui/skeleton';
import { getMedalGradient } from '@/shared/utils/styleHelpers';
import { formatCurrency } from '@/shared/utils';

const MONTH_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-amber-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-violet-500',
  'bg-orange-500',
  'bg-emerald-500',
];

const MONTH_NAMES: Record<string, Record<string, string>> = {
  ru: {
    '01': 'Январь',
    '02': 'Февраль',
    '03': 'Март',
    '04': 'Апрель',
    '05': 'Май',
    '06': 'Июнь',
    '07': 'Июль',
    '08': 'Август',
    '09': 'Сентябрь',
    '10': 'Октябрь',
    '11': 'Ноябрь',
    '12': 'Декабрь',
  },
  en: {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
  },
  tj: {
    '01': 'Январ',
    '02': 'Феврал',
    '03': 'Март',
    '04': 'Апрел',
    '05': 'Май',
    '06': 'Июн',
    '07': 'Июл',
    '08': 'Август',
    '09': 'Сентябр',
    '10': 'Октябр',
    '11': 'Ноябр',
    '12': 'Декабр',
  },
};

export function FinanceTabContent() {
  const { t, language } = useI18n();
  const { user } = useAuthStore();
  const userCurrency = user?.currency || 'USD';

  const {
    clients,
    clientsLoading,
    documents,
    documentsLoading,
    meetings,
    meetingsLoading,
    finance,
    financeLoading,
  } = useAnalyticsStore();

  const isLoading = clientsLoading || documentsLoading || meetingsLoading || financeLoading;

  const revenueByMonth = useMemo(() => {
    if (!finance?.revenueByMonth) return [];

    const totalRevenue = finance.revenueByMonth.reduce((sum, item) => sum + item.amount, 0);
    if (totalRevenue === 0) return [];

    return finance.revenueByMonth.map((item, index) => {
      const monthNum = item.month.split('-')[1];
      const monthName = MONTH_NAMES[language]?.[monthNum] || monthNum;
      const percentage = Math.round((item.amount / totalRevenue) * 100);

      return {
        month: monthName,
        amount: item.amount,
        percentage,
        color: MONTH_COLORS[index % MONTH_COLORS.length],
      };
    });
  }, [finance?.revenueByMonth, language]);

  const totalRevenue = finance?.totalRevenue || 0;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round(bytes / Math.pow(k, i))} ${sizes[i]}`;
  };

  const paymentStats = [
    {
      title: 'TOTAL_DOCUMENTS',
      value: String(documents?.totalDocuments || 0),
      icon: FileText,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'DOCUMENTS_SIZE',
      value: formatFileSize(documents?.totalSize || 0),
      icon: DollarSign,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'COMPLETED_MEETINGS',
      value: String(meetings?.completedCount || 0),
      icon: CreditCard,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'UPCOMING_MEETINGS',
      value: String(meetings?.upcomingCount || 0),
      icon: Calendar,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  const topClients = clients?.topClients || [];

  if (isLoading) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </Card>
          <Card>
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {paymentStats.map((stat) => (
          <Card key={stat.title}>
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <IconContainer icon={stat.icon} bgColor={stat.bgColor} iconColor={stat.iconColor} />
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-0.5 sm:mb-1">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {t(`ANALYTICS.FINANCE_STATS.${stat.title}`)}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-2 sm:mb-2 md:mb-4">
              {t('ANALYTICS.REVENUE_BY_MONTH')}
            </h3>
            {revenueByMonth.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {revenueByMonth.map((item) => (
                  <div key={item.month} className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground truncate mr-2">{item.month}</span>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <span className="text-foreground font-medium">
                          {formatCurrency(item.amount / 1000, userCurrency)}K
                        </span>
                        <span className="text-muted-foreground">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="relative h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full ${item.color} transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-3 sm:pt-4 border-t border-border flex items-center justify-between">
                  <span className="font-medium text-sm sm:text-base">{t('COMMON.TOTAL')}</span>
                  <span className="text-lg sm:text-xl md:text-2xl tracking-tight">
                    {formatCurrency(totalRevenue / 1000000, userCurrency)}M
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">{t('COMMON.NO_DATA')}</div>
            )}
          </div>
        </Card>

        <Card>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-2 sm:mb-2 md:mb-4">
              {t('ANALYTICS.TOP_CLIENTS')}
            </h3>
            {topClients.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {topClients.slice(0, 5).map((client, index) => (
                  <div
                    key={client.id}
                    className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-muted/50 hover:bg-muted transition-all"
                  >
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg flex items-center justify-center text-white font-medium text-xs sm:text-sm flex-shrink-0 ${getMedalGradient(index)}`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="tracking-tight text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">
                        {client.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {client.casesCount} {t('COMMON.CASES')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {t(`CLIENT.TYPE.${client.type.toUpperCase()}`)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">{t('COMMON.NO_DATA')}</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
