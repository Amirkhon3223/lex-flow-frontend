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
    <Card className="bg-white border-0 shadow-sm rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2">
      <div className="p-3 sm:p-4 md:p-6">
        <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">Лучшие юристы</h3>
        <div className="space-y-3 sm:space-y-4">
          {topLawyers.map((lawyer, index) => (
            <div
              key={lawyer.name}
              className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-white flex-shrink-0 ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                      : index === 1
                        ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                        : index === 2
                          ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                          : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}
                >
                  {index === 0 && <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" strokeWidth={2} />}
                  {index !== 0 && <span className="text-sm sm:text-base md:text-lg">#{index + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="tracking-tight mb-0.5 sm:mb-1 text-sm sm:text-base truncate">{lawyer.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <span>{lawyer.cases} дел</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-green-600">{lawyer.winRate}% успеха</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{(lawyer.revenue / 1000000).toFixed(1)}M ₽ дохода</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Процент успеха</span>
                  <span className="text-gray-900">{lawyer.winRate}%</span>
                </div>
                <Progress value={lawyer.winRate} className="h-1.5 sm:h-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
