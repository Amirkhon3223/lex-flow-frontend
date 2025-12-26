import { useDashboardStore } from '@/app/store/dashboard.store';
import { ActivityItem } from '@/modules/dashboard/ui/ActivityItem';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';
import { formatRelativeTime } from '@/shared/utils';

const getActivityAction = (type: string, t: (key: string) => string): string => {
  const actionMap: Record<string, string> = {
    case_created: t('DASHBOARD.RECENT_ACTIVITY.CASE_CREATED') || 'создал новое дело',
    document_uploaded: t('DASHBOARD.RECENT_ACTIVITY.DOCUMENT_UPLOADED') || 'добавил документ',
    meeting_scheduled: t('DASHBOARD.RECENT_ACTIVITY.MEETING_SCHEDULED') || 'запланировал встречу',
    case_updated: t('DASHBOARD.RECENT_ACTIVITY.CASE_UPDATED') || 'обновил статус дела',
  };
  return actionMap[type] || type;
};

export function RecentActivity() {
  const { t } = useI18n();
  const { dashboardStats, dashboardLoading } = useDashboardStore();

  return (
    <Card>
      <h3 className="text-lg sm:text-xl tracking-tight mb-4 sm:mb-6">
        {t('DASHBOARD.RECENT_ACTIVITY.TITLE')}
      </h3>

      <div className="space-y-4">
        {dashboardLoading && (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-secondary/50 animate-pulse rounded-xl"
                aria-label="Loading activity"
              />
            ))}
          </>
        )}
        {!dashboardLoading && (!dashboardStats?.recentActivity || dashboardStats.recentActivity.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t('DASHBOARD.RECENT_ACTIVITY.NO_ACTIVITY')}</p>
          </div>
        )}
        {!dashboardLoading &&
          dashboardStats?.recentActivity &&
          dashboardStats.recentActivity.map((activity, index) => (
            <ActivityItem
              key={index}
              action={getActivityAction(activity.type, t)}
              item={`"${activity.title}"`}
              client={activity.userName}
              time={formatRelativeTime(activity.timestamp)}
              isLast={index === dashboardStats.recentActivity.length - 1}
            />
          ))}
      </div>
    </Card>
  );
}
