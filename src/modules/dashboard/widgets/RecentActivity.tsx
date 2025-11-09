import { Card } from '@/shared/ui/card';

const recentActivity = [
  { action: 'добавил документ', item: '"Исковое заявление"', client: 'Иванов П.А.', time: '2 часа назад' },
  { action: 'обновил статус дела', item: '"Трудовой спор"', client: 'Петрова М.И.', time: '4 часа назад' },
  { action: 'создал новое дело', item: '"Договор подряда"', client: 'ООО "Строй+"', time: 'Вчера' },
];

export function RecentActivity() {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-xl">
      <div className="p-6">
        <h3 className="text-xl tracking-tight mb-6">Последняя активность</h3>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                {index < recentActivity.length - 1 && (
                  <div className="w-px h-full bg-gray-200 mt-2"></div>
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className="text-[15px] mb-1">
                  <span className="text-gray-900">Вы</span>{' '}
                  <span className="text-gray-500">{activity.action}</span>{' '}
                  <span className="text-gray-900">{activity.item}</span>
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>{activity.client}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
