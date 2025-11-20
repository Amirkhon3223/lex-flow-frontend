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
  Plus,
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
  Building2, Sparkles,
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/config/routes.config.ts";
import { ClientTypeEnum, ClientCategoryEnum, ClientStatusEnum } from '@/app/types/clients/clients.enums';
import type { ClientInterface } from '@/app/types/clients/clients.interfaces';
import { StatCard } from '@/shared/ui/stat-card';
import { AddClientDialog } from '@/shared/components/AddClientDialog';
import { EditClientDialog } from '@/shared/components/EditClientDialog';
import { FilterBar } from '@/shared/components/filters/FilterBar';
import { ActionsMenu } from '@/shared/components/menus/ActionsMenu';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';


export function ClientsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);

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
    { label: 'Всего клиентов', value: clients.length, icon: Users, color: 'text-blue-500' },
    { label: 'Активные', value: clients.filter(c => c.status === ClientStatusEnum.ACTIVE).length, icon: TrendingUp, color: 'text-green-500' },
    { label: 'VIP', value: clients.filter(c => c.category === ClientCategoryEnum.VIP).length, icon: Star, color: 'text-purple-500' },
    { label: 'Активных дел', value: clients.reduce((sum, c) => sum + c.activeCases, 0), icon: Briefcase, color: 'text-orange-500' },
  ];

  return (
    <div>
      <AddClientDialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen} />
      <EditClientDialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen} />

      { }
      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight">Клиенты</h1>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">База клиентов и контакты</p>
              </div>
            </div>

            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md w-full sm:w-auto"
              onClick={() => setIsAddClientDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
              Новый клиент
            </Button>
          </div>

          { }
          <FilterBar
            searchConfig={{
              value: searchQuery,
              onChange: setSearchQuery,
              placeholder: 'Поиск клиентов...',
              className: 'flex-1 max-w-md',
            }}
            filters={[
              {
                value: filterType,
                onChange: setFilterType,
                placeholder: 'Тип',
                width: 'w-[180px]',
                options: [
                  { value: 'all', label: 'Все типы' },
                  { value: 'individual', label: 'Физ. лицо' },
                  { value: 'legal', label: 'Юр. лицо' },
                  { value: 'entrepreneur', label: 'ИП' },
                ],
              },
              {
                value: filterCategory,
                onChange: setFilterCategory,
                placeholder: 'Категория',
                width: 'w-[160px]',
                options: [
                  { value: 'all', label: 'Все категории' },
                  { value: 'vip', label: 'VIP' },
                  { value: 'premium', label: 'Премиум' },
                  { value: 'standard', label: 'Стандарт' },
                ],
              },
              {
                value: filterStatus,
                onChange: setFilterStatus,
                placeholder: 'Статус',
                width: 'w-[160px]',
                options: [
                  { value: 'all', label: 'Все статусы' },
                  { value: 'active', label: 'Активные' },
                  { value: 'inactive', label: 'Неактивные' },
                  { value: 'pending', label: 'Ожидание' },
                ],
              },
            ]}
          />
        </div>
      </header>

      { }
      <main className="py-4 sm:py-6">
        { }
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.color}
              // Map the text color to a background color for consistency with other modules
              iconBg={
                stat.color === 'text-blue-500' ? 'bg-blue-50' :
                  stat.color === 'text-green-500' ? 'bg-green-50' :
                    stat.color === 'text-purple-500' ? 'bg-purple-50' :
                      stat.color === 'text-orange-500' ? 'bg-orange-50' : 'bg-muted'
              }
              valueColor={stat.color}
            />
          ))}
        </div>

        { }
        <Card className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Клиент</TableHead>
                <TableHead className="text-muted-foreground">Тип</TableHead>
                <TableHead className="text-muted-foreground">Категория</TableHead>
                <TableHead className="text-muted-foreground">Контакты</TableHead>
                <TableHead className="text-muted-foreground">Дела</TableHead>
                <TableHead className="text-muted-foreground">Доход</TableHead>
                <TableHead className="text-muted-foreground">Последний контакт</TableHead>
                <TableHead className="text-muted-foreground">Статус</TableHead>
                <TableHead className="text-right text-muted-foreground">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}
                  className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(ROUTES.CLIENTS.DETAIL(client.id.toString()))}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-border">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                          {client.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="tracking-tight mb-0.5">{client.name}</div>
                        <div className="text-xs text-muted-foreground">
                          С {client.joinDate}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                        <span className="truncate max-w-[180px]">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="text-blue-600">{client.activeCases}</span>
                      <span className="text-muted-foreground"> / {client.totalCases}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <DollarSign className="w-3.5 h-3.5 text-green-600" strokeWidth={2} />
                      <span className="text-foreground">
                        {client.totalRevenue.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                      {client.lastContact}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell className="text-right">
                    <ActionsMenu
                      items={[
                        {
                          icon: Eye,
                          label: 'Профиль',
                          onClick: () => { },
                        },
                        {
                          icon: Edit,
                          label: 'Редактировать',
                          onClick: () => setIsEditClientDialogOpen(true),
                          separator: true,
                        },
                        {
                          icon: Mail,
                          label: 'Написать',
                          onClick: () => { },
                        },
                        {
                          icon: Trash2,
                          label: 'Удалить',
                          onClick: () => { },
                          variant: 'danger',
                          separator: true,
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Mobile card view */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:hidden">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              onClick={() => navigate(ROUTES.CLIENTS.DETAIL(client.id.toString()))}
              className="bg-card border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="w-10 h-10 ring-2 ring-border flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                        {client.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="tracking-tight text-sm truncate">{client.name}</div>
                      <div className="text-xs text-muted-foreground">С {client.joinDate}</div>
                    </div>
                  </div>
                  {getCategoryBadge(client.category)}
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {getTypeIcon(client.type)}
                    <span>
                      {client.type === ClientTypeEnum.INDIVIDUAL ? 'Физ. лицо' :
                        client.type === ClientTypeEnum.LEGAL ? 'Юр. лицо' : 'ИП'}
                    </span>
                    <span className="ml-auto">{getStatusBadge(client.status)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                    {client.phone}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-border pt-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-muted-foreground">Дела: </span>
                      <span className="text-blue-600">{client.activeCases}</span>
                      <span className="text-muted-foreground">/{client.totalCases}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-green-600" strokeWidth={2} />
                      <span className="text-foreground">{client.totalRevenue.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
