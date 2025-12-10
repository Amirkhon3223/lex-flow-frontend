import { FileText } from 'lucide-react';
import type { RecentAnalysisInterface } from '@/app/types/ai-assistant/ai-assistant.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { getAnalysisStatusColor } from '@/shared/utils/styleHelpers';

interface RecentAnalysesProps {
  analyses: RecentAnalysisInterface[];
}

export function RecentAnalyses({ analyses }: RecentAnalysesProps) {
  const { t } = useI18n();
  return (
    <Card>
      <h3 className="tracking-tight mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base">
        {t('AI_ASSISTANT.RECENT_ANALYSES.TITLE')}
      </h3>
      <div className="space-y-2 sm:space-y-3">
        {analyses.map((analysis, index) => (
          <div
            key={index}
            className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer"
          >
            <div className="flex items-start gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <FileText
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0 mt-0.5"
                strokeWidth={2}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm tracking-tight truncate">{analysis.document}</h4>
                <p className="text-xs text-muted-foreground">{analysis.case}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Badge className={`text-xs border-0 ${getAnalysisStatusColor(analysis.status)}`}>
                {analysis.result}
              </Badge>
              <span className="text-xs text-muted-foreground flex-shrink-0">{analysis.date}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
