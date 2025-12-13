import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAnalyticsStore } from '@/app/store/analytics.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

const MONTH_NAMES: Record<string, Record<string, string>> = {
  ru: {
    '01': 'Янв',
    '02': 'Фев',
    '03': 'Мар',
    '04': 'Апр',
    '05': 'Май',
    '06': 'Июн',
    '07': 'Июл',
    '08': 'Авг',
    '09': 'Сен',
    '10': 'Окт',
    '11': 'Ноя',
    '12': 'Дек',
  },
  en: {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
  },
  tj: {
    '01': 'Янв',
    '02': 'Фев',
    '03': 'Мар',
    '04': 'Апр',
    '05': 'Май',
    '06': 'Июн',
    '07': 'Июл',
    '08': 'Авг',
    '09': 'Сен',
    '10': 'Окт',
    '11': 'Ноя',
    '12': 'Дек',
  },
};

export function RevenueChart() {
  const { t, language } = useI18n();
  const { finance, financeLoading } = useAnalyticsStore();

  const chartData = useMemo(() => {
    if (!finance?.revenueByMonth) return [];
    return finance.revenueByMonth.map((item) => {
      const monthNum = item.month.split('-')[1];
      const monthName = MONTH_NAMES[language]?.[monthNum] || monthNum;
      return {
        month: monthName,
        revenue: item.amount,
      };
    });
  }, [finance?.revenueByMonth, language]);

  if (financeLoading) {
    return (
      <Card className="flex flex-col">
        <Skeleton className="h-6 w-48 mb-6" />
        <Skeleton className="h-[250px]" />
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card className="flex flex-col">
        <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
          {t('ANALYTICS.CHARTS.REVENUE_DYNAMICS')}
        </h3>
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          {t('COMMON.NO_DATA')}
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
        {t('ANALYTICS.CHARTS.REVENUE_DYNAMICS')}
      </h3>
      <ResponsiveContainer width="100%" height={250} className="sm:!h-[220px] md:!h-[250px]">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number) => `${(value / 1000).toFixed(0)}k ₽`}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            className="sm:[&>line]:!strokeWidth-[2.5px] md:[&>line]:!strokeWidth-[3px]"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
