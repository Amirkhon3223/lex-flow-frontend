import type { UpcomingMeetingsProps } from '@/app/types/calendar/calendar.interfaces.ts';
import { MeetingStatusEnum } from '@/app/types/calendar/calendar.enums';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { parseLocalDate } from '@/shared/utils';

export function UpcomingMeetings({ meetings, onSelectDate }: UpcomingMeetingsProps) {
  const { t } = useI18n();

  const activeMeetings = meetings.filter(
    (meeting) => meeting.status !== MeetingStatusEnum.CANCELLED
  );

  return (
    <Card>
      <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">
        {t('CALENDAR.UPCOMING_MEETINGS')}
      </h3>

      <div className="space-y-2 sm:space-y-3">
        {activeMeetings.slice(0, 3).map((meeting) => {
          const meetingDate = parseLocalDate(meeting.date);
          return (
            <div
              key={meeting.id}
              onClick={() => onSelectDate(meetingDate)}
              className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center min-w-[40px] sm:min-w-[50px]">
                <div className="text-xs sm:text-sm text-foreground">
                  {meetingDate.toLocaleDateString('ru-RU', { day: 'numeric' })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {meetingDate.toLocaleDateString('ru-RU', { month: 'short' })}
                </div>
              </div>
              <Separator orientation="vertical" className="h-8 sm:h-10 bg-border" />
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm truncate mb-0.5 sm:mb-1">{meeting.title}</div>
                <div className="text-xs text-muted-foreground">{meeting.clientName}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
