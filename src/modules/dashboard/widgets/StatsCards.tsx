import { Briefcase, Users, FileText, Clock } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { StatCard } from '@/shared/ui/stat-card';

export function StatsCards() {
  const { t } = useI18n();

  const stats = [
    {
      title: t('DASHBOARD.STATS.ACTIVE_CASES'),
      value: 47,
      icon: Briefcase,
      iconColor: 'text-blue-500',
      trend: { value: '+8%', isPositive: true },
    },
    {
      title: t('DASHBOARD.STATS.CLIENTS'),
      value: 24,
      icon: Users,
      iconColor: 'text-purple-500',
      trend: { value: '+12%', isPositive: true },
    },
    {
      title: t('DASHBOARD.STATS.DOCUMENTS'),
      value: 156,
      icon: FileText,
      iconColor: 'text-orange-500',
      trend: { value: '+23%', isPositive: true },
    },
    {
      title: t('DASHBOARD.STATS.TASKS_TODAY'),
      value: 5,
      icon: Clock,
      iconColor: 'text-red-500',
      variant: 'urgent' as const,
      trend: { value: t('COMMON.STATUS.URGENT'), isPositive: false },
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
