import { Clock, MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MeetingStatusEnum, MeetingPriorityEnum } from '@/app/types/calendar/calendar.enums';
import type { MeetingsListProps } from '@/app/types/calendar/calendar.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { parseLocalDate } from '@/shared/utils';

export function MeetingsList({
  meetings,
  getMeetingTypeIcon,
  getMeetingTypeColor,
  getPriorityColor,
}: MeetingsListProps) {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <Card>
      <h3 className="text-lg sm:text-xl tracking-tight mb-4 sm:mb-6">
        {t('CALENDAR.MEETING_DETAILS.ALL_MEETINGS')}
      </h3>

      <div className="space-y-3">
        {meetings
          .sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime())
          .map((meeting) => {
            const meetingDate = parseLocalDate(meeting.date);
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
                className="group p-3 sm:p-5 rounded-xl bg-muted/80 sm:rounded-2xl bg-card hover:bg-muted/50 transition-all cursor-pointer border border-transparent hover:border-border"
              >
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex flex-col items-center min-w-[40px]">
                      <div className="text-base tracking-tight text-foreground">
                        {meetingDate.toLocaleDateString('ru-RU', { day: 'numeric' })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {meetingDate.toLocaleDateString('ru-RU', { month: 'short' })}
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-10 bg-border" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="w-7 h-7 ring-2 ring-border flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                            {clientInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm tracking-tight truncate text-foreground">
                            {meeting.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">{meeting.clientName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {meeting.priority && (
                      <Badge className={`${getPriorityColor(meeting.priority)} border-0 text-xs`}>
                        {meeting.priority === MeetingPriorityEnum.HIGH
                          ? t('CALENDAR.PRIORITY_DETAILS.HIGH')
                          : meeting.priority === MeetingPriorityEnum.MEDIUM
                            ? t('CALENDAR.PRIORITY_DETAILS.MEDIUM')
                            : t('CALENDAR.PRIORITY_DETAILS.LOW')}
                      </Badge>
                    )}
                    <Badge className={`${getMeetingTypeColor(meeting.type)} border-0 text-xs`}>
                      {getMeetingTypeIcon(meeting.type, meeting.title)}
                    </Badge>
                    <Badge
                      className={`${
                        meeting.status === MeetingStatusEnum.COMPLETED
                          ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                          : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      } border-0 text-xs`}
                    >
                      {meeting.status === MeetingStatusEnum.COMPLETED
                        ? t('CALENDAR.STATUS.COMPLETED')
                        : t('CALENDAR.STATUS.SCHEDULED')}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" strokeWidth={2} />
                      {meeting.time} • {meeting.duration}
                    </span>
                    {meeting.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" strokeWidth={2} />
                        <span className="truncate max-w-[100px]">{meeting.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* desktop layout */}
                <div className="hidden md:flex items-start gap-4">
                  <div className="flex flex-col items-center min-w-[60px]">
                    <div className="text-2xl tracking-tight text-foreground">
                      {meetingDate.toLocaleDateString('ru-RU', { day: 'numeric' })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {meetingDate.toLocaleDateString('ru-RU', { month: 'short' })}
                    </div>
                    <div className="text-xs text-muted-foreground/80">{meeting.time}</div>
                  </div>

                  <Separator orientation="vertical" className="h-20 bg-border" />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-border">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                            {clientInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="tracking-tight mb-1 text-foreground">{meeting.title}</h4>
                          <p className="text-sm text-muted-foreground">{meeting.clientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {meeting.priority && (
                          <Badge
                            className={`${getPriorityColor(meeting.priority)} border-0 text-xs`}
                          >
                            {meeting.priority === MeetingPriorityEnum.HIGH
                              ? t('CALENDAR.PRIORITY_DETAILS.HIGH')
                              : meeting.priority === MeetingPriorityEnum.MEDIUM
                                ? t('CALENDAR.PRIORITY_DETAILS.MEDIUM')
                                : t('CALENDAR.PRIORITY_DETAILS.LOW')}
                          </Badge>
                        )}
                        <Badge className={`${getMeetingTypeColor(meeting.type)} border-0`}>
                          {getMeetingTypeIcon(meeting.type, meeting.title)}
                        </Badge>
                        <Badge
                          className={`${
                            meeting.status === MeetingStatusEnum.COMPLETED
                              ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                              : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                          } border-0`}
                        >
                          {meeting.status === MeetingStatusEnum.COMPLETED
                            ? t('CALENDAR.STATUS.COMPLETED')
                            : t('CALENDAR.STATUS.SCHEDULED')}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" strokeWidth={2} />
                        {meeting.duration}
                      </span>
                      {meeting.location && (
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" strokeWidth={2} />
                          {meeting.location}
                        </span>
                      )}
                      {meeting.caseName && (
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" strokeWidth={2} />
                          {meeting.caseName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Card>
  );
}
