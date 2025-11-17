import { DollarSign } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

export function CaseFinancesCard() {
  return (
    <Card>
      <div>
        <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">Финансы</h3>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-500">Гонорар</span>
              <span className="text-lg sm:text-xl tracking-tight">150 000 ₽</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500">Оплачено</span>
              <span className="text-green-600">75 000 ₽</span>
            </div>
          </div>

          <Separator className="bg-gray-100" />

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" strokeWidth={2} />
            <span className="text-gray-500">Остаток:</span>
            <span className="text-gray-900">75 000 ₽</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
