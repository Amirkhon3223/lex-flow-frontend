import { Sparkles, Zap } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

export function Header() {
  return (
    <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5}/>
            </div>
            <div>
              <h1 className="text-4xl tracking-tight">AI Помощник</h1>
              <p className="text-gray-500 text-lg">Интеллектуальный анализ и помощь юристу</p>
            </div>
          </div>

          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2 text-sm">
            <Zap className="w-4 h-4 mr-1.5" strokeWidth={2}/>
            Премиум доступ
          </Badge>
        </div>
      </div>
    </header>
  );
}
