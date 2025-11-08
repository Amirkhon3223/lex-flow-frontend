import { ChevronRight, User, Clock, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

const cases = [
  {
    id: 1,
    title: 'Трудовой спор - увольнение',
    client: 'Иванов П.А.',
    deadline: 'Завтра',
    progress: 75,
    urgent: true,
  },
  {
    id: 2,
    title: 'Договор аренды помещения',
    client: 'ООО "ТехноСтрой"',
    deadline: 'Через 5 дней',
    progress: 45,
    urgent: false,
  },
  {
    id: 3,
    title: 'Наследственное дело',
    client: 'Смирнова А.В.',
    deadline: 'Через 2 недели',
    progress: 30,
    urgent: false,
  },
];

export function PriorityCases() {
  return (
    <Card className="bg-white border-0 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl tracking-tight">Приоритетные дела</h3>
          <Button variant="ghost" size="sm" className="text-blue-500 hover:bg-blue-50 rounded-lg">
            Все дела
            <ChevronRight className="w-4 h-4 ml-1" strokeWidth={2} />
          </Button>
        </div>

        <div className="space-y-4">
          {cases.map((item) => (
            <div
              key={item.id}
              className="group p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="tracking-tight">{item.title}</h4>
                    {item.urgent && (
                      <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                        Срочно
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
                <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
                </Button>
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
