import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { CaseTypeData } from "@/app/types/cases/cases.interfaces.ts";
import { Card } from '@/shared/ui/card';

const caseTypeData: CaseTypeData[] = [
  { name: 'Трудовые споры', value: 35, color: '#3B82F6' },
  { name: 'Договорное право', value: 25, color: '#8B5CF6' },
  { name: 'Наследственные дела', value: 20, color: '#F59E0B' },
  { name: 'Семейное право', value: 15, color: '#10B981' },
  { name: 'Прочее', value: 5, color: '#6B7280' },
];

export function CaseTypesChart() {
  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">Типы дел</h3>
      <div className="flex-1 min-h-[150px] sm:min-h-[180px] md:min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={caseTypeData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
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
      </div>
      <div className="space-y-1.5 sm:space-y-2 mt-3 sm:mt-4">
        {caseTypeData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
              <span className="text-gray-600 truncate">{item.name}</span>
            </div>
            <span className="text-gray-900 flex-shrink-0">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
