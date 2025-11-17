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
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 text-white">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl tracking-tight">Сегодня</h3>
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" strokeWidth={2} />
        </div>

        <div className="space-y-3 sm:space-y-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="flex gap-2 sm:gap-1 items-center">
              <div className="text-xs sm:text-sm opacity-80 w-12 sm:w-14 flex-shrink-0">{event.time}</div>
              <div className="flex-1 min-w-0">
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <p className="text-xs sm:text-sm truncate">{event.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => navigate(ROUTES.CALENDAR)}
          className="w-full mt-4 sm:mt-6 bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl backdrop-blur-sm cursor-pointer text-sm sm:text-base"
        >
          Открыть календарь
        </Button>
    </Card>
  );
}
