import { MessageSquare } from 'lucide-react';
import { EmptyState } from '@/modules/calendar/ui/EmptyState';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MeetingNotesCardProps {
  onAddNote: () => void;
}

export function MeetingNotesCard({ onAddNote }: MeetingNotesCardProps) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm sm:text-base md:text-lg min-w-0">{t('CALENDAR.MEETING_DETAILS.NOTES')}</CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg sm:rounded-xl text-xs h-7 sm:h-8 px-2 sm:px-3 flex-shrink-0"
            onClick={onAddNote}
          >
            <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 sm:mr-2" strokeWidth={2} />
            <span className="hidden sm:inline">{t('CALENDAR.MEETING_DETAILS.ADD_NOTE')}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={<MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" strokeWidth={2} />}
          message={t('CALENDAR.MEETING_DETAILS.NO_NOTES')}
        />
      </CardContent>
    </Card>
  );
}
