import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { CaseTypeDataInterface } from '@/app/types/analytics/analytics.interfaces';
import { Card } from '@/shared/ui/card';

const caseTypeData: CaseTypeDataInterface[] = [
  { name: 'Трудовые споры', value: 35, color: '#3B82F6' },
  { name: 'Договорное право', value: 25, color: '#8B5CF6' },
  { name: 'Наследственные дела', value: 20, color: '#F59E0B' },
  { name: 'Семейное право', value: 15, color: '#10B981' },
  { name: 'Прочее', value: 5, color: '#6B7280' },
];

export function CaseTypesChart() {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
      <div className="p-6">
        <h3 className="text-xl tracking-tight mb-6">Типы дел</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={caseTypeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {caseTypeData.map((entry, index) => (
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
        <div className="space-y-2 mt-4">
          {caseTypeData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-gray-600">{item.name}</span>
              </div>
              <span className="text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
