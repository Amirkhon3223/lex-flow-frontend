import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { usePlanLimitsStore } from '@/app/store/planLimits.store';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

interface QuickActionsProps {
  onAddClient?: () => void;
  onAddCase?: () => void;
  onUploadDocument?: () => void;
}

export function QuickActions({ onAddClient, onAddCase, onUploadDocument }: QuickActionsProps) {
  const { t } = useI18n();
  const { usage, fetchUsage } = usePlanLimitsStore();

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const canAddClient = usage?.canAddClient !== false;
  const canAddCase = usage?.canAddCase !== false;
  const canUpload = usage?.canUpload !== false;

  return (
    <Card>
      <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">
        {t('DASHBOARD.QUICK_ACTIONS.TITLE')}
      </h3>

      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block">
                <Button
                  className={`w-full justify-start bg-muted/50 hover:bg-muted text-foreground border-0 rounded-xl cursor-pointer text-sm sm:text-base py-2.5 sm:py-3 ${!canAddClient ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={canAddClient ? onAddClient : undefined}
                  disabled={!canAddClient}
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" strokeWidth={2} />
                  {t('DASHBOARD.QUICK_ACTIONS.NEW_CLIENT')}
                </Button>
              </span>
            </TooltipTrigger>
            {!canAddClient && (
              <TooltipContent>{t('LIMITS.CLIENTS_LIMIT')}</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block">
                <Button
                  className={`w-full justify-start bg-muted/50 hover:bg-muted text-foreground border-0 rounded-xl cursor-pointer text-sm sm:text-base py-2.5 sm:py-3 ${!canAddCase ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={canAddCase ? onAddCase : undefined}
                  disabled={!canAddCase}
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" strokeWidth={2} />
                  {t('DASHBOARD.QUICK_ACTIONS.NEW_CASE')}
                </Button>
              </span>
            </TooltipTrigger>
            {!canAddCase && (
              <TooltipContent>{t('LIMITS.CASES_LIMIT')}</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block">
                <Button
                  className={`w-full justify-start bg-muted/50 hover:bg-muted text-foreground border-0 rounded-xl cursor-pointer text-sm sm:text-base py-2.5 sm:py-3 ${!canUpload ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={canUpload ? onUploadDocument : undefined}
                  disabled={!canUpload}
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" strokeWidth={2} />
                  {t('DASHBOARD.QUICK_ACTIONS.UPLOAD_DOCUMENT')}
                </Button>
              </span>
            </TooltipTrigger>
            {!canUpload && (
              <TooltipContent>{t('LIMITS.STORAGE_LIMIT')}</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
}
