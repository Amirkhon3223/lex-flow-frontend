import { Card, CardContent } from '@/shared/ui/card';

export function StatsCards() {
  const stats = [
    {
      label: 'Всего клиентов',
      value: '24',
      change: '+12% за месяц',
    },
    {
      label: 'Активных дел',
      value: '47',
      change: '+8% за месяц',
    },
    {
      label: 'Общий доход',
      value: '3.8M ₽',
      change: '+23% за месяц',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">{stat.label}</div>
            <div className="mt-2 text-3xl font-bold">{stat.value}</div>
            <div className="mt-1 text-sm text-green-600">{stat.change}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
