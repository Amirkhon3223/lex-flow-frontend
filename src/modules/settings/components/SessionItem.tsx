import type { SessionItemProps } from '@/app/types/settings/settings.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

export function SessionItem({ session, onTerminate }: SessionItemProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-muted/50">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
          <h4 className="tracking-tight text-xs sm:text-sm md:text-base truncate">{session.device}</h4>
          {session.current && (
            <Badge
              className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-0 text-xs flex-shrink-0">{t('SETTINGS.SECURITY.CURRENT')}</Badge>
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {session.location} • {session.time}
        </p>
      </div>
      {!session.current && (
        <Button
          variant="outline"
          size="sm"
          onClick={onTerminate}
          className="rounded-md sm:rounded-lg border-border hover:bg-destructive/10 hover:text-destructive text-xs h-7 sm:h-8 px-2 sm:px-3 flex-shrink-0"
        >
          {t('SETTINGS.SECURITY.TERMINATE_SESSION')}
        </Button>
      )}
    </div>
  );
}
