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
  Search,
  Filter,
  MoreHorizontal,
  User,
  Briefcase,
  Grid3x3,
  List,
} from 'lucide-react';
import { MeetingTypeEnum, MeetingStatusEnum, MeetingPriorityEnum } from '@/app/types/calendar/calendar.enums';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { AddMeetingDialog } from './AddMeetingDialog';


export function GlobalCalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterClient, setFilterClient] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');


  const allMeetings: MeetingInterface[] = [
    {
      id: 1,
      title: 'Консультация по трудовому спору',
      client: { name: 'Иванов П.А.', avatar: 'ИП' },
      case: 'Трудовой спор - незаконное увольнение',
      date: new Date(2025, 9, 15, 10, 0),
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
      date: new Date(2025, 9, 15, 14, 30),
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
      date: new Date(2025, 9, 16, 11, 0),
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
      date: new Date(2025, 9, 18, 15, 0),
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
      date: new Date(2025, 9, 20, 16, 0),
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
      date: new Date(2025, 9, 12, 11, 0),
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

  const getPriorityColor = (priority?: Meeting['priority']) => {
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
      <AddMeetingDialog open={isAddMeetingOpen} onOpenChange={setIsAddMeetingOpen} />

      {}
      <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl tracking-tight mb-1">Календарь</h1>
              <p className="text-gray-500">Все встречи и события</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className={`rounded-lg ${
                    viewMode === 'calendar'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-transparent'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4 mr-2" strokeWidth={2} />
                  Календарь
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-transparent'
                  }`}
                >
                  <List className="w-4 h-4 mr-2" strokeWidth={2} />
                  Список
                </Button>
              </div>

              <Button
                onClick={() => setIsAddMeetingOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                Новая встреча
              </Button>
            </div>
          </div>

          {}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
              <Input
                placeholder="Поиск встреч..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-100/80 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] h-10 rounded-xl border-gray-200">
                <Filter className="w-4 h-4 mr-2" strokeWidth={2} />
                <SelectValue placeholder="Тип встречи" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="in_person">Личные встречи</SelectItem>
                <SelectItem value="video">Видеозвонки</SelectItem>
                <SelectItem value="phone">Телефонные звонки</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterClient} onValueChange={setFilterClient}>
              <SelectTrigger className="w-[200px] h-10 rounded-xl border-gray-200">
                <User className="w-4 h-4 mr-2" strokeWidth={2} />
                <SelectValue placeholder="Клиент" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Все клиенты</SelectItem>
                {uniqueClients.map(client => (
                  <SelectItem key={client} value={client}>{client}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {}
      <main className="py-6">
        {}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 text-white mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl tracking-tight mb-1">Сегодня</h3>
                <p className="text-sm opacity-90">
                  {new Date().toLocaleDateString('ru-RU', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl tracking-tight">{todayMeetings.length}</div>
                <div className="text-sm opacity-90">
                  {todayMeetings.length === 1 ? 'встреча' : 'встречи'}
                </div>
              </div>
            </div>

            {todayMeetings.length > 0 ? (
              <div className="space-y-2">
                {todayMeetings.slice(0, 2).map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 ring-2 ring-white/30">
                        <AvatarFallback className="bg-white/20 text-white text-xs">
                          {meeting.client.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{meeting.title}</div>
                        <div className="text-xs opacity-75">{meeting.time} • {meeting.client.name}</div>
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        {getMeetingTypeIcon(meeting.type)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 opacity-75">
                <p className="text-sm">Встреч на сегодня не запланировано</p>
              </div>
            )}
          </div>
        </Card>

        {}
        {viewMode === 'calendar' ? (
          <div className="grid grid-cols-5 gap-6">
            {}
            <Card className="col-span-3 bg-white border-0 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl tracking-tight">
                    {selectedMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-gray-200 hover:bg-gray-50"
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
                </div>

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

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-blue-50 text-center">
                    <div className="text-2xl tracking-tight text-blue-600 mb-1">
                      {filteredMeetings.filter(m => m.status === MeetingStatusEnum.SCHEDULED).length}
                    </div>
                    <div className="text-xs text-blue-600">Запланировано</div>
                  </div>
                  <div className="p-3 rounded-xl bg-green-50 text-center">
                    <div className="text-2xl tracking-tight text-green-600 mb-1">
                      {filteredMeetings.filter(m => m.status === MeetingStatusEnum.COMPLETED).length}
                    </div>
                    <div className="text-xs text-green-600">Завершено</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 text-center">
                    <div className="text-2xl tracking-tight text-gray-600 mb-1">
                      {filteredMeetings.length}
                    </div>
                    <div className="text-xs text-gray-600">Всего</div>
                  </div>
                </div>
              </div>
            </Card>

            {}
            <div className="col-span-2 space-y-4">
              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <h3 className="text-lg tracking-tight mb-4">
                    {date ? date.toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                    }) : 'Выберите дату'}
                  </h3>

                  {selectedDateMeetings.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="group p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar className="w-10 h-10 ring-2 ring-gray-200">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                                {meeting.client.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm tracking-tight mb-1 truncate">{meeting.title}</h4>
                              <p className="text-xs text-gray-500">{meeting.client.name}</p>
                            </div>
                            {meeting.priority && (
                              <Badge className={`${getPriorityColor(meeting.priority)} border-0 text-xs`}>
                                {meeting.priority === 'high' ? 'Срочно' : meeting.priority === 'medium' ? 'Средний' : 'Низкий'}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-1.5 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                              <span>{meeting.time} • {meeting.duration}</span>
                            </div>
                            {meeting.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                                <span className="truncate">{meeting.location}</span>
                              </div>
                            )}
                            {meeting.case && (
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-3.5 h-3.5" strokeWidth={2} />
                                <span className="truncate">{meeting.case}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <Badge className={`${getMeetingTypeColor(meeting.type)} border-0 text-xs`}>
                              {getMeetingTypeIcon(meeting.type)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-auto rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <CalendarIcon className="w-8 h-8 text-gray-400" strokeWidth={2} />
                      </div>
                      <p className="text-sm text-gray-500">Нет встреч на эту дату</p>
                    </div>
                  )}
                </div>
              </Card>

              {}
              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <h3 className="text-lg tracking-tight mb-4">Предстоящие встречи</h3>

                  <div className="space-y-3">
                    {upcomingMeetings.slice(0, 3).map((meeting) => (
                      <div key={meeting.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer">
                        <div className="flex flex-col items-center min-w-[50px]">
                          <div className="text-sm text-gray-900">
                            {meeting.date.toLocaleDateString('ru-RU', { day: 'numeric' })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {meeting.date.toLocaleDateString('ru-RU', { month: 'short' })}
                          </div>
                        </div>
                        <Separator orientation="vertical" className="h-10 bg-gray-200" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate mb-1">{meeting.title}</div>
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

          <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
            <div className="p-6">
              <h3 className="text-xl tracking-tight mb-6">Все встречи</h3>

              <div className="space-y-3">
                {filteredMeetings
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((meeting) => (
                    <div
                      key={meeting.id}
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
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
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
                              <Badge className={`${
                                meeting.status === MeetingStatusEnum.COMPLETED
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
        )}
      </main>
    </div>
  );
}
