import { Briefcase, Users, DollarSign, Target } from 'lucide-react';
import { StatCard } from '@/shared/ui/stat-card';
import { useI18n } from '@/shared/context/I18nContext';

export function StatsCards() {
  const { t } = useI18n();

  const stats = [
    {
      icon: Briefcase,
      iconColor: 'text-blue-500',
      trend: '+12%',
      value: '47',
      label: t('ANALYTICS.STATS.ACTIVE_CASES'),
    },
    {
      icon: Users,
      iconColor: 'text-purple-500',
      trend: '+8%',
      value: '24',
      label: t('ANALYTICS.STATS.NEW_CLIENTS'),
    },
    {
      icon: Target,
      iconColor: 'text-green-500',
      trend: '+5%',
      value: '87%',
      label: t('ANALYTICS.STATS.SUCCESSFUL_CASES'),
    },
    {
      icon: DollarSign,
      iconColor: 'text-amber-500',
      trend: '+23%',
      value: '3.8M ₽',
      label: t('ANALYTICS.STATS.REVENUE_FOR_PERIOD'),
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
          trend={stat.trend}
          trendUp={true}
        />
      ))}
    </div>
  );
}
