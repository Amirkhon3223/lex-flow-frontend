import { Award } from 'lucide-react';
import type { LawyerStatsInterface } from '@/app/types/analytics/analytics.interfaces';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

const topLawyers: LawyerStatsInterface[] = [
  { name: 'Александр И.', cases: 47, winRate: 89, revenue: 2400000 },
  { name: 'Мария С.', cases: 42, winRate: 86, revenue: 2100000 },
  { name: 'Дмитрий П.', cases: 38, winRate: 82, revenue: 1900000 },
  { name: 'Елена В.', cases: 35, winRate: 91, revenue: 1800000 },
];

export function TeamStats() {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
      <div className="p-6">
        <h3 className="text-xl tracking-tight mb-6">Лучшие юристы</h3>
        <div className="space-y-4">
          {topLawyers.map((lawyer, index) => (
            <div
              key={lawyer.name}
              className="p-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                      : index === 1
                        ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                        : index === 2
                          ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                          : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}
                >
                  {index === 0 && <Award className="w-5 h-5" strokeWidth={2} />}
                  {index !== 0 && <span className="text-lg">#{index + 1}</span>}
                </div>
                <div className="flex-1">
                  <h4 className="tracking-tight mb-1">{lawyer.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{lawyer.cases} дел</span>
                    <span>•</span>
                    <span className="text-green-600">{lawyer.winRate}% успеха</span>
                    <span>•</span>
                    <span>{(lawyer.revenue / 1000000).toFixed(1)}M ₽ дохода</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Процент успеха</span>
                  <span className="text-gray-900">{lawyer.winRate}%</span>
                </div>
                <Progress value={lawyer.winRate} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
