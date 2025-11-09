import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Phone,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MeetingTypeEnum, MeetingStatusEnum } from '@/app/types/calendar/calendar.enums';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { AddMeetingDialog } from './AddMeetingDialog';

export function ClientMeetingsCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());


  const meetings: MeetingInterface[] = [
    {
      id: 1,
      title: 'Консультация по трудовому спору',
      date: new Date(2025, 9, 15, 10, 0),
      time: '10:00',
      duration: '1 час',
      type: MeetingTypeEnum.IN_PERSON,
      location: 'Офис, кабинет 305',
      participants: ['Иван��в П.А.', 'Вы'],
      status: MeetingStatusEnum.SCHEDULED,
    },
    {
      id: 2,
      title: 'Видео-встреча: обсуждение документов',
      date: new Date(2025, 9, 18, 14, 30),
      time: '14:30',
      duration: '45 минут',
      type: MeetingTypeEnum.VIDEO,
      location: 'Google Meet',
      participants: ['Иванов П.А.', 'Вы'],
      status: MeetingStatusEnum.SCHEDULED,
    },
    {
      id: 3,
      title: 'Телефонная консультация',
      date: new Date(2025, 9, 20, 16, 0),
      time: '16:00',
      duration: '30 минут',
      type: MeetingTypeEnum.PHONE,
      participants: ['Иванов П.А.', 'Вы'],
      status: MeetingStatusEnum.SCHEDULED,
    },
    {
      id: 4,
      title: 'Подписание документов',
      date: new Date(2025, 9, 12, 11, 0),
      time: '11:00',
      duration: '30 минут',
      type: MeetingTypeEnum.IN_PERSON,
      location: 'Офис, кабинет 305',
      status: MeetingStatusEnum.COMPLETED,
    },
  ];


  const selectedDateMeetings = meetings.filter(meeting => {
    if (!date) return false;
    return (
      meeting.date.getDate() === date.getDate() &&
      meeting.date.getMonth() === date.getMonth() &&
      meeting.date.getFullYear() === date.getFullYear()
    );
  });


  const upcomingMeetings = meetings
    .filter(m => m.status === 'scheduled' && m.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);


  const meetingDates = meetings.map(m => m.date);

  const getMeetingTypeIcon = (type: Meeting['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" strokeWidth={2} />;
      case 'phone':
        return <Phone className="w-4 h-4" strokeWidth={2} />;
      default:
        return <Users className="w-4 h-4" strokeWidth={2} />;
    }
  };

  const getMeetingTypeColor = (type: Meeting['type']) => {
    switch (type) {
      case 'video':
        return 'bg-purple-100 text-purple-700';
      case 'phone':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getMeetingTypeLabel = (type: Meeting['type']) => {
    switch (type) {
      case 'video':
        return 'Видео';
      case 'phone':
        return 'Звонок';
      default:
        return 'Офис';
    }
  };

  return (
    <div className="space-y-6">
      <AddMeetingDialog open={isAddMeetingOpen} onOpenChange={setIsAddMeetingOpen} />

      <div className="grid grid-cols-2 gap-6">
        {}
        <Card className="bg-white border-0 shadow-sm rounded-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg tracking-tight">Календарь встреч</h3>
              <Button
                onClick={() => setIsAddMeetingOpen(true)}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                Встреча
              </Button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm text-gray-600">
                {selectedMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
              </h4>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
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
                  className="h-8 w-8 rounded-lg"
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

            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                className="rounded-xl border-0"
                modifiers={{
                  meeting: meetingDates,
                }}
                modifiersClassNames={{
                  meeting: 'bg-blue-100 text-blue-700 font-medium',
                }}
              />
            </div>

            <div className="mt-4 p-3 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Дни с запланированными встречами</span>
              </div>
            </div>
          </div>
        </Card>

        {}
        <div className="space-y-4">
          {}
          {date && (
            <Card className="bg-white border-0 shadow-sm rounded-xl">
              <div className="p-6">
                <h3 className="text-lg tracking-tight mb-4">
                  {date.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </h3>

                {selectedDateMeetings.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="group p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="tracking-tight text-sm">{meeting.title}</h4>
                              {meeting.status === 'completed' && (
                                <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                  Завершено
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                                <span>{meeting.time} • {meeting.duration}</span>
                              </div>
                              {meeting.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                                  <span>{meeting.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge className={`${getMeetingTypeColor(meeting.type)} border-0 text-xs`}>
                            {getMeetingTypeIcon(meeting.type)}
                            <span className="ml-1">{getMeetingTypeLabel(meeting.type)}</span>
                          </Badge>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-500 hover:bg-blue-50 rounded-lg -ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Подробнее
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <CalendarIcon className="w-8 h-8 text-gray-400" strokeWidth={2} />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Нет встреч на эту дату</p>
                    <Button
                      onClick={() => setIsAddMeetingOpen(true)}
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-gray-200 hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                      Добавить встречу
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 text-white">
            <div className="p-6">
              <h3 className="text-lg tracking-tight mb-4">Ближайшие встречи</h3>

              <div className="space-y-3">
                {upcomingMeetings.map((meeting, index) => (
                  <div key={meeting.id}>
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="text-sm opacity-90">
                          {meeting.date.toLocaleDateString('ru-RU', { day: 'numeric' })}
                        </div>
                        <div className="text-xs opacity-75">
                          {meeting.date.toLocaleDateString('ru-RU', { month: 'short' })}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                            {getMeetingTypeIcon(meeting.type)}
                          </div>
                          <h4 className="text-sm tracking-tight truncate">{meeting.title}</h4>
                        </div>
                        <div className="flex items-center gap-3 text-xs opacity-90">
                          <span>{meeting.time}</span>
                          <span>•</span>
                          <span>{meeting.duration}</span>
                        </div>
                      </div>
                    </div>
                    {index < upcomingMeetings.length - 1 && (
                      <Separator className="my-3 bg-white/20" />
                    )}
                  </div>
                ))}
              </div>

              {upcomingMeetings.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm opacity-75">Нет запланированных встреч</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
