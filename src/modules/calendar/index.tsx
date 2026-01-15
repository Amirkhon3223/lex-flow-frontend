import { useState, useEffect } from 'react';
import { Plus, Sparkles, Video, Phone, Users, User, Scale } from 'lucide-react';
import { useMeetingsStore } from '@/app/store/meetings.store';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { AddMeetingDialog } from '@/modules/calendar/components/AddMeetingDialog';
import { CalendarWidget } from '@/modules/calendar/components/CalendarWidget';
import { MeetingsList } from '@/modules/calendar/components/MeetingsList';
import { SelectedDateMeetings } from '@/modules/calendar/components/SelectedDateMeetings';
import { UpcomingMeetings } from '@/modules/calendar/components/UpcomingMeetings';
import { TodayCard } from '@/modules/calendar/ui/TodayCard';
import { ViewToggle } from '@/modules/calendar/ui/ViewToggle';
import { FilterBar } from '@/shared/components/filters/FilterBar';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { parseLocalDate } from '@/shared/utils';

const isCourtSession = (title: string): boolean => {
  return title.toLowerCase().includes('судебное заседание') || title.toLowerCase().includes('суд');
};
export function CalendarPage() {
  const { t } = useI18n();
  const {
    meetings,
    todayMeetings,
    upcomingMeetings,
    monthMeetings,
    loading,
    fetchMeetings,
    fetchToday,
    fetchUpcoming,
    fetchMonth,
  } = useMeetingsStore();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterClient, setFilterClient] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMeetings();
    fetchToday();
    fetchUpcoming(10);
  }, [fetchMeetings, fetchToday, fetchUpcoming]);

  useEffect(() => {
    fetchMonth(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1);
  }, [selectedMonth, fetchMonth]);

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesType = filterType === 'all' || meeting.type === filterType;
    const matchesClient = filterClient === 'all' || meeting.clientName === filterClient;
    const matchesSearch =
      searchQuery === '' ||
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (meeting.clientName && meeting.clientName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesClient && matchesSearch;
  });

  const selectedDateMeetings = filteredMeetings
    .filter((meeting) => {
      if (!date) return false;
      const meetingDate = parseLocalDate(meeting.date);
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      );
    })
    .sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime());

  const meetingDates = monthMeetings?.days
    ? monthMeetings.days
        .filter((day) => day.count > 0)
        .map((day) => parseLocalDate(day.date))
    : [];

  const uniqueClients = Array.from(
    new Set(meetings.map((m) => m.clientName).filter((name): name is string => Boolean(name)))
  );

  const getMeetingTypeIcon = (type: MeetingInterface['type'], title?: string) => {
    if (title && isCourtSession(title)) {
      return <Scale className="w-4 h-4" strokeWidth={2} />;
    }

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
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'phone':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    }
  };

  const getPriorityColor = (priority?: MeetingInterface['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleMeetingSubmit = () => {
    fetchMeetings();
    fetchToday();
    fetchUpcoming(10);
    fetchMonth(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1);
  };

  return (
    <div>
      <AddMeetingDialog
        open={isAddMeetingOpen}
        onOpenChange={setIsAddMeetingOpen}
        onSubmit={handleMeetingSubmit}
      />

      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                <Sparkles
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight">
                  {t('CALENDAR.TITLE')}
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg">
                  {t('CALENDAR.SUBTITLE')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />

              <Button
                onClick={() => setIsAddMeetingOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md sm:rounded-lg md:rounded-xl shadow-md text-xs md:text-sm h-6 sm:h-7 md:h-9 px-1.5 sm:px-2 md:px-4"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 md:mr-2" strokeWidth={2} />
                <span className="hidden md:inline">{t('CALENDAR.NEW_MEETING')}</span>
              </Button>
            </div>
          </div>

          <FilterBar
            searchConfig={{
              value: searchQuery,
              onChange: setSearchQuery,
              placeholder: t('CALENDAR.FIELDS.SEARCH_PLACEHOLDER'),
              className: 'flex-1',
            }}
            filters={[
              {
                value: filterType,
                onChange: setFilterType,
                placeholder: t('CALENDAR.FILTERS.ALL_TYPES'),
                width: 'w-full sm:w-[180px]',
                options: [
                  { value: 'all', label: t('CALENDAR.FILTERS.ALL_TYPES') },
                  { value: 'in_person', label: t('CALENDAR.FILTERS.IN_PERSON') },
                  { value: 'video', label: t('CALENDAR.FILTERS.VIDEO') },
                  { value: 'phone', label: t('CALENDAR.FILTERS.PHONE') },
                ],
              },
              {
                value: filterClient,
                onChange: setFilterClient,
                placeholder: t('CALENDAR.FILTERS.CLIENT'),
                width: 'w-full sm:w-[200px]',
                icon: User,
                options: [
                  { value: 'all', label: t('CALENDAR.FILTERS.ALL_CLIENTS') },
                  ...uniqueClients.map((client) => ({ value: client, label: client })),
                ],
              },
            ]}
          />
        </div>
      </header>

      <main className="py-4 sm:py-6">
        {loading && meetings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('COMMON.LOADING')}</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}
