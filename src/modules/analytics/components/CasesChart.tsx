import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CaseStatDataInterface } from '@/app/types/analytics/analytics.interfaces';
import { Card } from '@/shared/ui/card';

const casesData: CaseStatDataInterface[] = [
  { month: 'Янв', cases: 12, won: 8, lost: 2, pending: 2 },
  { month: 'Фев', cases: 15, won: 10, lost: 3, pending: 2 },
  { month: 'Мар', cases: 18, won: 12, lost: 4, pending: 2 },
  { month: 'Апр', cases: 14, won: 9, lost: 3, pending: 2 },
  { month: 'Май', cases: 20, won: 14, lost: 4, pending: 2 },
  { month: 'Июн', cases: 22, won: 16, lost: 4, pending: 2 },
];

export function CasesChart() {
  return (
    <Card className="md:col-span-2">
      <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">Статистика дел</h3>
        <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px] md:!h-[300px]">
          <BarChart data={casesData}>
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
            <Bar dataKey="won" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lost" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
    </Card>
  );
}
