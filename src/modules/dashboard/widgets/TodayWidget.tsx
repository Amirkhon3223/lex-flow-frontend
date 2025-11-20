import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import type { UpcomingEventInterface } from '@/app/types/dashboard/dashboard.interfaces';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

const upcomingEvents: UpcomingEventInterface[] = [
  { time: '10:00', title: 'Консультация с клиентом' },
  { time: '14:30', title: 'Заседание в суде' },
  { time: '16:00', title: 'Подготовка документов' },
];


export function TodayWidget() {
  const navigate = useNavigate();

  return (
    <Card className="bg-blue-500/10 border border-blue-500/20 shadow-none">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl tracking-tight text-blue-900 dark:text-blue-100">Сегодня</h3>
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
      </div>

      <div className="space-y-3 sm:space-y-4">
        {upcomingEvents.map((event, index) => (
          <div key={index} className="flex gap-2 sm:gap-1 items-center">
            <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 w-12 sm:w-14 flex-shrink-0">{event.time}</div>
            <div className="flex-1 min-w-0">
              <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-blue-500/5 dark:bg-blue-500/20 border border-blue-500/10">
                <p className="text-xs sm:text-sm truncate text-blue-900 dark:text-blue-100">{event.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={() => navigate(ROUTES.CALENDAR)}
        className="w-full mt-4 sm:mt-6 bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-xl cursor-pointer text-sm sm:text-base shadow-md shadow-blue-500/20"
      >
        Открыть календарь
      </Button>
    </Card>
  );
}
