import type { TodayCardProps } from '@/app/types/calendar/calendar.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';

export function TodayCard({ meetingsCount }: TodayCardProps) {
  const { t } = useI18n();

  return (
    <Card className="bg-primary dark:bg-gradient-to-br dark:from-blue-500 dark:to-blue-600 shadow-lg text-white mb-4 sm:mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl tracking-tight mb-1">{t('CALENDAR.TODAY')}</h3>
          <p className="text-xs sm:text-sm opacity-90">
            {new Date().toLocaleDateString('ru-RU', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl sm:text-3xl tracking-tight">{meetingsCount}</div>
          <div className="text-xs sm:text-sm opacity-90">
            {meetingsCount === 1
              ? t('CALENDAR.MEETING_STATUS.MEETING')
              : t('CALENDAR.MEETING_STATUS.MEETINGS')}
          </div>
        </div>
      </div>
    </Card>
  );
}
