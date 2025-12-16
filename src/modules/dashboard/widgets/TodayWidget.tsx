import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { useDashboardStore } from '@/app/store/dashboard.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

export function TodayWidget() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const { t } = useI18n();
  const { todayMeetings, meetingsLoading } = useDashboardStore();

  useEffect(() => {
    const html = document.documentElement;
    const updateTheme = () => {
      setIsDark(html.classList.contains('dark'));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const cardClasses = isDark
    ? 'bg-card shadow-none border border-calendar-border'
    : 'bg-today-bg shadow-md border-0';

  const itemClasses = isDark
    ? 'bg-calendar-item border border-calendar-border'
    : 'bg-today-item-bg border-0';

  return (
    <Card className={cardClasses}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl tracking-tight text-foreground">
          {t('COMMON.TIME.TODAY')}
        </h3>

        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" strokeWidth={2} />
      </div>

      <div className="space-y-3 sm:space-y-4">
        {meetingsLoading && (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-secondary/50 animate-pulse rounded-xl"
                aria-label="Loading meetings"
              />
            ))}
          </>
        )}
        {!meetingsLoading && todayMeetings.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">{t('DASHBOARD.TODAY.NO_MEETINGS')}</p>
          </div>
        )}
        {!meetingsLoading &&
          todayMeetings.map((event, index) => (
            <div key={event.id || index} className="flex gap-2 sm:gap-1 items-center">
              <div className="text-xs sm:text-sm text-foreground w-12 sm:w-14 flex-shrink-0">
                {event.time}
              </div>

              <div className="flex-1 min-w-0">
                <div className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl ${itemClasses}`}>
                  <p className="text-xs sm:text-sm truncate text-foreground">{event.title}</p>
                  {event.client && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {event.client.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <Button
        onClick={() => navigate(ROUTES.CALENDAR)}
        className="
          w-full mt-4 sm:mt-6
          hover:bg-today-item-bg/80
          text-foreground
          bg-calendar dark:hover:bg-calendar/90
          dark:text-calendar-foreground
          border-0 rounded-xl cursor-pointer text-sm sm:text-base shadow-md
        "
      >
        {t('DASHBOARD.TODAY.OPEN_CALENDAR')}
      </Button>
    </Card>
  );
}
