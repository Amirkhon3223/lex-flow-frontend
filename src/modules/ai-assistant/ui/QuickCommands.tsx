import { Zap } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';

interface QuickCommandsProps {
  commands: string[];
  onCommandClick: (command: string) => void;
}

export function QuickCommands({ commands, onCommandClick }: QuickCommandsProps) {
  const { t } = useI18n();

  return (
    <Card>
      <h3 className="tracking-tight mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base">{t('AI_ASSISTANT.QUICK_COMMANDS.TITLE')}</h3>
        <div className="space-y-1.5 sm:space-y-2">
          {commands.map((action, index) => (
            <button
              key={index}
              onClick={() => onCommandClick(action)}
              className="w-full text-left p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-purple-50 hover:text-purple-600 transition-all text-xs sm:text-sm group"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Zap
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 group-hover:text-purple-500 flex-shrink-0"
                  strokeWidth={2}
                />
                <span className="line-clamp-2">{action}</span>
              </div>
            </button>
          ))}
        </div>
    </Card>
  );
}
