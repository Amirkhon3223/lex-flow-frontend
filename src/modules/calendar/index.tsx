import { useState } from 'react';
import { Plus } from 'lucide-react';
import { MeetingTypeEnum, MeetingStatusEnum, MeetingPriorityEnum } from '@/app/types/calendar/calendar.enums';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { DateBlock } from './ui/DateBlock';
import { FilterPanel } from './ui/FilterPanel';
import { MeetingCard } from './ui/MeetingCard';
import { SearchBar } from './ui/SearchBar';
import { TodayCard } from './ui/TodayCard';
import { ViewToggle } from './ui/ViewToggle';

const meetings = [
    {
        id: 1,
        title: 'Консультация завершена',
        client: 'Смирнова А.В.',
        clientInitials: 'СА',
        date: '12 окт',
        time: '11:00',
        duration: '30 минут',
        location: 'Офис, кабинет 305',
        type: MeetingTypeEnum.IN_PERSON,
        status: MeetingStatusEnum.COMPLETED,
        statusText: 'Завершено',
    },
    {
        id: 2,
        title: 'Консультация по трудовому спору',
        client: 'Иванов П.А.',
        clientInitials: 'ИП',
        date: '15 окт',
        time: '10:00',
        duration: '1 час',
        location: 'Офис, кабинет 305',
        case: 'Трудовой спор - незаконное увольнение',
        type: MeetingTypeEnum.IN_PERSON,
        status: MeetingStatusEnum.SCHEDULED,
        priority: MeetingPriorityEnum.HIGH,
        statusText: 'Срочно',
        planned: true,
    },
    {
        id: 3,
        title: 'Видео-встреча: обсуждение договора',
        client: 'Смирнова А.В.',
        clientInitials: 'СА',
        date: '15 окт',
        time: '14:30',
        duration: '45 минут',
        location: 'Google Meet',
        case: 'Наследственное дело',
        type: MeetingTypeEnum.VIDEO,
        status: MeetingStatusEnum.SCHEDULED,
        priority: MeetingPriorityEnum.MEDIUM,
        statusText: 'Средний',
        planned: true,
    },
    {
        id: 4,
        title: 'Телефонная консультация',
        client: 'ООО "ТехноСтрой"',
        clientInitials: 'ТС',
        date: '16 окт',
        time: '11:00',
        duration: '30 минут',
        location: 'Договор аренды помещения',
        type: MeetingTypeEnum.PHONE,
        status: MeetingStatusEnum.SCHEDULED,
        priority: MeetingPriorityEnum.LOW,
        statusText: 'Низкий',
        planned: true,
    },
    {
        id: 5,
        title: 'Подписание документов',
        client: 'Козлов Д.М.',
        clientInitials: 'КД',
        date: '18 окт',
        time: '15:00',
        duration: '30 минут',
        location: 'Офис, кабинет 305',
        case: 'Взыскание задолженности',
        type: MeetingTypeEnum.IN_PERSON,
        status: MeetingStatusEnum.SCHEDULED,
        priority: MeetingPriorityEnum.HIGH,
        statusText: 'Срочно',
        planned: true,
    },
];

export default function CalendarPage() {
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMeetings = meetings.filter(meeting =>
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.client.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Календарь</h1>
                    <p className="text-sm text-gray-600">Все встречи и события</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Новая встреча
                </Button>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />
                        <FilterPanel />
                        <ViewToggle
                            viewMode={viewMode}
                            onViewChange={setViewMode}
                        />
                    </div>
                </CardContent>
            </Card>

            <TodayCard meetingsCount={1} />

            <Card>
                <CardHeader>
                    <CardTitle>Все встречи</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {filteredMeetings.map((meeting) => (
                            <div key={meeting.id} className="flex items-start gap-4">
                                <DateBlock date={meeting.date} time={meeting.time} />
                                <MeetingCard {...meeting} />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
