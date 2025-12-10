import { Briefcase, Calendar as CalendarIcon, Clock, MapPin, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SelectedDateMeetingsProps } from '@/app/types/calendar/calendar.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

export function SelectedDateMeetings({
  date,
  meetings,
  getMeetingTypeIcon,
  getMeetingTypeColor,
  getPriorityColor,
}: SelectedDateMeetingsProps) {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <Card>
      <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">
        {date
          ? date.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
            })
          : t('CALENDAR.MESSAGES.SELECT_DATE')}
      </h3>

      {meetings.length ? (
        <div className="space-y-3">
          {meetings.map((meeting) => {
            const clientInitials = meeting.clientName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2);

            return (
              <div
                key={meeting.id}
                onClick={() => navigate(`/calendar/meetings/${meeting.id}`)}
                className="group p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer"
              >
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-border">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                      {clientInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm tracking-tight mb-1 truncate">
                      {meeting.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{meeting.clientName}</p>
                  </div>
                  {meeting.priority && (
                    <Badge
                      className={`${getPriorityColor(meeting.priority)} border-0 text-xs flex-shrink-0`}
                    >
                      {meeting.priority === 'high'
                        ? t('CALENDAR.PRIORITY.HIGH')
                        : meeting.priority === 'medium'
                          ? t('CALENDAR.PRIORITY.MEDIUM')
                          : t('CALENDAR.PRIORITY.LOW')}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2} />
                    <span>
                      {meeting.time} • {meeting.duration}
                    </span>
                  </div>
                  {meeting.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2} />
                      <span className="truncate">{meeting.location}</span>
                    </div>
                  )}
                  {meeting.caseName && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2} />
                      <span className="truncate">{meeting.caseName}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-3">
                  <Badge className={`${getMeetingTypeColor(meeting.type)} border-0 text-xs`}>
                    {getMeetingTypeIcon(meeting.type, meeting.title)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto rounded-lg opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                  >
                    <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
            <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" strokeWidth={2} />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('CALENDAR.MESSAGES.NO_MEETINGS_TODAY')}
          </p>
        </div>
      )}
    </Card>
  );
}
