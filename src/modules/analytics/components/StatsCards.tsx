import { Briefcase, Users, DollarSign, Target } from 'lucide-react';
import { StatCard } from '@/shared/ui/stat-card';

const stats = [
  {
    icon: Briefcase,
    iconColor: 'text-blue-500',
    trend: '+12%',
    value: '47',
    label: 'Активные дела',
  },
  {
    icon: Users,
    iconColor: 'text-purple-500',
    trend: '+8%',
    value: '24',
    label: 'Новых клиентов',
  },
  {
    icon: Target,
    iconColor: 'text-green-500',
    trend: '+5%',
    value: '87%',
    label: 'Успешных дел',
  },
  {
    icon: DollarSign,
    iconColor: 'text-amber-500',
    trend: '+23%',
    value: '3.8M ₽',
    label: 'Доход за период',
  },
];

export function StatsCards() {
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
