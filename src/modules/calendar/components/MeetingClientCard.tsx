import { useNavigate } from 'react-router-dom';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MeetingClientCardProps {
  client: MeetingInterface['client'];
}

export function MeetingClientCard({ client }: MeetingClientCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base md:text-lg">Клиент</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => navigate(`/clients/${client.name}`)}
        >
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-gray-200">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
              {client.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm sm:text-base">{client.name}</div>
            <div className="text-xs sm:text-sm text-gray-500">Посмотреть профиль →</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
