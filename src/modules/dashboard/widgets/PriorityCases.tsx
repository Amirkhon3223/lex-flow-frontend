import { useState } from 'react';
import { ChevronRight, User, Clock, MoreHorizontal, Eye, Edit, Trash2, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import type { PriorityCaseInterface } from '@/app/types/dashboard/dashboard.interfaces';
import { FilterTabs } from '@/modules/cases/ui/FilterTabs';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/ui/dropdown-menu';
import { Progress } from '@/shared/ui/progress';

const allCases: PriorityCaseInterface[] = [
  {
    id: 1,
    title: 'Трудовой спор - увольнение',
    client: 'Иванов П.А.',
    deadline: 'Завтра',
    progress: 75,
    status: 'urgent',
  },
  {
    id: 2,
    title: 'Договор аренды помещения',
    client: 'ООО "ТехноСтрой"',
    deadline: 'Через 5 дней',
    progress: 45,
    status: 'medium',
  },
  {
    id: 3,
    title: 'Наследственное дело',
    client: 'Смирнова А.В.',
    deadline: 'Через 2 недели',
    progress: 30,
    status: 'medium',
  },
  {
    id: 4,
    title: 'Взыскание задолженности',
    client: 'Петров М.И.',
    deadline: 'Завершено',
    progress: 100,
    status: 'completed',
  },
];

export function PriorityCases() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [filterStatus, setFilterStatus] = useState<'all' | 'urgent' | 'medium' | 'completed'>('all');

  const filteredCases = filterStatus === 'all'
    ? allCases
    : allCases.filter(c => c.status === filterStatus);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg sm:text-xl tracking-tight">{t('DASHBOARD.PRIORITY_CASES.TITLE')}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.CASES.BASE)}
          className="text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer text-sm sm:text-base"
        >
          <span className="hidden sm:inline">{t('DASHBOARD.PRIORITY_CASES.ALL_CASES')}</span>
          <span className="sm:hidden">{t('DASHBOARD.PRIORITY_CASES.ALL_CASES')}</span>
          <ChevronRight className="w-4 h-4 ml-1" strokeWidth={2} />
        </Button>
      </div>

      <div className="mb-4">
        <FilterTabs filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
      </div>

      <div className="space-y-4">
        {filteredCases.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(ROUTES.CASES.DETAIL(item.id.toString()))}
            className="group p-4 sm:p-5 rounded-2xl bg-secondary/50 hover:bg-secondary transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h4 className="tracking-tight text-sm sm:text-base truncate">{item.title}</h4>
                  {item.status === 'urgent' && (
                    <Badge className="bg-red-100 text-red-700 border-0 text-xs flex-shrink-0">
                      {t('COMMON.STATUS.URGENT')}
                    </Badge>
                  )}
                  {item.status === 'completed' && (
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs flex-shrink-0">
                      {t('COMMON.STATUS.COMPLETED')}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
                    <span className="truncate max-w-[120px] sm:max-w-none">{item.client}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
                    {item.deadline}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity cursor-pointer hover:bg-background focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(ROUTES.CASES.DETAIL(item.id.toString()));
                    }}
                    className="cursor-pointer"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t('DASHBOARD.PRIORITY_CASES.OPEN_CASE')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Edit case:', item.id);
                    }}
                    className="cursor-pointer"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t('COMMON.ACTIONS.EDIT')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Archive case:', item.id);
                    }}
                    className="cursor-pointer"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    {t('COMMON.ACTIONS.ARCHIVE')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Delete case:', item.id);
                    }}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('COMMON.ACTIONS.DELETE')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('DASHBOARD.PRIORITY_CASES.PROGRESS')}</span>
                <span className="text-foreground">{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
