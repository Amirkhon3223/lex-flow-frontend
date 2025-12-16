import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

export function CasesChart() {
  const { t, language } = useI18n();
  const { cases, casesLoading } = useAnalyticsStore();

  const chartData = useMemo(() => {
    if (!cases?.casesByMonth) return [];
    return cases.casesByMonth.map((item) => {
      const monthNum = item.month.split('-')[1];
      const monthName = MONTH_NAMES[language]?.[monthNum] || monthNum;
      return {
        month: monthName,
        cases: item.count,
      };
    });
  }, [cases?.casesByMonth, language]);

  if (casesLoading) {
    return (
      <Card className="lg:col-span-2 flex flex-col h-full">
        <Skeleton className="h-6 w-48 mb-6" />
        <Skeleton className="flex-1 min-h-[300px]" />
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card className="lg:col-span-2 flex flex-col h-full">
        <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
          {t('ANALYTICS.CHARTS.CASE_STATISTICS')}
        </h3>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          {t('COMMON.NO_DATA')}
        </div>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 flex flex-col h-full">
      <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
        {t('ANALYTICS.CHARTS.CASE_STATISTICS')}
      </h3>
      <div className="flex-1 min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
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
            />
            <Bar dataKey="cases" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
