import { useEffect } from 'react';
import { Sparkles, Star, TrendingUp, Lightbulb, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { useAIStore } from '@/app/store/ai.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

const insightIcons: Record<string, typeof Star> = {
  insight: Star,
  trend: TrendingUp,
  tip: Lightbulb,
  pattern: AlertTriangle,
};

const insightStyles: Record<string, { bg: string; border: string; iconBg: string; text: string }> = {
  insight: {
    bg: 'bg-insight-amber-bg',
    border: 'border-insight-amber-border',
    iconBg: 'bg-insight-amber-icon-bg',
    text: 'text-insight-amber-foreground',
  },
  trend: {
    bg: 'bg-insight-blue-bg',
    border: 'border-insight-blue-border',
    iconBg: 'bg-insight-blue-icon-bg',
    text: 'text-insight-blue-foreground',
  },
  tip: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    iconBg: 'bg-green-500/20',
    text: 'text-green-700 dark:text-green-400',
  },
  pattern: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/20',
    text: 'text-purple-700 dark:text-purple-400',
  },
};

export function AIInsightsWidget() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { insights, loading, fetchInsights } = useAIStore();

  useEffect(() => {
    fetchInsights().catch(() => {
      // Silently handle - insights are optional
    });
  }, [fetchInsights]);

  const handleRefresh = () => {
    fetchInsights().catch(() => {});
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg tracking-tight text-foreground">
            {t('DASHBOARD.AI_INSIGHTS.TITLE')}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        {loading && (!insights || insights.length === 0) ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          </div>
        ) : insights && insights.length > 0 ? (
          insights.slice(0, 3).map((insight) => {
            const Icon = insightIcons[insight.type] || Star;
            const style = insightStyles[insight.type] || insightStyles.insight;

            return (
              <div
                key={insight.id}
                className={`p-4 rounded-xl ${style.bg} border ${style.border}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-lg ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${style.text}`} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium ${style.text} mb-1`}>
                      {insight.title}
                    </h4>
                    <p className={`text-xs ${style.text} opacity-80 line-clamp-2`}>
                      {insight.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <>
            <div className="p-4 rounded-xl bg-insight-amber-bg border border-insight-amber-border">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-insight-amber-icon-bg flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-insight-amber-foreground" strokeWidth={2.5} />
                </div>
                <p className="text-sm text-insight-amber-foreground">
                  {t('DASHBOARD.AI_INSIGHTS.NO_INSIGHTS')}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-insight-blue-bg border border-insight-blue-border">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-insight-blue-icon-bg flex items-center justify-center">
                  <Lightbulb className="w-3.5 h-3.5 text-insight-blue-foreground" strokeWidth={2.5} />
                </div>
                <p className="text-sm text-insight-blue-foreground">
                  {t('DASHBOARD.AI_INSIGHTS.TIP')}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <Button
        onClick={() => navigate(ROUTES.AI_ASSISTANT)}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-md cursor-pointer text-base border-0 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" strokeWidth={2.5} />
        {t('DASHBOARD.AI_INSIGHTS.ACTION_ASK')}
      </Button>
    </Card>
  );
}
