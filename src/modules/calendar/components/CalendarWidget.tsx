import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MeetingStatusEnum } from '@/app/types/calendar/calendar.enums';
import type { CalendarWidgetProps } from '@/app/types/calendar/calendar.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Card } from '@/shared/ui/card';

export function CalendarWidget({
  date,
  setDate,
  selectedMonth,
  setSelectedMonth,
  meetingDates,
  meetings,
}: CalendarWidgetProps) {
  const { t } = useI18n();

  return (
    <Card className="lg:col-span-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl tracking-tight">{t('CALENDAR.CALENDAR')}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-border hover:bg-muted text-xs sm:text-sm"
            onClick={() => {
              setSelectedMonth(new Date());
              setDate(new Date());
            }}
          >
            {t('CALENDAR.TODAY')}
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg"
              onClick={() => {
                const newDate = new Date(selectedMonth);
                newDate.setMonth(newDate.getMonth() - 1);
                setSelectedMonth(newDate);
              }}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg"
              onClick={() => {
                const newDate = new Date(selectedMonth);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedMonth(newDate);
              }}
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>

      <Calendar
        selected={date}
        onSelect={(newDate) => newDate && setDate(newDate)}
        month={selectedMonth}
        onMonthChange={setSelectedMonth}
        className="rounded-xl border-0 calendar-with-indicators"
        modifiers={{
          meeting: meetingDates,
        }}
        modifiersClassNames={{
          meeting: 'has-meeting',
        }}
      />

      <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="p-2 sm:p-3 rounded-xl bg-blue-500/10 text-center">
          <div className="text-lg sm:text-2xl tracking-tight text-blue-600 dark:text-blue-400 mb-1">
            {meetings.filter((m) => m.status === MeetingStatusEnum.SCHEDULED).length}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            {t('CALENDAR.MEETING_STATUS.SCHEDULED')}
          </div>
        </div>
        <div className="p-2 sm:p-3 rounded-xl bg-green-500/10 text-center">
          <div className="text-lg sm:text-2xl tracking-tight text-green-600 dark:text-green-400 mb-1">
            {meetings.filter((m) => m.status === MeetingStatusEnum.COMPLETED).length}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            {t('CALENDAR.MEETING_STATUS.COMPLETED')}
          </div>
        </div>
        <div className="p-2 sm:p-3 rounded-xl bg-muted/50 text-center">
          <div className="text-lg sm:text-2xl tracking-tight text-muted-foreground mb-1">
            {meetings.length}
          </div>
          <div className="text-xs text-muted-foreground">{t('CALENDAR.MEETING_STATUS.TOTAL')}</div>
        </div>
      </div>
    </Card>
  );
}
