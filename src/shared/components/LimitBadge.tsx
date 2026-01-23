import { AlertTriangle } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { cn } from '@/shared/ui/utils';

interface LimitBadgeProps {
  current: number;
  max: number; // -1 = unlimited
  className?: string;
}

export function LimitBadge({ current, max, className }: LimitBadgeProps) {
  const { t } = useI18n();

  if (max === -1) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full',
        className
      )}>
        {current} / ∞
      </span>
    );
  }

  const percentage = max > 0 ? (current / max) * 100 : 0;
  const isAtLimit = current >= max;
  const isNearLimit = percentage >= 80;

  const badgeColor = isAtLimit
    ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
    : isNearLimit
      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
      : 'bg-muted text-muted-foreground border-transparent';

  const badge = (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border',
      badgeColor,
      className
    )}>
      {(isAtLimit || isNearLimit) && (
        <AlertTriangle className="w-3 h-3" strokeWidth={2.5} />
      )}
      {current} / {max}
    </span>
  );

  if (isAtLimit) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{t('LIMITS.REACHED')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}
