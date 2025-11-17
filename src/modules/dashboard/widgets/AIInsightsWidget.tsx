import { Sparkles, Star, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

export function AIInsightsWidget() {
  const navigate = useNavigate();

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-base sm:text-lg tracking-tight">AI Инсайты</h3>
        </div>

        <div className="space-y-2.5 sm:space-y-3 mb-3 sm:mb-4">
          <div className="p-3 sm:p-4 rounded-xl bg-amber-50 border border-amber-100">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" strokeWidth={2.5} />
              </div>
              <p className="text-xs sm:text-sm text-amber-900">
                Рекомендуется обновить договор для клиента ООО "ТехноСтрой"
              </p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" strokeWidth={2.5} />
              </div>
              <p className="text-xs sm:text-sm text-blue-900">
                Найдено 3 похожих дела в архиве
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate(ROUTES.AI_ASSISTANT)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl shadow-md cursor-pointer text-sm sm:text-base"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" strokeWidth={2.5} />
          Спросить AI
        </Button>
    </Card>
  );
}
