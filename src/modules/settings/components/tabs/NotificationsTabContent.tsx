import type { NotificationSettingInterface } from '@/app/types/settings/settings.interfaces';
import { NotificationToggleItem } from '@/modules/settings/components/NotificationToggleItem';
import { Card } from '@/shared/ui/card';

const EMAIL_NOTIFICATIONS: NotificationSettingInterface[] = [
  { label: 'Новые дела', description: 'Уведомления о создании новых дел', checked: true },
  { label: 'Дедлайны', description: 'Напоминания о приближающихся сроках', checked: true },
  { label: 'Документы', description: 'Уведомления о новых документах', checked: true },
  { label: 'Комментарии', description: 'Новые комментарии к делам', checked: false },
  { label: 'Еженедельный отчет', description: 'Статистика за неделю', checked: true },
];

const PUSH_NOTIFICATIONS: NotificationSettingInterface[] = [
  { label: 'Срочные дела', description: 'Важные срочные уведомления', checked: true },
  { label: 'Встречи', description: 'Напоминания о встречах за 30 минут', checked: true },
  { label: 'Сообщения', description: 'Новые сообщения от клиентов', checked: false },
];

export function NotificationsTabContent() {
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
        <div className="p-6">
          <h3 className="text-xl tracking-tight mb-6">Уведомления по email</h3>

          <div className="space-y-4">
            {EMAIL_NOTIFICATIONS.map((setting, index) => (
              <NotificationToggleItem key={index} setting={setting} />
            ))}
          </div>
        </div>
      </Card>

      {/* Push Notifications */}
      <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
        <div className="p-6">
          <h3 className="text-xl tracking-tight mb-6">Push-уведомления</h3>

          <div className="space-y-4">
            {PUSH_NOTIFICATIONS.map((setting, index) => (
              <NotificationToggleItem key={index} setting={setting} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
