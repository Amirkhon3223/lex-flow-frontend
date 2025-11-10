import { Card } from '@/shared/ui/card';
import { Switch } from '@/shared/ui/switch';

export function NotificationsTabContent() {
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
        <div className="p-6">
          <h3 className="text-xl tracking-tight mb-6">Уведомления по email</h3>

          <div className="space-y-4">
            {[
              { label: 'Новые дела', description: 'Уведомления о создании новых дел', checked: true },
              { label: 'Дедлайны', description: 'Напоминания о приближающихся сроках', checked: true },
              { label: 'Документы', description: 'Уведомления о новых документах', checked: true },
              { label: 'Комментарии', description: 'Новые комментарии к делам', checked: false },
              { label: 'Еженедельный отчет', description: 'Статистика за неделю', checked: true },
              { label: 'Уведомления на почту', description: 'Получать все уведомления на email', checked: true },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <h4 className="tracking-tight mb-1">{item.label}</h4>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <Switch defaultChecked={item.checked} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Push Notifications */}
      <Card className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
        <div className="p-6">
          <h3 className="text-xl tracking-tight mb-6">Push-уведомления</h3>

          <div className="space-y-4">
            {[
              { label: 'Срочные дела', description: 'Важные срочные уведомления', checked: true },
              { label: 'Встречи', description: 'Напоминания о встречах за 30 минут', checked: true },
              { label: 'Сообщения', description: 'Новые сообщения от клиентов', checked: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <h4 className="tracking-tight mb-1">{item.label}</h4>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <Switch defaultChecked={item.checked} />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
