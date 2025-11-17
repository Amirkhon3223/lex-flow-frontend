import {
  Clock,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MeetingStatusEnum } from '@/app/types/calendar/calendar.enums';
import type { MeetingsListProps } from '@/app/types/calendar/calendar.interfaces';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';


export function MeetingsList({
                               meetings,
                               getMeetingTypeIcon,
                               getMeetingTypeColor,
                               getPriorityColor,
                             }: MeetingsListProps) {
  const navigate = useNavigate();

  return (
    <Card className="bg-white border-0 shadow-sm">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl tracking-tight mb-4 sm:mb-6">Все встречи</h3>

        <div className="space-y-3">
          {meetings
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => navigate(`/calendar/meetings/${meeting.id}`)}
                className="group p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
              >
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex flex-col items-center min-w-[40px]">
                      <div className="text-base tracking-tight text-gray-900">
                        {meeting.date.toLocaleDateString('ru-RU', { day: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {meeting.date.toLocaleDateString('ru-RU', { month: 'short' })}
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-10 bg-gray-200"/>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="w-7 h-7 ring-2 ring-gray-200 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                            {meeting.client.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm tracking-tight truncate">{meeting.title}</h4>
                          <p className="text-xs text-gray-500">{meeting.client.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {meeting.priority && (
                      <Badge className={`${getPriorityColor(meeting.priority)} border-0 text-xs`}>
                        {meeting.priority === 'high' ? 'Срочно' : meeting.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </Badge>
                    )}
                    <Badge className={`${getMeetingTypeColor(meeting.type)} border-0 text-xs`}>
                      {getMeetingTypeIcon(meeting.type)}
                    </Badge>
                    <Badge className={`${meeting.status === MeetingStatusEnum.COMPLETED
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                    } border-0 text-xs`}>
                      {meeting.status === MeetingStatusEnum.COMPLETED ? 'Завершено' : 'Запланировано'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" strokeWidth={2}/>
                      {meeting.time} • {meeting.duration}
                    </span>
                    {meeting.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" strokeWidth={2}/>
                        <span className="truncate max-w-[100px]">{meeting.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:flex items-start gap-4">
                  <div className="flex flex-col items-center min-w-[60px]">
                    <div className="text-2xl tracking-tight text-gray-900">
                      {meeting.date.toLocaleDateString('ru-RU', { day: 'numeric' })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {meeting.date.toLocaleDateString('ru-RU', { month: 'short' })}
                    </div>
                    <div className="text-xs text-gray-400">
                      {meeting.time}
                    </div>
                  </div>

                  <Separator orientation="vertical" className="h-20 bg-gray-200"/>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-gray-200">
                          <AvatarFallback
                            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                            {meeting.client.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="tracking-tight mb-1">{meeting.title}</h4>
                          <p className="text-sm text-gray-500">{meeting.client.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {meeting.priority && (
                          <Badge className={`${getPriorityColor(meeting.priority)} border-0 text-xs`}>
                            {meeting.priority === 'high' ? 'Срочно' : meeting.priority === 'medium' ? 'Средний' : 'Низкий'}
                          </Badge>
                        )}
                        <Badge className={`${getMeetingTypeColor(meeting.type)} border-0`}>
                          {getMeetingTypeIcon(meeting.type)}
                        </Badge>
                        <Badge className={`${meeting.status === MeetingStatusEnum.COMPLETED
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                        } border-0`}>
                          {meeting.status === MeetingStatusEnum.COMPLETED ? 'Завершено' : 'Запланировано'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" strokeWidth={2}/>
                        {meeting.duration}
                      </span>
                      {meeting.location && (
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" strokeWidth={2}/>
                          {meeting.location}
                        </span>
                      )}
                      {meeting.case && (
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" strokeWidth={2}/>
                          {meeting.case}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}
