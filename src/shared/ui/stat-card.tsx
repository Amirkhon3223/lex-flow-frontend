import type { LucideIcon } from 'lucide-react';
import { getIconBgColor } from '@/shared/lib/color-utils';
import { Card } from '@/shared/ui/card';
import { cn } from '@/shared/ui/utils';

export interface StatCardProps {
  label?: string;
  title?: string; 
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  color?: string; 
  trend?: string | { value: string; isPositive?: boolean; label?: string };
  trendUp?: boolean;
  valueColor?: string;
  className?: string;
  variant?: 'default' | 'urgent';
}

export function StatCard({
  label,
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  color,
  trend,
  trendUp,
  valueColor,
  className,
  variant,
}: StatCardProps) {
  const displayLabel = label || title;
  const finalIconColor = iconColor || color || 'text-primary';
  const finalIconBg = iconBg || getIconBgColor(finalIconColor);

  let trendValue = '';
  let isTrendPositive = trendUp;
  let trendLabel = 'с прошлого месяца';

  if (typeof trend === 'object' && trend !== null) {
    trendValue = trend.value;
    isTrendPositive = trend.isPositive;
    if (trend.label) trendLabel = trend.label;
  } else if (typeof trend === 'string') {
    trendValue = trend;
  }

  return (
    <Card className={cn(
      "border border-border transition-all hover:shadow-md dark:hover:shadow-white/5",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <div className={cn("text-2xl sm:text-3xl tracking-tight mb-1 font-semibold", valueColor)}>
            {value}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground font-medium">
            {displayLabel}
          </div>
        </div>
        <div className={cn(
          "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors",
          finalIconBg
        )}>
          <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", finalIconColor)} strokeWidth={2} />
        </div>
      </div>
      {(trendValue || variant === 'urgent') && (
        <div className={cn(
          "mt-3 text-xs font-medium flex items-center gap-1",
          variant === 'urgent' ? "text-red-600 dark:text-red-400" :
            isTrendPositive === true ? "text-green-600 dark:text-green-400" :
              isTrendPositive === false ? "text-red-600 dark:text-red-400" :
                "text-muted-foreground"
        )}>
          {variant === 'urgent' ? 'Срочно' : trendValue}
          {variant !== 'urgent' && <span className="text-muted-foreground font-normal">{trendLabel}</span>}
        </div>
      )}
    </Card>
  );
}
