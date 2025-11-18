import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

const progressStats = [
  { count: 8, label: 'Документов', color: 'bg-blue-100 text-blue-700' },
  { count: 12, label: 'Событий', color: 'bg-purple-100 text-purple-700' },
  { count: 5, label: 'Дней до суда', color: 'bg-orange-100 text-orange-700' },
  { count: 3, label: 'Задачи', color: 'bg-green-100 text-green-700' },
];

export function CaseProgressCard() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg tracking-tight">Прогресс дела</h3>
        <span className="text-xl sm:text-2xl tracking-tight">75%</span>
      </div>
      <Progress value={75} className="h-1.5 sm:h-2 mb-3 sm:mb-4 bg-gray-200 [&>div]:bg-blue-500" />
      <div className="grid grid-cols-4 gap-3 sm:gap-4 text-center">
        {progressStats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <Badge className={`${stat.color} border-0 text-base sm:text-lg px-2.5 sm:px-3 py-1 mb-1.5 sm:mb-2`}>
              {stat.count}
            </Badge>
            <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
