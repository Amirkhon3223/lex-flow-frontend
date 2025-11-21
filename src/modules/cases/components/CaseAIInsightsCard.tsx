import { AlertCircle, ChevronRight, Clock, Sparkles, TrendingUp } from 'lucide-react';
import { AIInsightPriorityEnum, AIInsightTypeEnum } from '@/app/types/cases/cases.enums';
import type { AIInsightInterface } from '@/app/types/cases/cases.interfaces';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

interface CaseAIInsightsCardProps {
  insights: AIInsightInterface[];
  onViewFullReport: () => void;
}

export function CaseAIInsightsCard({ insights, onViewFullReport }: CaseAIInsightsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-500 to-pink-500 border-0 shadow-lg shadow-purple-500/20 text-white">
      <div>
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg sm:text-xl tracking-tight">AI Анализ дела</h3>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
          {insights.map((insight, index) => (
            <div key={index} className="p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-start gap-2 sm:gap-3">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${insight.priority === AIInsightPriorityEnum.HIGH ? 'bg-white/20' : 'bg-white/10'
                    }`}
                >
                  {insight.type === AIInsightTypeEnum.RISK && (
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                  )}
                  {insight.type === AIInsightTypeEnum.OPPORTUNITY && (
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                  )}
                  {insight.type === AIInsightTypeEnum.DEADLINE && (
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm mb-1 opacity-90">{insight.title}</div>
                  <div className="text-xs sm:text-sm opacity-75">{insight.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="w-full bg-white/20 hover:bg-white/30 border-0 rounded-xl backdrop-blur-sm text-white text-sm sm:text-base"
          onClick={onViewFullReport}
        >
          Полный AI отчет
          <ChevronRight className="w-4 h-4 ml-2" strokeWidth={2} />
        </Button>
      </div>
    </Card>
  );
}
