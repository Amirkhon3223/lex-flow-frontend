import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MeetingStatusEnum } from '@/app/types/calendar/calendar.enums';
import type { CalendarWidgetProps } from '@/app/types/calendar/calendar.interfaces';
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
  return (
    <Card className="lg:col-span-3">
      <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl tracking-tight">Календарь</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-gray-200 hover:bg-gray-50 text-xs sm:text-sm"
              onClick={() => {
                setSelectedMonth(new Date());
                setDate(new Date());
              }}
            >
              Сегодня
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
          className="rounded-xl border-0"
          modifiers={{
            meeting: meetingDates,
          }}
          modifiersClassNames={{
            meeting: 'bg-blue-500',
          }}
        />

        <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 rounded-xl bg-blue-50 text-center">
            <div className="text-lg sm:text-2xl tracking-tight text-blue-600 mb-1">
              {meetings.filter(m => m.status === MeetingStatusEnum.SCHEDULED).length}
            </div>
            <div className="text-xs text-blue-600">Запланировано</div>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-green-50 text-center">
            <div className="text-lg sm:text-2xl tracking-tight text-green-600 mb-1">
              {meetings.filter(m => m.status === MeetingStatusEnum.COMPLETED).length}
            </div>
            <div className="text-xs text-green-600">Завершено</div>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-gray-50 text-center">
            <div className="text-lg sm:text-2xl tracking-tight text-gray-600 mb-1">
              {meetings.length}
            </div>
            <div className="text-xs text-gray-600">Всего</div>
          </div>
        </div>
    </Card>
  );
}
