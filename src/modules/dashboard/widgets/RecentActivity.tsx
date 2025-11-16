import type { RecentActivityInterface } from '@/app/types/dashboard/dashboard.interfaces';
import { ActivityItem } from '@/modules/dashboard/ui/ActivityItem';
import { Card } from '@/shared/ui/card';

const recentActivity: RecentActivityInterface[] = [
  { action: 'добавил документ', item: '"Исковое заявление"', client: 'Иванов П.А.', time: '2 часа назад' },
  { action: 'обновил статус дела', item: '"Трудовой спор"', client: 'Петрова М.И.', time: '4 часа назад' },
  { action: 'создал новое дело', item: '"Договор подряда"', client: 'ООО "Строй+"', time: 'Вчера' },
];

export function RecentActivity() {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl tracking-tight mb-4 sm:mb-6">Последняя активность</h3>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <ActivityItem
              key={index}
              action={activity.action}
              item={activity.item}
              client={activity.client}
              time={activity.time}
              isLast={index === recentActivity.length - 1}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
