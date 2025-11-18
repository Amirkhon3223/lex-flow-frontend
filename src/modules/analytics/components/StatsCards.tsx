import { Briefcase, Users, DollarSign, Target } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { IconContainer } from '@/shared/ui/common/IconContainer';
import { TrendingBadge } from '@/shared/ui/common/TrendingBadge';

const stats = [
  {
    icon: Briefcase,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    trend: '+12%',
    value: '47',
    label: 'Активные дела',
  },
  {
    icon: Users,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    trend: '+8%',
    value: '24',
    label: 'Новых клиентов',
  },
  {
    icon: Target,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
    trend: '+5%',
    value: '87%',
    label: 'Успешных дел',
  },
  {
    icon: DollarSign,
    bgColor: 'bg-amber-50',
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
        <Card key={stat.label}>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <IconContainer
              icon={stat.icon}
              bgColor={stat.bgColor}
              iconColor={stat.iconColor}
            />
            <TrendingBadge value={stat.trend} variant="success" />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-0.5 sm:mb-1">
            {stat.value}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
}
