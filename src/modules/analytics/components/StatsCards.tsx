import { TrendingUp, Briefcase, Users, DollarSign, Target } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

export function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-500" strokeWidth={2} />
            </div>
            <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" strokeWidth={2} />
              +12%
            </Badge>
          </div>
          <div className="text-3xl tracking-tight mb-1">47</div>
          <div className="text-sm text-gray-500">Активные дела</div>
        </div>
      </Card>

      <Card className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" strokeWidth={2} />
            </div>
            <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" strokeWidth={2} />
              +8%
            </Badge>
          </div>
          <div className="text-3xl tracking-tight mb-1">24</div>
          <div className="text-sm text-gray-500">Новых клиентов</div>
        </div>
      </Card>

      <Card className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-500" strokeWidth={2} />
            </div>
            <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" strokeWidth={2} />
              +5%
            </Badge>
          </div>
          <div className="text-3xl tracking-tight mb-1">87%</div>
          <div className="text-sm text-gray-500">Успешных дел</div>
        </div>
      </Card>

      <Card className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-500" strokeWidth={2} />
            </div>
            <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" strokeWidth={2} />
              +23%
            </Badge>
          </div>
          <div className="text-3xl tracking-tight mb-1">3.8M ₽</div>
          <div className="text-sm text-gray-500">Доход за период</div>
        </div>
      </Card>
    </div>
  );
}
