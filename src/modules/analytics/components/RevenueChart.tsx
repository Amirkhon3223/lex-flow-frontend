import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueDataInterface } from '@/app/types/analytics/analytics.interfaces';
import { Card } from '@/shared/ui/card';

const revenueData: RevenueDataInterface[] = [
  { month: 'Янв', revenue: 450000 },
  { month: 'Фев', revenue: 520000 },
  { month: 'Мар', revenue: 680000 },
  { month: 'Апр', revenue: 590000 },
  { month: 'Май', revenue: 750000 },
  { month: 'Июн', revenue: 820000 },
];

export function RevenueChart() {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2">
      <div className="p-3 sm:p-4 md:p-6">
        <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">Динамика дохода</h3>
        <ResponsiveContainer width="100%" height={180} className="sm:!h-[220px] md:!h-[250px]">
          <LineChart data={revenueData}>
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
      </div>
    </Card>
  );
}
