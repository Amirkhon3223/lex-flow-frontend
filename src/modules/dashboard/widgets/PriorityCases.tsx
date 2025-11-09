import { useState } from 'react';
import { ChevronRight, User, Clock, MoreHorizontal, Eye, Edit, Trash2, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { FilterTabs } from '@/modules/cases/ui/FilterTabs';
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

const allCases = [
  {
    id: 1,
    title: 'Трудовой спор - увольнение',
    client: 'Иванов П.А.',
    deadline: 'Завтра',
    progress: 75,
    status: 'urgent' as const,
  },
  {
    id: 2,
    title: 'Договор аренды помещения',
    client: 'ООО "ТехноСтрой"',
    deadline: 'Через 5 дней',
    progress: 45,
    status: 'medium' as const,
  },
  {
    id: 3,
    title: 'Наследственное дело',
    client: 'Смирнова А.В.',
    deadline: 'Через 2 недели',
    progress: 30,
    status: 'medium' as const,
  },
  {
    id: 4,
    title: 'Взыскание задолженности',
    client: 'Петров М.И.',
    deadline: 'Завершено',
    progress: 100,
    status: 'completed' as const,
  },
];

export function PriorityCases() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<'all' | 'urgent' | 'medium' | 'completed'>('all');

  const filteredCases = filterStatus === 'all'
    ? allCases
    : allCases.filter(c => c.status === filterStatus);

  return (
    <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl tracking-tight">Приоритетные дела</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.CASES.BASE)}
            className="text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer"
          >
            Все дела
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
              className="group p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="tracking-tight">{item.title}</h4>
                    {item.status === 'urgent' && (
                      <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                        Срочно
                      </Badge>
                    )}
                    {item.status === 'completed' && (
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                        Завершено
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4" strokeWidth={2} />
                      {item.client}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" strokeWidth={2} />
                      {item.deadline}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity cursor-pointer hover:bg-white focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                      Открыть дело
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit case:', item.id);
                      }}
                      className="cursor-pointer"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Archive case:', item.id);
                      }}
                      className="cursor-pointer"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      В архив
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Delete case:', item.id);
                      }}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Прогресс</span>
                  <span className="text-gray-900">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
