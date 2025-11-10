import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

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
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-3 gap-6">
        {casesByStatus.map((item) => (
          <Card key={item.status} className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} strokeWidth={2} />
                </div>
                <Badge className="bg-gray-100 text-gray-700 border-0">
                  {item.percentage}%
                </Badge>
              </div>
              <div className="text-3xl tracking-tight mb-1">{item.count}</div>
              <div className="text-sm text-gray-500">{item.status}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Cases by Practice Area */}
      <Card className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
        <div className="p-6">
          <h3 className="text-xl tracking-tight mb-6">Дела по практикам</h3>
          <div className="space-y-5">
            {casesByPractice.map((item) => {
              const winRate = Math.round((item.won / item.total) * 100);
              return (
                <div key={item.practice} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="tracking-tight mb-1">{item.practice}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="text-green-600">{item.won} выиграно</span>
                        <span>•</span>
                        <span className="text-blue-600">{item.inProgress} в процессе</span>
                        <span>•</span>
                        <span className="text-red-600">{item.lost} проиграно</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl tracking-tight mb-1">{item.total}</div>
                      <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" strokeWidth={2} />
                        {winRate}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={winRate} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
