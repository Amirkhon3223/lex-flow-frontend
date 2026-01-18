import { Sparkles, Star, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

export function AIInsightsWidget() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <h3 className="text-lg tracking-tight text-foreground">
          {t('DASHBOARD.AI_INSIGHTS.TITLE')}
        </h3>
      </div>

      <div className="space-y-3 mb-4">
        <div className="p-4 rounded-xl bg-insight-amber-bg border border-insight-amber-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-insight-amber-icon-bg flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-insight-amber-foreground" strokeWidth={2.5} />
            </div>
            <p className="text-sm text-insight-amber-foreground">
              {}
              Coming soon
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-insight-blue-bg border border-insight-blue-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-insight-blue-icon-bg flex items-center justify-center">
              <Tag className="w-3.5 h-3.5 text-insight-blue-foreground" strokeWidth={2.5} />
            </div>
            <p className="text-sm text-insight-blue-foreground">
              {}
              Coming soon
            </p>
          </div>
        </div>
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
