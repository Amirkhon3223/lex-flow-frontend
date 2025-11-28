import { Clock, MapPin } from 'lucide-react';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { InfoBlock } from '@/modules/calendar/ui/InfoBlock';
import { useI18n } from '@/shared/context/I18nContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MeetingInfoCardProps {
  meeting: MeetingInterface;
}

export function MeetingInfoCard({ meeting }: MeetingInfoCardProps) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base md:text-lg">{t('CALENDAR.FIELDS.MEETING_INFO')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          <InfoBlock
            icon={<Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />}
            iconBgColor="bg-blue-500/10"
            label={t('CALENDAR.MEETING_DETAILS.DURATION')}
            value={meeting.duration}
          />

          {meeting.location && (
            <InfoBlock
              icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400" strokeWidth={2} />}
              iconBgColor="bg-purple-500/10"
              label={t('CALENDAR.MEETING_DETAILS.LOCATION')}
              value={meeting.location}
            />
          )}
        </div>

        {meeting.description && (
          <div>
            <h4 className="text-md font-bold text-foreground mb-1.5 sm:mb-2">{t('CALENDAR.MEETING_DETAILS.DESCRIPTION')}</h4>
            <p className="text-md text-muted-foreground leading-relaxed">{meeting.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
