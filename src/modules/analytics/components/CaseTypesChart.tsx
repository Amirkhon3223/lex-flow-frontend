import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAnalyticsStore } from '@/app/store/analytics.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

const COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#6B7280'];

export function CaseTypesChart() {
  const { t } = useI18n();
  const { cases, casesLoading } = useAnalyticsStore();

  const chartData = useMemo(() => {
    if (!cases?.byCategory) return [];

    const totalCases = Object.values(cases.byCategory).reduce((sum, count) => sum + count, 0);
    if (totalCases === 0) return [];

    return Object.entries(cases.byCategory).map(([name, value], index) => ({
      name,
      value,
      percentage: Math.round((value / totalCases) * 100),
      color: COLORS[index % COLORS.length],
    }));
  }, [cases?.byCategory]);

  if (casesLoading) {
    return (
      <Card className="flex flex-col h-full">
        <Skeleton className="h-6 w-40 mb-6" />
        <Skeleton className="flex-1 min-h-[200px]" />
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card className="flex flex-col h-full">
        <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
          {t('ANALYTICS.CHARTS.CASE_TYPES')}
        </h3>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          {t('COMMON.NO_DATA')}
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
        {t('ANALYTICS.CHARTS.CASE_TYPES')}
      </h3>
      <div className="flex-1 min-h-[150px] sm:min-h-[180px] md:min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1.5 sm:space-y-2 mt-3 sm:mt-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-muted-foreground truncate">
                {t(`CASE.CATEGORY.${item.name.toUpperCase()}`)}
              </span>
            </div>
            <span className="text-foreground flex-shrink-0">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
