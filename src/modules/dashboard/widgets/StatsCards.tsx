import { Briefcase, Users, FileText, Clock } from 'lucide-react';
import { StatCard } from '../ui/StatCard';

export function StatsCards() {
  const stats = [
    {
      title: 'Активные дела',
      value: 47,
      icon: Briefcase,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
      trend: { value: '+8%', isPositive: true },
    },
    {
      title: 'Клиенты',
      value: 24,
      icon: Users,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-50',
      trend: { value: '+12%', isPositive: true },
    },
    {
      title: 'Документы',
      value: 156,
      icon: FileText,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-50',
      trend: { value: '+23%', isPositive: true },
    },
    {
      title: 'Задачи на сегодня',
      value: 5,
      icon: Clock,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-50',
      variant: 'urgent' as const,
      trend: { value: 'Срочно', isPositive: false },
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-5">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
