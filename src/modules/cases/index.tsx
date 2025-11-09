/**
 * @file CasesListView.tsx
 * @description Страница списка всех дел с фильтрацией, поиском и статистикой
 *
 * НАЗНАЧЕНИЕ:
 * - Отображение всех дел юриста в табличном или Grid виде
 * - Фильтрация по статусу, приоритету, категории
 * - Поиск дел по названию и клиенту
 * - Статистика по делам (всего, в работе, завершено, срочные)
 * - Переключение режима отображения (таблица/сетка)
 *
 * ИСПОЛЬЗОВАНИЕ:
 * - Открывается при клике на "Дела" в Sidebar
 * - Используется в App.tsx через viewMode === 'casesList'
 * - Роут в FSD: /cases
 *
 * МИГРАЦИЯ В FSD:
 * - Перенести в src/pages/CasesListPage/ui/CasesListView.tsx
 * - Список дел вынести в src/widgets/CasesList
 * - Фильтры в src/features/CasesFilters
 * - Статистику в src/widgets/CasesStats
 * - Логику в src/pages/CasesListPage/model/useCasesList.ts
 * - API в src/entities/case/api/getCases.ts
 *
 * ПЕРЕИСПОЛЬЗУЕМОСТЬ:
 * - Page компонент (специфичен для LexFlow)
 * - Виджеты (CasesList, CasesStats) можно переиспользовать
 *
 * ОСОБЕННОСТИ:
 * - Два режима просмотра: таблица (Table) и сетка (Grid)
 * - Множественные фильтры (статус, приоритет, категория)
 * - Поиск в реальном времени
 * - Статистика в header (4 карточки)
 * - Dropdown меню действий (открыть, редактировать, удалить)
 * - Прогресс бар для каждого дела
 * - Mock data (в продакшене - из API)
 *
 * TODO:
 * - Добавить пагинацию/бесконечный скролл
 * - Сортировка по колонкам
 * - Экспорт данных (Excel, PDF)
 * - Массовые действия (выбрать несколько дел)
 */

import { useState } from 'react';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  FileText,
  Eye,
  Edit,
  Trash2,
  Grid3x3,
  List,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { CaseStatusEnum, CasePriorityEnum } from '@/app/types/cases/cases.enums';
import type { CaseInterface } from '@/app/types/cases/cases.interfaces';
import { AddCaseDialog } from '@/shared/components/AddCaseDialog';
import { CaseFilters } from '@/modules/cases/ui/CaseFilters';
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
import { Progress } from '@/shared/ui/progress'; // shared/ui в FSD
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';


export function CasePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isAddCaseDialogOpen, setIsAddCaseDialogOpen] = useState(false);

  const cases: CaseInterface[] = [
    {
      id: 1,
      title: 'Трудовой спор - незаконное увольнение',
      client: { name: 'Иванов П.А.', avatar: 'ИП' },
      category: 'Трудовое право',
      status: CaseStatusEnum.IN_PROGRESS,
      priority: CasePriorityEnum.HIGH,
      deadline: '20 окт 2025',
      progress: 75,
      documents: 8,
      createdAt: '5 окт 2025',
      lastUpdate: '2 часа назад',
    },
    {
      id: 2,
      title: 'Договор аренды помещения',
      client: { name: 'ООО "ТехноСтрой"', avatar: 'ТС' },
      category: 'Договорное право',
      status: CaseStatusEnum.REVIEW,
      priority: CasePriorityEnum.MEDIUM,
      deadline: '25 окт 2025',
      progress: 60,
      documents: 12,
      createdAt: '8 окт 2025',
      lastUpdate: '1 день назад',
    },
    {
      id: 3,
      title: 'Наследственное дело',
      client: { name: 'Смирнова А.В.', avatar: 'СА' },
      category: 'Наследственное право',
      status: CaseStatusEnum.IN_PROGRESS,
      priority: CasePriorityEnum.MEDIUM,
      deadline: '30 окт 2025',
      progress: 45,
      documents: 15,
      createdAt: '10 окт 2025',
      lastUpdate: '3 часа назад',
    },
    {
      id: 4,
      title: 'Взыскание задолженности по зарплате',
      client: { name: 'Иванов П.А.', avatar: 'ИП' },
      category: 'Трудовое право',
      status: CaseStatusEnum.COMPLETED,
      priority: CasePriorityEnum.LOW,
      deadline: '5 окт 2025',
      progress: 100,
      documents: 10,
      createdAt: '1 сен 2025',
      lastUpdate: '5 дней назад',
    },
    {
      id: 5,
      title: 'Восстановление на работе',
      client: { name: 'Петрова М.И.', avatar: 'ПМ' },
      category: 'Трудовое право',
      status: CaseStatusEnum.ON_HOLD,
      priority: CasePriorityEnum.MEDIUM,
      deadline: '15 ноя 2025',
      progress: 30,
      documents: 6,
      createdAt: '12 окт 2025',
      lastUpdate: '2 дня назад',
    },
    {
      id: 6,
      title: 'Расторжение договора подряда',
      client: { name: 'ООО "Строй+"', avatar: 'СП' },
      category: 'Договорное право',
      status: CaseStatusEnum.IN_PROGRESS,
      priority: CasePriorityEnum.HIGH,
      deadline: '18 окт 2025',
      progress: 80,
      documents: 9,
      createdAt: '7 окт 2025',
      lastUpdate: '4 часа назад',
    },
    {
      id: 7,
      title: 'Раздел имущества',
      client: { name: 'Козлов Д.М.', avatar: 'КД' },
      category: 'Семейное право',
      status: CaseStatusEnum.REVIEW,
      priority: CasePriorityEnum.HIGH,
      deadline: '22 окт 2025',
      progress: 70,
      documents: 14,
      createdAt: '9 окт 2025',
      lastUpdate: '1 час назад',
    },
    {
      id: 8,
      title: 'Защита прав потребителей',
      client: { name: 'Соколова Е.П.', avatar: 'СЕ' },
      category: 'Защита прав потребителей',
      status: CaseStatusEnum.IN_PROGRESS,
      priority: CasePriorityEnum.LOW,
      deadline: '5 ноя 2025',
      progress: 25,
      documents: 4,
      createdAt: '14 окт 2025',
      lastUpdate: '1 день назад',
    },
  ];


  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = searchQuery === '' ||
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || caseItem.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || caseItem.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || caseItem.category === filterCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusBadge = (status: CaseStatusEnum) => {
    const styles = {
      [CaseStatusEnum.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
      [CaseStatusEnum.REVIEW]: 'bg-purple-100 text-purple-700',
      [CaseStatusEnum.COMPLETED]: 'bg-green-100 text-green-700',
      [CaseStatusEnum.ON_HOLD]: 'bg-gray-100 text-gray-700',
    };
    const labels = {
      [CaseStatusEnum.IN_PROGRESS]: 'В работе',
      [CaseStatusEnum.REVIEW]: 'На проверке',
      [CaseStatusEnum.COMPLETED]: 'Завершено',
      [CaseStatusEnum.ON_HOLD]: 'Приостановлено',
    };
    return <Badge className={`${styles[status]} border-0`}>{labels[status]}</Badge>;
  };

  const getPriorityBadge = (priority: CasePriorityEnum) => {
    const styles = {
      [CasePriorityEnum.HIGH]: 'bg-red-100 text-red-700',
      [CasePriorityEnum.MEDIUM]: 'bg-amber-100 text-amber-700',
      [CasePriorityEnum.LOW]: 'bg-gray-100 text-gray-700',
    };
    const labels = {
      [CasePriorityEnum.HIGH]: 'Высокий',
      [CasePriorityEnum.MEDIUM]: 'Средний',
      [CasePriorityEnum.LOW]: 'Низкий',
    };
    return <Badge className={`${styles[priority]} border-0 text-xs`}>{labels[priority]}</Badge>;
  };

  const stats = [
    { label: 'Всего дел', value: cases.length, color: 'text-blue-500', icon: Briefcase, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'В работе', value: cases.filter(c => c.status === CaseStatusEnum.IN_PROGRESS).length, color: 'text-purple-500', icon: Clock, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { label: 'Завершено', value: cases.filter(c => c.status === CaseStatusEnum.COMPLETED).length, color: 'text-green-500', icon: CheckCircle2, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { label: 'Срочные', value: cases.filter(c => c.priority === CasePriorityEnum.HIGH).length, color: 'text-red-500', icon: AlertCircle, iconBg: 'bg-red-50', iconColor: 'text-red-600' },
  ];

  return (
    <div>
      {}
      <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl tracking-tight mb-1">Дела</h1>
              <p className="text-gray-500">Управление делами и документами</p>
            </div>

            <Button
              onClick={() => setIsAddCaseDialogOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
              Новое дело
            </Button>
          </div>

          {}
          <div className="flex items-center gap-3">
            <CaseFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
            />

            <div className="flex items-center gap-1 ml-auto">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="icon"
                className="rounded-xl cursor-pointer"
                onClick={() => setViewMode('table')}
              >
                <List className="w-4 h-4" strokeWidth={2} />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="rounded-xl cursor-pointer"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6">
        {}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white border-0 shadow-sm">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-3xl tracking-tight mb-1 ${stat.color}`}>{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {}
        {viewMode === 'table' ? (
          <Card className="bg-white border-0 shadow-sm px-3 py-2">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className="text-gray-600">Дело</TableHead>
                  <TableHead className="text-gray-600">Клиент</TableHead>
                  <TableHead className="text-gray-600">Категория</TableHead>
                  <TableHead className="text-gray-600">Статус</TableHead>
                  <TableHead className="text-gray-600">Приоритет</TableHead>
                  <TableHead className="text-gray-600">Прогресс</TableHead>
                  <TableHead className="text-gray-600">Дедлайн</TableHead>
                  <TableHead className="text-gray-600">Документы</TableHead>
                  <TableHead className="text-right text-gray-600">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((caseItem) => (
                  <TableRow
                    key={caseItem.id}
                    onClick={() => navigate(ROUTES.CASES.DETAIL(caseItem.id.toString()))}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <TableCell>
                      <div className="max-w-[300px]">
                        <div className="tracking-tight mb-1 truncate">{caseItem.title}</div>
                        <div className="text-xs text-gray-500">
                          Создано: {caseItem.createdAt}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 ring-2 ring-gray-100">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                            {caseItem.client.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{caseItem.client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-0">
                        {caseItem.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                    <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                    <TableCell>
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{caseItem.progress}%</span>
                        </div>
                        <Progress value={caseItem.progress} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                        {caseItem.deadline}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FileText className="w-3.5 h-3.5" strokeWidth={2} />
                        {caseItem.documents}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl cursor-pointer focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuLabel>Действия</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(ROUTES.CASES.DETAIL(caseItem.id.toString()));
                            }}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" strokeWidth={2} />
                            Открыть
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Edit case:', caseItem.id);
                            }}
                            className="cursor-pointer"
                          >
                            <Edit className="w-4 h-4 mr-2" strokeWidth={2} />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Delete case:', caseItem.id);
                            }}
                            className="cursor-pointer text-red-600"
                          >
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
        ) : (

          <div className="grid grid-cols-3 gap-4">
            {filteredCases.map((caseItem) => (
              <Card
                key={caseItem.id}
                onClick={() => navigate(ROUTES.CASES.DETAIL(caseItem.id.toString()))}
                className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="tracking-tight mb-2 line-clamp-2">{caseItem.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="w-6 h-6 ring-2 ring-gray-100">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                            {caseItem.client.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">{caseItem.client.name}</span>
                      </div>
                    </div>
                    {getPriorityBadge(caseItem.priority)}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Статус</span>
                      {getStatusBadge(caseItem.status)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Прогресс</span>
                      <span className="text-gray-900">{caseItem.progress}%</span>
                    </div>
                    <Progress value={caseItem.progress} className="h-2" />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" strokeWidth={2} />
                      {caseItem.deadline}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4" strokeWidth={2} />
                      {caseItem.documents}
                    </div>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(ROUTES.CASES.DETAIL(caseItem.id.toString()));
                    }}
                    variant="outline"
                    className="w-full rounded-xl border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    Открыть дело
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Dialogs */}
      <AddCaseDialog
        open={isAddCaseDialogOpen}
        onOpenChange={setIsAddCaseDialogOpen}
      />
    </div>
  );
}
