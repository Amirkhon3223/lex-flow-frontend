import type { StatCardProps } from '@/app/types/shared/shared.interfaces';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

export function StatCard({
  label,
  title,
  value,
  icon: Icon,
  iconBg = 'bg-blue-50',
  iconColor = 'text-blue-600',
  valueColor,
  variant = 'default',
  trend,
}: StatCardProps) {
  const displayLabel = label || title;

  return (
    <Card className="hover:shadow-md transition-shadow">
      {/* Mobile: layout like ContactInfoCard (icon left, label+value right) */}
      <div className="flex items-start gap-2.5 md:hidden">
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-gray-500">{displayLabel}</div>
            <div className={`text-base font-medium ${valueColor || ''}`}>
              {value}
            </div>
          </div>
          {trend && (
            <Badge
              className={`ml-auto flex-shrink-0 ${
                variant === 'urgent'
                  ? 'bg-red-50 text-red-700 border-0 text-xs'
                  : 'bg-green-50 text-green-700 border-0 text-xs'
              }`}
            >
              {variant === 'urgent' ? 'Срочно' : trend.value}
            </Badge>
          )}
        </div>

      {/* Desktop: horizontal layout (original) */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2} />
          </div>
          {trend && (
            <Badge
              className={
                variant === 'urgent'
                  ? 'bg-red-50 text-red-700 border-0 text-xs'
                  : 'bg-green-50 text-green-700 border-0 text-xs'
              }
            >
              {variant === 'urgent' ? 'Срочно' : trend.value}
            </Badge>
          )}
        </div>
        <div className={`text-3xl tracking-tight mb-1 ${valueColor || ''}`}>
          {value}
        </div>
        <div className="text-sm text-gray-500">{displayLabel}</div>
      </div>
    </Card>
  );
}
