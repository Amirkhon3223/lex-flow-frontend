import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ClientCard } from './ui/ClientCard';
import { SearchBar } from './ui/SearchBar';
import { StatsCards } from './ui/StatsCards';

const clients = [
  {
    id: 1,
    name: 'Иванов Петр Алексеевич',
    initials: 'ИП',
    type: 'Физическое лицо',
    category: 'VIP',
    status: 'Активный клиент',
    since: 'Клиент с января 2024',
    activeCases: 3,
    totalRevenue: '250 000 ₽',
    email: 'ivanov@mail.ru',
    phone: '+7 (999) 123-45-67',
  },
  {
    id: 2,
    name: 'ООО "ТехноСтрой"',
    initials: 'ТС',
    type: 'Юридическое лицо',
    category: 'Корпоративный',
    status: 'Активный клиент',
    since: 'Клиент с марта 2024',
    activeCases: 5,
    totalRevenue: '1 200 000 ₽',
    email: 'info@tehnostroy.ru',
    phone: '+7 (495) 123-45-67',
  },
  {
    id: 3,
    name: 'Смирнова Анна Викторовна',
    initials: 'СА',
    type: 'Физическое лицо',
    category: 'Стандарт',
    status: 'Активный клиент',
    since: 'Клиент с июня 2024',
    activeCases: 1,
    totalRevenue: '85 000 ₽',
    email: 'smirnova@mail.ru',
    phone: '+7 (903) 456-78-90',
  },
  {
    id: 4,
    name: 'Козлов Дмитрий Михайлович',
    initials: 'КД',
    type: 'Физическое лицо',
    category: 'Стандарт',
    status: 'Активный клиент',
    since: 'Клиент с февраля 2024',
    activeCases: 2,
    totalRevenue: '150 000 ₽',
    email: 'kozlov@mail.ru',
    phone: '+7 (916) 234-56-78',
  },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Клиенты</h1>
          <p className="text-sm text-gray-600">Управление клиентами и контактами</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Новый клиент
        </Button>
      </div>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <StatsCards />

      <Card>
        <CardHeader>
          <CardTitle>Список клиентов ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
