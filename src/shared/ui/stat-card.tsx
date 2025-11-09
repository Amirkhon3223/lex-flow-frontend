import type { LucideIcon } from 'lucide-react';
import { Card } from '@/shared/ui/card';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  valueColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconBg = 'bg-blue-50',
  iconColor = 'text-blue-600',
  valueColor = 'text-blue-500',
  trend,
}: StatCardProps) {
  return (
    <Card className="bg-white border-0 shadow-sm">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-3xl tracking-tight mb-1 ${valueColor}`}>
              {value}
            </div>
            <div className="text-sm text-gray-500">{label}</div>
            {trend && (
              <div
                className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2} />
          </div>
        </div>
      </div>
    </Card>
  );
}
