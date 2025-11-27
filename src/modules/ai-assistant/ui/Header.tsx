import { Sparkles, Zap } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';

export function Header() {
  const { t } = useI18n();

  return (
    <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight">{t('AI_ASSISTANT.TITLE')}</h1>
              <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg">
                {t('AI_ASSISTANT.SUBTITLE')}
              </p>
            </div>
          </div>

          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm flex-shrink-0">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5" strokeWidth={2} />
            <span className="hidden sm:inline">{t('AI_ASSISTANT.PREMIUM_ACCESS')}</span>
            <span className="sm:hidden">Pro</span>
          </Badge>
        </div>
      </div>
    </header>
  );
}
