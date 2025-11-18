import { useState, useEffect } from 'react';
import { Plus, Sparkles, Video, Phone, Users, User } from 'lucide-react';
import { MeetingTypeEnum, MeetingStatusEnum, MeetingPriorityEnum } from '@/app/types/calendar/calendar.enums';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { AddMeetingDialog } from '@/modules/calendar/components/AddMeetingDialog';
import { CalendarWidget } from '@/modules/calendar/components/CalendarWidget';
import { MeetingsList } from '@/modules/calendar/components/MeetingsList';
import { SelectedDateMeetings } from '@/modules/calendar/components/SelectedDateMeetings';
import { UpcomingMeetings } from '@/modules/calendar/components/UpcomingMeetings';
import { TodayCard } from '@/modules/calendar/ui/TodayCard';
import { ViewToggle } from '@/modules/calendar/ui/ViewToggle';
import { FilterBar } from '@/shared/components/filters/FilterBar';
import { Button } from '@/shared/ui/button';

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
  {
    id: 8,
    title: 'Заседание в суде',
    client: { name: 'Иванов П.А.', avatar: 'ИП' },
    case: 'Трудовой спор - незаконное увольнение',
    date: new Date(2025, 10, 17, 16, 0),
    time: '10:00',
    duration: '2 часа',
    type: MeetingTypeEnum.IN_PERSON,
    location: 'Районный суд',
    status: MeetingStatusEnum.SCHEDULED,
    priority: MeetingPriorityEnum.HIGH,
  },
  {
    id: 9,
    title: 'Заседание в суде',
    client: { name: 'Иванов П.А.', avatar: 'ИП' },
    case: 'Трудовой спор - незаконное увольнение',
    date: new Date(2025, 10, 17, 16, 0),
    time: '10:00',
    duration: '2 часа',
    type: MeetingTypeEnum.IN_PERSON,
    location: 'Районный суд',
    status: MeetingStatusEnum.SCHEDULED,
    priority: MeetingPriorityEnum.HIGH,
  },
  {
    id: 10,
    title: 'Заседание в суде',
    client: { name: 'Иванов П.А.', avatar: 'ИП' },
    case: 'Трудовой спор - незаконное увольнение',
    date: new Date(2025, 10, 17, 16, 0),
    time: '10:00',
    duration: '2 часа',
    type: MeetingTypeEnum.IN_PERSON,
    location: 'Районный суд',
    status: MeetingStatusEnum.SCHEDULED,
    priority: MeetingPriorityEnum.HIGH,
  },
];

export function CalendarPage() {
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

  const filteredMeetings = allMeetings.filter(meeting => {
    const matchesType = filterType === 'all' || meeting.type === filterType;
    const matchesClient = filterClient === 'all' || meeting.client.name === filterClient;
    const matchesSearch =
      searchQuery === '' ||
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.client.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesClient && matchesSearch;
  });

  const selectedDateMeetings = filteredMeetings
    .filter(meeting => {
      if (!date) return false;
      return (
        meeting.date.getDate() === date.getDate() &&
        meeting.date.getMonth() === date.getMonth() &&
        meeting.date.getFullYear() === date.getFullYear()
      );
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const upcomingMeetings = filteredMeetings
    .filter(m => m.status === MeetingStatusEnum.SCHEDULED && m.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const today = new Date();
  const todayMeetings = filteredMeetings
    .filter(
      meeting =>
        meeting.date.getDate() === today.getDate() &&
        meeting.date.getMonth() === today.getMonth() &&
        meeting.date.getFullYear() === today.getFullYear() &&
        meeting.status === MeetingStatusEnum.SCHEDULED
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const meetingDates = filteredMeetings.map(m => m.date);
  const uniqueClients = Array.from(new Set(allMeetings.map(m => m.client.name)));

  const getMeetingTypeIcon = (type: MeetingInterface['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" strokeWidth={2} />;
      case 'phone':
        return <Phone className="w-4 h-4" strokeWidth={2} />;
      default:
        return <Users className="w-4 h-4" strokeWidth={2} />;
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
      <AddMeetingDialog open={isAddMeetingOpen} onOpenChange={setIsAddMeetingOpen} />

      <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight">Календарь</h1>
                <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg">Все встречи и события</p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />

              <Button
                onClick={() => setIsAddMeetingOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md sm:rounded-lg md:rounded-xl shadow-md text-xs md:text-sm h-6 sm:h-7 md:h-9 px-1.5 sm:px-2 md:px-4"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 md:mr-2" strokeWidth={2} />
                <span className="hidden md:inline">Новая встреча</span>
              </Button>
            </div>
          </div>

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

      <main className="py-4 sm:py-6">
        <TodayCard meetingsCount={todayMeetings.length} />

        {viewMode === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            <CalendarWidget
              date={date}
              setDate={setDate}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              meetingDates={meetingDates}
              meetings={filteredMeetings}
            />

            <div className="lg:col-span-2 space-y-4">
              <SelectedDateMeetings
                date={date}
                meetings={selectedDateMeetings}
                getMeetingTypeIcon={getMeetingTypeIcon}
                getMeetingTypeColor={getMeetingTypeColor}
                getPriorityColor={getPriorityColor}
              />

              <UpcomingMeetings meetings={upcomingMeetings} onSelectDate={setDate} />
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
