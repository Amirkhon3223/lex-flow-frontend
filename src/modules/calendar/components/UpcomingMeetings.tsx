import type { UpcomingMeetingsProps } from "@/app/types/calendar/calendar.interfaces.ts";
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

export function UpcomingMeetings({ meetings, onSelectDate }: UpcomingMeetingsProps) {
  return (
    <Card>
      <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">Предстоящие встречи</h3>

      <div className="space-y-2 sm:space-y-3">
          {meetings.slice(0, 3).map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => onSelectDate(meeting.date)}
              className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center min-w-[40px] sm:min-w-[50px]">
                <div className="text-xs sm:text-sm text-gray-900">
                  {meeting.date.toLocaleDateString('ru-RU', { day: 'numeric' })}
                </div>
                <div className="text-xs text-gray-500">
                  {meeting.date.toLocaleDateString('ru-RU', { month: 'short' })}
                </div>
              </div>
              <Separator orientation="vertical" className="h-8 sm:h-10 bg-gray-200" />
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm truncate mb-0.5 sm:mb-1">{meeting.title}</div>
                <div className="text-xs text-gray-500">{meeting.client.name}</div>
              </div>
            </div>
          ))}
        </div>
    </Card>
  );
}
