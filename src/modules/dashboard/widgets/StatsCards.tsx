import { Briefcase, Users, FileText, Clock } from 'lucide-react';
import { useDashboardStore } from '@/app/store/dashboard.store';
import { useI18n } from '@/shared/context/I18nContext';
import { StatCard } from '@/shared/ui/stat-card';

export function StatsCards() {
  const { t } = useI18n();
  const { dashboardStats } = useDashboardStore();

  if (!dashboardStats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-secondary/50 animate-pulse rounded-2xl"
            aria-label="Loading stats"
          />
        ))}
      </div>
    );
  }

  const parseTrend = (trendValue: string) => {
    const isPositive = trendValue.startsWith('+');
    return { value: trendValue, isPositive };
  };

  // Safe fallback values for new fields
  const totalTasks = dashboardStats.totalTasks ?? 0;
  const completedTasks = dashboardStats.completedTasks ?? 0;
  const taskCompletionPercentage = dashboardStats.taskCompletionPercentage ?? 0;

  const stats = [
    {
      title: t('DASHBOARD.STATS.ACTIVE_CASES'),
      value: dashboardStats.activeCases,
      icon: Briefcase,
      iconColor: 'text-blue-500',
      trend: parseTrend(dashboardStats.trends.activeCases),
    },
    {
      title: t('DASHBOARD.STATS.CLIENTS'),
      value: dashboardStats.totalClients,
      icon: Users,
      iconColor: 'text-purple-500',
      trend: parseTrend(dashboardStats.trends.clients),
    },
    {
      title: t('DASHBOARD.STATS.DOCUMENTS'),
      value: dashboardStats.totalDocuments,
      icon: FileText,
      iconColor: 'text-orange-500',
      trend: parseTrend(dashboardStats.trends.documents),
    },
    {
      title: t('DASHBOARD.STATS.TASKS'),
      value: totalTasks,
      icon: Clock,
      iconColor: 'text-red-500',
      variant: 'success' as const,
      trend: {
        value: `${taskCompletionPercentage}% ${t('DASHBOARD.STATS.COMPLETED')} ${t('DASHBOARD.STATS.FROM')} ${totalTasks}`,
        isPositive: taskCompletionPercentage >= 50
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
