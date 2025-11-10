import {
  Clock,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MeetingStatusEnum } from '@/app/types/calendar/calendar.enums';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

interface MeetingsListProps {
  meetings: MeetingInterface[];
  getMeetingTypeIcon: (type: MeetingInterface['type']) => JSX.Element;
  getMeetingTypeColor: (type: MeetingInterface['type']) => string;
  getPriorityColor: (priority?: MeetingInterface['priority']) => string;
}

export function MeetingsList({
  meetings,
  getMeetingTypeIcon,
  getMeetingTypeColor,
  getPriorityColor,
}: MeetingsListProps) {
  const navigate = useNavigate();

  return (
    <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
      <div className="p-6">
        <h3 className="text-xl tracking-tight mb-6">Все встречи</h3>

        <div className="space-y-3">
          {meetings
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => navigate(`/calendar/meetings/${meeting.id}`)}
                className="group p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
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

                  <Separator orientation="vertical" className="h-20 bg-gray-200" />

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
                        <Clock className="w-4 h-4" strokeWidth={2} />
                        {meeting.duration}
                      </span>
                      {meeting.location && (
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" strokeWidth={2} />
                          {meeting.location}
                        </span>
                      )}
                      {meeting.case && (
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" strokeWidth={2} />
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
