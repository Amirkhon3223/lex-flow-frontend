import { Card } from '@/shared/ui/card';
import { Switch } from '@/shared/ui/switch';

export function NotificationsTabContent() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
            Уведомления по email
          </h3>

          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {[
              { label: 'Новые дела', description: 'Уведомления о создании новых дел', checked: true },
              { label: 'Дедлайны', description: 'Напоминания о приближающихся сроках', checked: true },
              { label: 'Документы', description: 'Уведомления о новых документах', checked: true },
              { label: 'Комментарии', description: 'Новые комментарии к делам', checked: false },
              { label: 'Еженедельный отчет', description: 'Статистика за неделю', checked: true },
              { label: 'Уведомления на почту', description: 'Получать все уведомления на email', checked: true },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-muted/50"
              >
                <div className="min-w-0">
                  <h4 className="tracking-tight mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">{item.label}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
                <Switch defaultChecked={item.checked} className="flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">Push-уведомления</h3>

          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {[
              { label: 'Срочные дела', description: 'Важные срочные уведомления', checked: true },
              { label: 'Встречи', description: 'Напоминания о встречах за 30 минут', checked: true },
              { label: 'Сообщения', description: 'Новые сообщения от клиентов', checked: false },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-muted/50"
              >
                <div className="min-w-0">
                  <h4 className="tracking-tight mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">{item.label}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
                <Switch defaultChecked={item.checked} className="flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
