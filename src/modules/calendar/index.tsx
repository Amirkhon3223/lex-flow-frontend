import { useState, useEffect } from 'react';
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
  MoreHorizontal,
  User,
  Briefcase,
  Grid3x3,
  List, Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MeetingTypeEnum, MeetingStatusEnum, MeetingPriorityEnum } from '@/app/types/calendar/calendar.enums';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { AddMeetingDialog } from "@/modules/calendar/components/AddMeetingDialog.tsx";
import { MeetingsList } from '@/modules/calendar/components/MeetingsList';
import { FilterBar } from '@/shared/components/filters/FilterBar';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

export function CalendarPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterClient, setFilterClient] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .calendar-with-indicators .rdp-day.has-meeting {
        position: relative;
      }
      .calendar-with-indicators .rdp-day.has-meeting::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #3b82f6;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);


  const allMeetings: MeetingInterface[] = [
    {
      id: 1,
      title: 'Консультация по трудовому спору',
      client: { name: 'Иванов П.А.', avatar: 'ИП' },
      case: 'Трудовой спор - незаконное увольнение',
      date: new Date(2025, 10, 9, 10, 0),
      time: '10:00',
      duration: '1 час',
      type: MeetingTypeEnum.IN_PERSON,
      location: 'Офис, кабинет 305',
      status: MeetingStatusEnum.SCHEDULED,
      priority: MeetingPriorityEnum.HIGH,
    },
    {
      id: 2,
      title: 'Видео-встреча: обсуждение договора',
      client: { name: 'Смирнова А.В.', avatar: 'СА' },
      case: 'Наследственное дело',
      date: new Date(2025, 10, 9, 14, 30),
      time: '14:30',
      duration: '45 минут',
      type: MeetingTypeEnum.VIDEO,
      location: 'Google Meet',
      status: MeetingStatusEnum.SCHEDULED,
      priority: MeetingPriorityEnum.MEDIUM,
    },
    {
      id: 3,
      title: 'Телефонная консультация',
      client: { name: 'ООО "ТехноСтрой"', avatar: 'ТС' },
      case: 'Договор аренды помещения',
      date: new Date(2025, 10, 12, 11, 0),
      time: '11:00',
      duration: '30 минут',
      type: MeetingTypeEnum.PHONE,
      status: MeetingStatusEnum.SCHEDULED,
      priority: MeetingPriorityEnum.LOW,
    },
    {
      id: 4,
      title: 'Подписание документов',
      client: { name: 'Козлов Д.М.', avatar: 'КД' },
      case: 'Взыскание задолженности',
      date: new Date(2025, 10, 15, 15, 0),
      time: '15:00',
      duration: '30 минут',
      type: MeetingTypeEnum.IN_PERSON,
      location: 'Офис, кабинет 305',
      status: MeetingStatusEnum.SCHEDULED,
      priority: MeetingPriorityEnum.HIGH,
    },
    {
      id: 5,
      title: 'Встреча с клиентом',
      client: { name: 'Иванов П.А.', avatar: 'ИП' },
      case: 'Трудовой спор - незаконное увольнение',
      date: new Date(2025, 10, 20, 16, 0),
      time: '16:00',
      duration: '1 час',
      type: MeetingTypeEnum.IN_PERSON,
      location: 'Офис, кабинет 305',
      status: MeetingStatusEnum.SCHEDULED,
      priority: MeetingPriorityEnum.MEDIUM,
    },
    {
      id: 6,
      title: 'Консультация завершена',
      client: { name: 'Смирнова А.В.', avatar: 'СА' },
      date: new Date(2025, 10, 5, 11, 0),
      time: '11:00',
      duration: '30 минут',
      type: MeetingTypeEnum.IN_PERSON,
      location: 'Офис, кабинет 305',
      status: MeetingStatusEnum.COMPLETED,
    },
    {
      id: 7,
      title: 'Заседание в суде',
      client: { name: 'Иванов П.А.', avatar: 'ИП' },
      case: 'Трудовой спор - незаконное увольнение',
      date: new Date(2025, 9, 22, 10, 0),
      time: '10:00',
      duration: '2 часа',
      type: MeetingTypeEnum.IN_PERSON,
      location: 'Районный суд',
      status: MeetingStatusEnum.SCHEDULED,
      priority: MeetingPriorityEnum.HIGH,
    },
  ];


  const filteredMeetings = allMeetings.filter(meeting => {
    const matchesType = filterType === 'all' || meeting.type === filterType;
    const matchesClient = filterClient === 'all' || meeting.client.name === filterClient;
    const matchesSearch = searchQuery === '' ||
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.client.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesClient && matchesSearch;
  });


  const selectedDateMeetings = filteredMeetings.filter(meeting => {
    if (!date) return false;
    return (
      meeting.date.getDate() === date.getDate() &&
      meeting.date.getMonth() === date.getMonth() &&
      meeting.date.getFullYear() === date.getFullYear()
    );
  }).sort((a, b) => a.date.getTime() - b.date.getTime());


  const upcomingMeetings = filteredMeetings
    .filter(m => m.status === MeetingStatusEnum.SCHEDULED && m.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);


  const today = new Date();
  const todayMeetings = filteredMeetings.filter(meeting => {
    return (
      meeting.date.getDate() === today.getDate() &&
      meeting.date.getMonth() === today.getMonth() &&
      meeting.date.getFullYear() === today.getFullYear() &&
      meeting.status === MeetingStatusEnum.SCHEDULED
    );
  }).sort((a, b) => a.date.getTime() - b.date.getTime());


  const meetingDates = filteredMeetings.map(m => m.date);


  const uniqueClients = Array.from(new Set(allMeetings.map(m => m.client.name)));

  const getMeetingTypeIcon = (type: MeetingInterface['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" strokeWidth={2}/>;
      case 'phone':
        return <Phone className="w-4 h-4" strokeWidth={2}/>;
      default:
        return <Users className="w-4 h-4" strokeWidth={2}/>;
    }
  };

  const getMeetingTypeColor = (type: MeetingInterface['type']) => {
    switch (type) {
      case 'video':
        return 'bg-purple-100 text-purple-700';
      case 'phone':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getPriorityColor = (priority?: MeetingInterface['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <AddMeetingDialog open={isAddMeetingOpen} onOpenChange={setIsAddMeetingOpen}/>
      {}
      <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5}/>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight">Календарь</h1>
                <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg">Все встречи и события</p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <div className="flex items-center bg-gray-100 rounded-md sm:rounded-lg md:rounded-xl p-0.5 sm:p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className={`rounded-sm sm:rounded-md md:rounded-lg text-xs px-1.5 sm:px-2 md:px-3 h-6 sm:h-7 md:h-8 ${
                    viewMode === 'calendar'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-transparent'
                  }`}
                >
                  <Grid3x3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 md:mr-2" strokeWidth={2}/>
                  <span className="hidden md:inline">Календарь</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-sm sm:rounded-md md:rounded-lg text-xs px-1.5 sm:px-2 md:px-3 h-6 sm:h-7 md:h-8 ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-transparent'
                  }`}
                >
                  <List className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 md:mr-2" strokeWidth={2}/>
                  <span className="hidden md:inline">Список</span>
                </Button>
              </div>

              <Button
                onClick={() => setIsAddMeetingOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md sm:rounded-lg md:rounded-xl shadow-md text-xs md:text-sm h-6 sm:h-7 md:h-9 px-1.5 sm:px-2 md:px-4"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 md:mr-2" strokeWidth={2}/>
                <span className="hidden md:inline">Новая встреча</span>
              </Button>
            </div>
          </div>

          {}
          <FilterBar
            searchConfig={{
              value: searchQuery,
              onChange: setSearchQuery,
              placeholder: 'Поиск встреч...',
              className: 'flex-1',
            }}
            filters={[
              {
                value: filterType,
                onChange: setFilterType,
                placeholder: 'Тип встречи',
                width: 'w-full sm:w-[180px]',
                options: [
                  { value: 'all', label: 'Все типы' },
                  { value: 'in_person', label: 'Личные встречи' },
                  { value: 'video', label: 'Видеозвонки' },
                  { value: 'phone', label: 'Телефонные звонки' },
                ],
              },
              {
                value: filterClient,
                onChange: setFilterClient,
                placeholder: 'Клиент',
                width: 'w-full sm:w-[200px]',
                icon: User,
                options: [
                  { value: 'all', label: 'Все клиенты' },
                  ...uniqueClients.map(client => ({ value: client, label: client })),
                ],
              },
            ]}
          />
        </div>
      </header>

      {}
      <main className="py-4 sm:py-6">
        {}
        <Card
          className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 text-white mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-lg sm:text-xl tracking-tight mb-1">Сегодня</h3>
                <p className="text-xs sm:text-sm opacity-90">
                  {new Date().toLocaleDateString('ru-RU', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl tracking-tight">{todayMeetings.length}</div>
                <div className="text-xs sm:text-sm opacity-90">
                  {todayMeetings.length === 1 ? 'встреча' : 'встречи'}
                </div>
              </div>
            </div>

            {todayMeetings.length ? (
              <div className="space-y-2">
                {todayMeetings.slice(0, 2).map((meeting) => (
                  <div
                    key={meeting.id}
                    onClick={() => navigate(`/calendar/meetings/${meeting.id}`)}
                    className="p-2.5 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-white/30">
                        <AvatarFallback className="bg-white/20 text-white text-xs">
                          {meeting.client.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm truncate">{meeting.title}</div>
                        <div className="text-xs opacity-75">{meeting.time} • {meeting.client.name}</div>
                      </div>
                      <div
                        className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        {getMeetingTypeIcon(meeting.type)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 sm:py-4 opacity-75">
                <p className="text-xs sm:text-sm">Встреч на сегодня не запланировано</p>
              </div>
            )}
          </div>
        </Card>

        {}
        {viewMode === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            {}
            <Card className="lg:col-span-3 bg-white border-0 shadow-sm">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg sm:text-xl tracking-tight">
                    Календарь
                  </h3>
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
                        <ChevronLeft className="w-4 h-4" strokeWidth={2}/>
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
                        <ChevronRight className="w-4 h-4" strokeWidth={2}/>
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
                    meeting: "bg-blue-500",
                  }}
                />

                <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 rounded-xl bg-blue-50 text-center">
                    <div className="text-lg sm:text-2xl tracking-tight text-blue-600 mb-1">
                      {filteredMeetings.filter(m => m.status === MeetingStatusEnum.SCHEDULED).length}
                    </div>
                    <div className="text-xs text-blue-600">Запланировано</div>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-green-50 text-center">
                    <div className="text-lg sm:text-2xl tracking-tight text-green-600 mb-1">
                      {filteredMeetings.filter(m => m.status === MeetingStatusEnum.COMPLETED).length}
                    </div>
                    <div className="text-xs text-green-600">Завершено</div>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-gray-50 text-center">
                    <div className="text-lg sm:text-2xl tracking-tight text-gray-600 mb-1">
                      {filteredMeetings.length}
                    </div>
                    <div className="text-xs text-gray-600">Всего</div>
                  </div>
                </div>
              </div>
            </Card>

            {}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-white border-0 shadow-sm">
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">
                    {date ? date.toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                    }) : 'Выберите дату'}
                  </h3>

                  {selectedDateMeetings.length ? (
                    <div className="space-y-3">
                      {selectedDateMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          onClick={() => navigate(`/calendar/meetings/${meeting.id}`)}
                          className="group p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                        >
                          <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-gray-200">
                              <AvatarFallback
                                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                                {meeting.client.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs sm:text-sm tracking-tight mb-1 truncate">{meeting.title}</h4>
                              <p className="text-xs text-gray-500">{meeting.client.name}</p>
                            </div>
                            {meeting.priority && (
                              <Badge className={`${getPriorityColor(meeting.priority)} border-0 text-xs flex-shrink-0`}>
                                {meeting.priority === 'high' ? 'Срочно' : meeting.priority === 'medium' ? 'Средний' : 'Низкий'}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-1 sm:space-y-1.5 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2}/>
                              <span>{meeting.time} • {meeting.duration}</span>
                            </div>
                            {meeting.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2}/>
                                <span className="truncate">{meeting.location}</span>
                              </div>
                            )}
                            {meeting.case && (
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2}/>
                                <span className="truncate">{meeting.case}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-2 sm:mt-3">
                            <Badge className={`${getMeetingTypeColor(meeting.type)} border-0 text-xs`}>
                              {getMeetingTypeIcon(meeting.type)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-auto rounded-lg opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                            >
                              <MoreHorizontal className="w-4 h-4" strokeWidth={2}/>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" strokeWidth={2}/>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">Нет встреч на эту дату</p>
                    </div>
                  )}
                </div>
              </Card>

              {}
              <Card className="bg-white border-0 shadow-sm">
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">Предстоящие встречи</h3>

                  <div className="space-y-2 sm:space-y-3">
                    {upcomingMeetings.slice(0, 3).map((meeting) => (
                      <div key={meeting.id}
                           onClick={() => setDate(meeting.date)}
                           className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer">
                        <div className="flex flex-col items-center min-w-[40px] sm:min-w-[50px]">
                          <div className="text-xs sm:text-sm text-gray-900">
                            {meeting.date.toLocaleDateString('ru-RU', { day: 'numeric' })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {meeting.date.toLocaleDateString('ru-RU', { month: 'short' })}
                          </div>
                        </div>
                        <Separator orientation="vertical" className="h-8 sm:h-10 bg-gray-200"/>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm truncate mb-0.5 sm:mb-1">{meeting.title}</div>
                          <div className="text-xs text-gray-500">{meeting.client.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <MeetingsList
            meetings={filteredMeetings}
            getMeetingTypeIcon={getMeetingTypeIcon}
            getMeetingTypeColor={getMeetingTypeColor}
            getPriorityColor={getPriorityColor}
          />
        )}
      </main>
    </div>
  );
}
