import { Sparkles, Star, Tag } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

export function AIInsightsWidget() {
  return (
    <Card className="bg-white border-0 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg tracking-tight">AI Инсайты</h3>
        </div>

        <div className="space-y-3 mb-4">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Star className="w-3.5 h-3.5 text-amber-600" strokeWidth={2.5} />
              </div>
              <p className="text-sm text-amber-900">
                Рекомендуется обновить договор для клиента ООО "ТехноСтрой"
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
              </div>
              <p className="text-sm text-blue-900">
                Найдено 3 похожих дела в архиве
              </p>
            </div>
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl shadow-md">
          <Sparkles className="w-4 h-4 mr-2" strokeWidth={2.5} />
          Спросить AI
        </Button>
      </div>
    </Card>
  );
}
