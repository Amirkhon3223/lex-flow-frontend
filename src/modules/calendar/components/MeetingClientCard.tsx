import { useNavigate } from 'react-router-dom';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useI18n } from '@/shared/context/I18nContext';

interface MeetingClientCardProps {
  client: MeetingInterface['client'];
}

export function MeetingClientCard({ client }: MeetingClientCardProps) {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base md:text-lg">{t('CALENDAR.MEETING_DETAILS.CLIENT')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
          onClick={() => navigate(`/clients/${client.name}`)}
        >
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-border">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
              {client.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm sm:text-base">{client.name}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{t('CALENDAR.MEETING_DETAILS.VIEW_PROFILE')}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
