/**
 * @file ClientsListView.tsx
 * @description Страница списка всех клиентов с фильтрацией, поиском и статистикой
 *
 * НАЗНАЧЕНИЕ:
 * - Отображение всех клиентов юриста в табличном виде
 * - Фильтрация по типу (физлицо/юрлицо/ИП), категории, статусу
 * - Поиск клиентов по имени и email
 * - Статистика по клиентам (всего, активные, VIP, активных дел)
 * - Подробная информация о каждом клиенте
 *
 * ИСПОЛЬЗОВАНИЕ:
 * - Открывается при клике на "Клиенты" в Sidebar
 * - Используется в App.tsx через viewMode === 'clientsList'
 * - Роут в FSD: /clients
 *
 * МИГРАЦИЯ В FSD:
 * - Перенести в src/pages/ClientsListPage/ui/ClientsListView.tsx
 * - Список клиентов вынести в src/widgets/ClientsList
 * - Фильтры в src/features/ClientsFilters
 * - Статистику в src/widgets/ClientsStats
 * - Логику в src/pages/ClientsListPage/model/useClientsList.ts
 * - API в src/entities/client/api/getClients.ts
 *
 * ПЕРЕИСПОЛЬЗУЕМОСТЬ:
 * - Page компонент (специфичен для LexFlow)
 * - Виджеты (ClientsList, ClientsStats) можно переиспользовать
 *
 * ОСОБЕННОСТИ:
 * - Табличное представление с подробной информацией
 * - Типы клиентов: физлицо, юрлицо, ИП (с иконками)
 * - Категории: Стандарт, Премиум, VIP
 * - Контакты (email, телефон) в таблице
 * - Статистика по делам (активные/всего)
 * - Общий доход от клиента
 * - Последний контакт (дата)
 * - Dropdown меню действий (профиль, редактировать, написать, удалить)
 * - Mock data (в продакшене - из API)
 *
 * TODO:
 * - Добавить пагинацию
 * - Сортировка по колонкам
 * - Экспорт данных (Excel, VCF)
 * - Массовые действия
 * - Режим сетки (Grid view)
 */

import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Users,
  Building2,
} from 'lucide-react';
import { ClientTypeEnum, ClientCategoryEnum, ClientStatusEnum } from '@/app/types/clients/clients.enums';
import type { ClientInterface } from '@/app/types/clients/clients.interfaces';
import { AddClientDialog } from '@/shared/components/AddClientDialog';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'; // shared/ui в FSD
import { Badge } from '@/shared/ui/badge'; // shared/ui в FSD
import { Button } from '@/shared/ui/button'; // shared/ui в FSD
import { Card } from '@/shared/ui/card'; // shared/ui в FSD
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Input } from '@/shared/ui/input'; // shared/ui в FSD
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';


export function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);

  const clients: ClientInterface[] = [
    {
      id: 1,
      name: 'Иванов Петр Алексеевич',
      avatar: 'ИП',
      type: ClientTypeEnum.INDIVIDUAL,
      category: ClientCategoryEnum.VIP,
      email: 'ivanov@mail.ru',
      phone: '+7 (999) 123-45-67',
      activeCases: 3,
      totalCases: 5,
      totalRevenue: 250000,
      lastContact: '2 часа назад',
      status: ClientStatusEnum.ACTIVE,
      joinDate: 'Янв 2024',
    },
    {
      id: 2,
      name: 'ООО "ТехноСтрой"',
      avatar: 'ТС',
      type: ClientTypeEnum.LEGAL,
      category: ClientCategoryEnum.PREMIUM,
      email: 'info@tehnostroy.ru',
      phone: '+7 (495) 123-45-67',
      activeCases: 2,
      totalCases: 8,
      totalRevenue: 850000,
      lastContact: '1 день назад',
      status: ClientStatusEnum.ACTIVE,
      joinDate: 'Мар 2023',
    },
    {
      id: 3,
      name: 'Смирнова Анна Викторовна',
      avatar: 'СА',
      type: ClientTypeEnum.INDIVIDUAL,
      category: ClientCategoryEnum.STANDARD,
      email: 'smirnova@gmail.com',
      phone: '+7 (999) 234-56-78',
      activeCases: 1,
      totalCases: 2,
      totalRevenue: 120000,
      lastContact: '3 часа назад',
      status: ClientStatusEnum.ACTIVE,
      joinDate: 'Июн 2024',
    },
    {
      id: 4,
      name: 'ИП Козлов Дмитрий Михайлович',
      avatar: 'КД',
      type: ClientTypeEnum.ENTREPRENEUR,
      category: ClientCategoryEnum.PREMIUM,
      email: 'kozlov.ip@yandex.ru',
      phone: '+7 (999) 345-67-89',
      activeCases: 2,
      totalCases: 4,
      totalRevenue: 320000,
      lastContact: '5 дней назад',
      status: ClientStatusEnum.ACTIVE,
      joinDate: 'Фев 2024',
    },
    {
      id: 5,
      name: 'Петрова Мария Ивановна',
      avatar: 'ПМ',
      type: ClientTypeEnum.INDIVIDUAL,
      category: ClientCategoryEnum.STANDARD,
      email: 'petrova.mi@mail.ru',
      phone: '+7 (999) 456-78-90',
      activeCases: 1,
      totalCases: 1,
      totalRevenue: 75000,
      lastContact: '2 дня назад',
      status: ClientStatusEnum.ACTIVE,
      joinDate: 'Окт 2025',
    },
    {
      id: 6,
      name: 'ООО "Строй+"',
      avatar: 'СП',
      type: ClientTypeEnum.LEGAL,
      category: ClientCategoryEnum.VIP,
      email: 'legal@stroyplus.ru',
      phone: '+7 (495) 234-56-78',
      activeCases: 4,
      totalCases: 12,
      totalRevenue: 1250000,
      lastContact: '4 часа назад',
      status: ClientStatusEnum.ACTIVE,
      joinDate: 'Янв 2023',
    },
    {
      id: 7,
      name: 'Соколова Екатерина Петровна',
      avatar: 'СЕ',
      type: ClientTypeEnum.INDIVIDUAL,
      category: ClientCategoryEnum.STANDARD,
      email: 'sokolova@inbox.ru',
      phone: '+7 (999) 567-89-01',
      activeCases: 1,
      totalCases: 1,
      totalRevenue: 45000,
      lastContact: '1 день назад',
      status: ClientStatusEnum.ACTIVE,
      joinDate: 'Окт 2025',
    },
    {
      id: 8,
      name: 'Васильев Андрей Сергеевич',
      avatar: 'ВА',
      type: ClientTypeEnum.INDIVIDUAL,
      category: ClientCategoryEnum.STANDARD,
      email: 'vasiliev@gmail.com',
      phone: '+7 (999) 678-90-12',
      activeCases: 0,
      totalCases: 2,
      totalRevenue: 95000,
      lastContact: '2 недели назад',
      status: ClientStatusEnum.INACTIVE,
      joinDate: 'Май 2024',
    },
    {
      id: 9,
      name: 'ООО "ИнвестГрупп"',
      avatar: 'ИГ',
      type: ClientTypeEnum.LEGAL,
      category: ClientCategoryEnum.PREMIUM,
      email: 'office@investgroup.ru',
      phone: '+7 (495) 345-67-89',
      activeCases: 0,
      totalCases: 0,
      totalRevenue: 0,
      lastContact: 'Нет контактов',
      status: ClientStatusEnum.PENDING,
      joinDate: 'Окт 2025',
    },
  ];


  const filteredClients = clients.filter(client => {
    const matchesSearch = searchQuery === '' ||
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || client.type === filterType;
    const matchesCategory = filterCategory === 'all' || client.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const getCategoryBadge = (category: ClientCategoryEnum) => {
    const styles = {
      [ClientCategoryEnum.VIP]: 'bg-purple-100 text-purple-700',
      [ClientCategoryEnum.PREMIUM]: 'bg-blue-100 text-blue-700',
      [ClientCategoryEnum.STANDARD]: 'bg-gray-100 text-gray-700',
    };
    const labels = {
      [ClientCategoryEnum.VIP]: 'VIP',
      [ClientCategoryEnum.PREMIUM]: 'Премиум',
      [ClientCategoryEnum.STANDARD]: 'Стандарт',
    };
    return <Badge className={`${styles[category]} border-0`}>{labels[category]}</Badge>;
  };

  const getStatusBadge = (status: ClientStatusEnum) => {
    const styles = {
      [ClientStatusEnum.ACTIVE]: 'bg-green-100 text-green-700',
      [ClientStatusEnum.INACTIVE]: 'bg-gray-100 text-gray-700',
      [ClientStatusEnum.PENDING]: 'bg-amber-100 text-amber-700',
    };
    const labels = {
      [ClientStatusEnum.ACTIVE]: 'Активен',
      [ClientStatusEnum.INACTIVE]: 'Неактивен',
      [ClientStatusEnum.PENDING]: 'Ожидание',
    };
    return <Badge className={`${styles[status]} border-0 text-xs`}>{labels[status]}</Badge>;
  };

  const getTypeIcon = (type: ClientTypeEnum) => {
    switch (type) {
      case ClientTypeEnum.LEGAL:
        return <Building2 className="w-4 h-4" strokeWidth={2} />;
      case ClientTypeEnum.ENTREPRENEUR:
        return <Briefcase className="w-4 h-4" strokeWidth={2} />;
      default:
        return <Users className="w-4 h-4" strokeWidth={2} />;
    }
  };

  const stats = [
    { label: 'Всего клиентов', value: clients.length, color: 'text-blue-500', icon: Users },
    { label: 'Активные', value: clients.filter(c => c.status === ClientStatusEnum.ACTIVE).length, color: 'text-green-500', icon: TrendingUp },
    { label: 'VIP', value: clients.filter(c => c.category === ClientCategoryEnum.VIP).length, color: 'text-purple-500', icon: Star },
    { label: 'Активных дел', value: clients.reduce((sum, c) => sum + c.activeCases, 0), color: 'text-orange-500', icon: Briefcase },
  ];

  return (
    <div>
      <AddClientDialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen} />

      {}
      <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl tracking-tight mb-1">Клиенты</h1>
              <p className="text-gray-500">База клиентов и контакты</p>
            </div>

            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
              onClick={() => setIsAddClientDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
              Новый клиент
            </Button>
          </div>

          {}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
              <Input
                placeholder="Поиск клиентов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-100/80 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] h-10 rounded-xl border-gray-200">
                <Filter className="w-4 h-4 mr-2" strokeWidth={2} />
                <SelectValue placeholder="Тип" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="individual">Физ. лицо</SelectItem>
                <SelectItem value="legal">Юр. лицо</SelectItem>
                <SelectItem value="entrepreneur">ИП</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[160px] h-10 rounded-xl border-gray-200">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="premium">Премиум</SelectItem>
                <SelectItem value="standard">Стандарт</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px] h-10 rounded-xl border-gray-200">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="inactive">Неактивные</SelectItem>
                <SelectItem value="pending">Ожидание</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {}
      <main className="py-6">
        {}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-0 shadow-sm">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-3xl tracking-tight mb-1 ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} strokeWidth={2} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {}
        <Card className="bg-white border-0 shadow-sm rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="text-gray-600">Клиент</TableHead>
                <TableHead className="text-gray-600">Тип</TableHead>
                <TableHead className="text-gray-600">Категория</TableHead>
                <TableHead className="text-gray-600">Контакты</TableHead>
                <TableHead className="text-gray-600">Дела</TableHead>
                <TableHead className="text-gray-600">Доход</TableHead>
                <TableHead className="text-gray-600">Последний контакт</TableHead>
                <TableHead className="text-gray-600">Статус</TableHead>
                <TableHead className="text-right text-gray-600">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-gray-100">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                          {client.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="tracking-tight mb-0.5">{client.name}</div>
                        <div className="text-xs text-gray-500">
                          С {client.joinDate}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getTypeIcon(client.type)}
                      <span>
                        {client.type === ClientTypeEnum.INDIVIDUAL ? 'Физ. лицо' :
                          client.type === ClientTypeEnum.LEGAL ? 'Юр. лицо' : 'ИП'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(client.category)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                        <span className="truncate max-w-[180px]">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="text-blue-600">{client.activeCases}</span>
                      <span className="text-gray-400"> / {client.totalCases}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <DollarSign className="w-3.5 h-3.5 text-green-600" strokeWidth={2} />
                      <span className="text-gray-900">
                        {client.totalRevenue.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                      {client.lastContact}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="w-4 h-4 mr-2" strokeWidth={2} />
                          Профиль
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" strokeWidth={2} />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Mail className="w-4 h-4 mr-2" strokeWidth={2} />
                          Написать
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
