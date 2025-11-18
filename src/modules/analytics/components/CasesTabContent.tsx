import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { IconContainer } from '@/shared/ui/common/IconContainer';
import { TrendingBadge } from '@/shared/ui/common/TrendingBadge';

const casesByStatus = [
  { status: 'Выиграно', count: 42, percentage: 68, color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle },
  { status: 'В процессе', count: 15, percentage: 24, color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Clock },
  { status: 'Проиграно', count: 5, percentage: 8, color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle },
];

const casesByPractice = [
  { practice: 'Трудовые споры', total: 28, won: 24, inProgress: 3, lost: 1 },
  { practice: 'Договорное право', total: 18, won: 13, inProgress: 4, lost: 1 },
  { practice: 'Наследственные дела', total: 12, won: 10, inProgress: 2, lost: 0 },
  { practice: 'Семейное право', total: 10, won: 8, inProgress: 1, lost: 1 },
  { practice: 'Прочее', total: 8, won: 5, inProgress: 2, lost: 1 },
];

export function CasesTabContent() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {casesByStatus.map((item) => (
          <Card key={item.status}>
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <IconContainer icon={item.icon} bgColor={item.bgColor} iconColor={item.color}/>
              <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
                {item.percentage}%
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-0.5 sm:mb-1">{item.count}</div>
            <div className="text-xs sm:text-sm text-gray-500">{item.status}</div>
          </Card>
        ))}
      </div>

      {/* Cases by Practice Area */}
      <Card>
        <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">Дела по практикам</h3>
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          {casesByPractice.map((item) => {
            const winRate = Math.round((item.won / item.total) * 100);
            return (
              <div key={item.practice}
                   className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="tracking-tight mb-0.5 sm:mb-2 text-sm sm:text-base truncate">{item.practice}</h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                      <span className="text-green-600">{item.won} выиграно</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-blue-600">{item.inProgress} в процессе</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-red-600">{item.lost} проиграно</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex sm:block items-center gap-2">
                    <div className="text-lg sm:text-xl md:text-2xl tracking-tight sm:mb-1">{item.total}</div>
                    <TrendingBadge value={`${winRate}%`} variant="success"/>
                  </div>
                </div>
                <Progress value={winRate} className="h-1.5 sm:h-2"/>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
