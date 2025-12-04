import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

interface CaseProgressCardProps {
  progress?: number;
  documentsCount?: number;
  eventsCount?: number;
  daysUntilTrial?: number;
  tasksCount?: number;
}

export function CaseProgressCard({
  progress = 0,
  documentsCount = 0,
  eventsCount = 0,
  daysUntilTrial = 0,
  tasksCount = 0,
}: CaseProgressCardProps) {
  const { t } = useI18n();

  const progressStats = [
    { count: documentsCount, labelKey: 'CASES.FIELDS.DOCUMENTS', color: 'bg-blue-100 text-blue-700' },
    { count: eventsCount, labelKey: 'CASES.EVENTS_COUNT', color: 'bg-purple-100 text-purple-700' },
    { count: daysUntilTrial, labelKey: 'CASES.DAYS_UNTIL_TRIAL', color: 'bg-orange-100 text-orange-700' },
    { count: tasksCount, labelKey: 'CASES.DETAIL.TASKS', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg tracking-tight">{t('CASES.DETAIL.CASE_PROGRESS')}</h3>
        <span className="text-xl sm:text-2xl tracking-tight">{progress}%</span>
      </div>
      <Progress value={progress} className="h-1.5 sm:h-2 mb-3 sm:mb-4 bg-gray-200 [&>div]:bg-blue-500" />
      <div className="grid grid-cols-4 gap-3 sm:gap-4 text-center">
        {progressStats.map((stat) => (
          <div key={stat.labelKey} className="flex flex-col items-center">
            <Badge className={`${stat.color} border-0 text-base sm:text-lg px-2.5 sm:px-3 py-1 mb-1.5 sm:mb-2`}>
              {stat.count}
            </Badge>
            <div className="text-xs sm:text-sm text-gray-500">{t(stat.labelKey)}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
