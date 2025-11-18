import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/shared/ui/utils';

interface TrendingBadgeProps {
  value: string | number;
  trend?: 'up' | 'down';
  variant?: 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantStyles = {
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
};

export const TrendingBadge: React.FC<TrendingBadgeProps> = ({
  value,
  trend = 'up',
  variant = 'success',
  className,
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <Badge
      className={cn(
        variantStyles[variant],
        'border-0 flex items-center gap-0.5 sm:gap-1 text-xs',
        className
      )}
    >
      <TrendIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2} />
      {value}
    </Badge>
  );
};
