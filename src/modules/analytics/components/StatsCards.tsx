import { TrendingUp, Briefcase, Users, DollarSign, Target } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      <Card>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-blue-50 flex items-center justify-center">
            <Briefcase className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-blue-500" strokeWidth={2} />
          </div>
          <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-0.5 sm:gap-1 text-xs">
            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2} />
            +12%
          </Badge>
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-0.5 sm:mb-1">47</div>
        <div className="text-xs sm:text-sm text-gray-500">Активные дела</div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-purple-50 flex items-center justify-center">
            <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-purple-500" strokeWidth={2} />
          </div>
          <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-0.5 sm:gap-1 text-xs">
            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2} />
            +8%
          </Badge>
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-0.5 sm:mb-1">24</div>
        <div className="text-xs sm:text-sm text-gray-500">Новых клиентов</div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-green-50 flex items-center justify-center">
            <Target className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-green-500" strokeWidth={2} />
          </div>
          <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-0.5 sm:gap-1 text-xs">
            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2} />
            +5%
          </Badge>
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-0.5 sm:mb-1">87%</div>
        <div className="text-xs sm:text-sm text-gray-500">Успешных дел</div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-amber-50 flex items-center justify-center">
            <DollarSign className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-amber-500" strokeWidth={2} />
          </div>
          <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-0.5 sm:gap-1 text-xs">
            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2} />
            +23%
          </Badge>
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-0.5 sm:mb-1">3.8M ₽</div>
        <div className="text-xs sm:text-sm text-gray-500">Доход за период</div>
      </Card>
    </div>
  );
}
