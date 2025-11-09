import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

const upcomingEvents = [
  { time: '10:00', title: 'Консультация с клиентом' },
  { time: '14:30', title: 'Заседание в суде' },
  { time: '16:00', title: 'Подготовка документов' },
];

export function TodayWidget() {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/30 text-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl tracking-tight">Сегодня</h3>
          <Calendar className="w-5 h-5 opacity-80" strokeWidth={2} />
        </div>

        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="flex gap-3">
              <div className="text-sm opacity-80 w-14">{event.time}</div>
              <div className="flex-1">
                <div className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <p className="text-sm">{event.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => navigate(ROUTES.CALENDAR)}
          className="w-full mt-6 bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl backdrop-blur-sm cursor-pointer"
        >
          Открыть календарь
        </Button>
      </div>
    </Card>
  );
}
