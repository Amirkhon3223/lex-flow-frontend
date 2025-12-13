import { Briefcase, Users, FileText, Calendar } from 'lucide-react';
import { useAnalyticsStore } from '@/app/store/analytics.store';
import { useI18n } from '@/shared/context/I18nContext';
import { StatCard } from '@/shared/ui/stat-card';
import { Skeleton } from '@/shared/ui/skeleton';

export function StatsCards() {
  const { t } = useI18n();
  const { dashboard, dashboardLoading } = useAnalyticsStore();

  if (dashboardLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-card rounded-xl border border-border">
            <Skeleton className="h-10 w-10 rounded-lg mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      icon: Users,
      iconColor: 'text-purple-500',
      value: String(dashboard?.totalClients || 0),
      label: t('ANALYTICS.STATS.TOTAL_CLIENTS'),
    },
    {
      icon: Briefcase,
      iconColor: 'text-blue-500',
      value: String(dashboard?.totalCases || 0),
      label: t('ANALYTICS.STATS.TOTAL_CASES'),
    },
    {
      icon: FileText,
      iconColor: 'text-green-500',
      value: String(dashboard?.totalDocuments || 0),
      label: t('ANALYTICS.STATS.TOTAL_DOCUMENTS'),
    },
    {
      icon: Calendar,
      iconColor: 'text-amber-500',
      value: String(dashboard?.upcomingMeetings || 0),
      label: t('ANALYTICS.STATS.UPCOMING_MEETINGS'),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}
