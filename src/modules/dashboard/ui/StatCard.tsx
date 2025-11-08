import type { LucideIcon } from 'lucide-react';
import { StatCardVariantEnum } from '@/app/types/dashboard/dashboard.enums';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: StatCardVariantEnum;
}

export function StatCard({ title, value, icon: Icon, iconColor, iconBg, trend, variant = StatCardVariantEnum.DEFAULT }: StatCardProps) {
  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2} />
          </div>
          {trend && (
            <Badge className={
              variant === StatCardVariantEnum.URGENT
                ? 'bg-red-50 text-red-700 border-0 text-xs'
                : 'bg-green-50 text-green-700 border-0 text-xs'
            }>
              {variant === StatCardVariantEnum.URGENT ? 'Срочно' : trend.value}
            </Badge>
          )}
        </div>
        <div className="text-3xl tracking-tight mb-1">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </Card>
  );
}
