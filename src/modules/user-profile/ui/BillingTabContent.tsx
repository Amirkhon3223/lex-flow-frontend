import { Eye } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

export function BillingTabContent() {
  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg shadow-purple-500/20 text-white">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <h3 className="text-xl sm:text-2xl tracking-tight mb-0.5 sm:mb-1">Pro Plan</h3>
              <p className="text-xs sm:text-sm opacity-90">Активна до 15 января 2026</p>
            </div>
            <Badge className="bg-white/20 text-white border-0 w-fit text-xs sm:text-sm">Активна</Badge>
          </div>
          <div className="text-2xl sm:text-3xl tracking-tight mb-4 sm:mb-6">2 990 ₽ / месяц</div>
          <Button className="w-full bg-white/20 hover:bg-white/30 border-0 rounded-lg sm:rounded-xl backdrop-blur-sm text-white text-xs sm:text-sm h-8 sm:h-10">
            Управление подпиской
          </Button>
        </div>
      </Card>

      <div>
        <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">Возможности плана</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50">
            <div className="tracking-tight mb-1 text-xs sm:text-sm">Клиенты</div>
            <div className="text-lg sm:text-2xl text-blue-500">Безлимит</div>
          </div>
          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50">
            <div className="tracking-tight mb-1 text-xs sm:text-sm">Дела</div>
            <div className="text-lg sm:text-2xl text-purple-500">Безлимит</div>
          </div>
          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50">
            <div className="tracking-tight mb-1 text-xs sm:text-sm">Хранилище</div>
            <div className="text-lg sm:text-2xl text-green-500">100 ГБ</div>
          </div>
          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50">
            <div className="tracking-tight mb-1 text-xs sm:text-sm">Пользователи</div>
            <div className="text-lg sm:text-2xl text-orange-500">5</div>
          </div>
        </div>
      </div>

      <Separator className="bg-border" />

      <div>
        <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">История платежей</h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50">
            <div>
              <div className="tracking-tight mb-0.5 sm:mb-1 text-sm sm:text-base">Pro Plan - Октябрь 2025</div>
              <div className="text-xs sm:text-sm text-muted-foreground">15 сентября 2025</div>
            </div>
            <div className="flex items-center justify-between sm:block sm:text-right">
              <div className="tracking-tight text-sm sm:text-base">2 990 ₽</div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:bg-blue-500/10 rounded-lg text-xs sm:text-sm h-7 sm:h-8 px-2"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" strokeWidth={2} />
                Чек
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50">
            <div>
              <div className="tracking-tight mb-0.5 sm:mb-1 text-sm sm:text-base">Pro Plan - Сентябрь 2025</div>
              <div className="text-xs sm:text-sm text-gray-500">15 сентября 2025</div>
            </div>
            <div className="flex items-center justify-between sm:block sm:text-right">
              <div className="tracking-tight text-sm sm:text-base">2 990 ₽</div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:bg-blue-500/10 rounded-lg text-xs sm:text-sm h-7 sm:h-8 px-2"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" strokeWidth={2} />
                Чек
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
