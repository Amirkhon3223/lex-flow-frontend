import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

export function CaseProgressCard() {
  return (
    <Card>
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg tracking-tight">Прогресс дела</h3>
          <span className="text-xl sm:text-2xl tracking-tight">75%</span>
        </div>
        <Progress value={75} className="h-1.5 sm:h-2 mb-3 sm:mb-4 bg-gray-200 [&>div]:bg-blue-500" />
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="flex flex-col items-center">
            <Badge className="bg-blue-100 text-blue-700 border-0 text-base sm:text-lg px-2.5 sm:px-3 py-1 mb-1.5 sm:mb-2">
              8
            </Badge>
            <div className="text-xs sm:text-sm text-gray-500">Документов</div>
          </div>
          <div className="flex flex-col items-center">
            <Badge className="bg-purple-100 text-purple-700 border-0 text-base sm:text-lg px-2.5 sm:px-3 py-1 mb-1.5 sm:mb-2">
              12
            </Badge>
            <div className="text-xs sm:text-sm text-gray-500">Событий</div>
          </div>
          <div className="flex flex-col items-center">
            <Badge className="bg-orange-100 text-orange-700 border-0 text-base sm:text-lg px-2.5 sm:px-3 py-1 mb-1.5 sm:mb-2">
              5
            </Badge>
            <div className="text-xs sm:text-sm text-gray-500">Дней до суда</div>
          </div>
          <div className="flex flex-col items-center">
            <Badge className="bg-green-100 text-green-700 border-0 text-base sm:text-lg px-2.5 sm:px-3 py-1 mb-1.5 sm:mb-2">
              3
            </Badge>
            <div className="text-xs sm:text-sm text-gray-500">Задачи</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
