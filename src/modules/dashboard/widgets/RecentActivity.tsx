import type { RecentActivityInterface } from '@/app/types/dashboard/dashboard.interfaces';
import { ActivityItem } from '@/modules/dashboard/ui/ActivityItem';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';

const recentActivity: RecentActivityInterface[] = [
  { action: 'добавил документ', item: '"Исковое заявление"', client: 'Иванов П.А.', time: '2 часа назад' },
  { action: 'обновил статус дела', item: '"Трудовой спор"', client: 'Петрова М.И.', time: '4 часа назад' },
  { action: 'создал новое дело', item: '"Договор подряда"', client: 'ООО "Строй+"', time: 'Вчера' },
];

export function RecentActivity() {
  const { t } = useI18n();
  return (
    <Card>
      <h3 className="text-lg sm:text-xl tracking-tight mb-4 sm:mb-6">{t('DASHBOARD.RECENT_ACTIVITY.TITLE')}</h3>

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
    </Card>
  );
}
