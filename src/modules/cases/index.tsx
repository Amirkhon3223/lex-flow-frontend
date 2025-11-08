import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CaseCard } from './ui/CaseCard';
import { FilterTabs } from './ui/FilterTabs';
import { SearchBar } from './ui/SearchBar';

const cases = [
  {
    id: 1,
    title: 'Трудовой спор - незаконное увольнение',
    client: 'Иванов Петр Алексеевич',
    clientInitials: 'ИП',
    category: 'Трудовое право',
    deadline: '20 октября 2025',
    daysLeft: 2,
    progress: 75,
    documents: 8,
    events: 12,
    status: 'urgent',
    statusText: 'Срочно',
  },
  {
    id: 2,
    title: 'Договор аренды помещения',
    client: 'ООО "ТехноСтрой"',
    clientInitials: 'ТС',
    category: 'Договорное право',
    deadline: '15 ноября 2025',
    daysLeft: 28,
    progress: 45,
    documents: 5,
    events: 7,
    status: 'medium',
    statusText: 'В работе',
  },
  {
    id: 3,
    title: 'Наследственное дело',
    client: 'Смирнова Анна Викторовна',
    clientInitials: 'СА',
    category: 'Наследственное дело',
    deadline: '30 ноября 2025',
    daysLeft: 43,
    progress: 30,
    documents: 12,
    events: 4,
    status: 'low',
    statusText: 'Низкий приоритет',
  },
  {
    id: 4,
    title: 'Восстановление на работе',
    client: 'Иванов Петр Алексеевич',
    clientInitials: 'ИП',
    category: 'Трудовое право',
    deadline: '25 ноября 2025',
    daysLeft: 38,
    progress: 60,
    documents: 6,
    events: 9,
    status: 'medium',
    statusText: 'В работе',
  },
  {
    id: 5,
    title: 'Взыскание задолженности по зарплате',
    client: 'Козлов Дмитрий Михайлович',
    clientInitials: 'КД',
    category: 'Трудовое право',
    deadline: '10 октября 2025',
    daysLeft: -5,
    progress: 100,
    documents: 10,
    events: 15,
    status: 'completed',
    statusText: 'Завершено',
  },
];

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'urgent' | 'medium' | 'completed'>('all');

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дела</h1>
          <p className="text-sm text-gray-600">Управление всеми делами и проектами</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Новое дело
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Активные дела</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">47</div>
            <div className="mt-1 text-sm text-green-600">+8% за месяц</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Срочные</div>
            <div className="mt-2 text-3xl font-bold text-red-600">3</div>
            <div className="mt-1 text-sm text-gray-600">требуют внимания</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Завершено</div>
            <div className="mt-2 text-3xl font-bold text-green-600">128</div>
            <div className="mt-1 text-sm text-green-600">+15 в этом месяце</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Успешных</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">87%</div>
            <div className="mt-1 text-sm text-gray-600">процент успеха</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <FilterTabs filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список дел ({filteredCases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCases.map((caseItem) => (
              <CaseCard key={caseItem.id} caseItem={caseItem} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
