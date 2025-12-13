import { FileText } from 'lucide-react';
import { EmptyState } from '@/modules/calendar/ui/EmptyState';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MeetingDocumentsCardProps {
  onAddDocument: () => void;
}

export function MeetingDocumentsCard({ onAddDocument }: MeetingDocumentsCardProps) {
  const { t } = useI18n();
  return (
    <Card className="pb-0!">
      <CardHeader>
        <div className="flex items-center justify-between gap-2 pb-2">
          <CardTitle className="text-sm sm:text-base md:text-lg min-w-0 truncate">
            {t('COMMON.NAVIGATION.DOCUMENTS')}
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg sm:rounded-xl text-xs h-7 sm:h-8 px-2 sm:px-3 flex-shrink-0"
            onClick={onAddDocument}
          >
            <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 sm:mr-2" strokeWidth={2} />
            <span className="hidden sm:inline">{t('COMMON.ACTIONS.ADD')}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl bg-muted/50">
          <EmptyState
            icon={
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground" strokeWidth={2} />
            }
            message={t('DOCUMENTS.EMPTY_STATE')}
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
