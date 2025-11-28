import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useI18n } from '@/shared/context/I18nContext';

interface MeetingCaseCardProps {
  caseName: string;
}

export function MeetingCaseCard({ caseName }: MeetingCaseCardProps) {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base md:text-lg">{t('CALENDAR.MEETING_DETAILS.RELATED_CASE')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
          onClick={() => navigate('/cases/1')}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-xs sm:text-sm mb-1">{caseName}</div>
              <div className="text-xs text-muted-foreground">{t('CALENDAR.MEETING_DETAILS.VIEW_CASE')}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
