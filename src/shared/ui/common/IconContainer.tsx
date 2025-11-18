import React from 'react';
import { cn } from '@/shared/ui/utils';
import type { LucideIcon } from 'lucide-react';

interface IconContainerProps {
  icon: LucideIcon;
  bgColor?: string;
  iconColor?: string;
  className?: string;
}

export const IconContainer: React.FC<IconContainerProps> = ({
  icon: Icon,
  bgColor = 'bg-blue-50',
  iconColor = 'text-blue-500',
  className,
}) => {
  return (
    <div
      className={cn(
        'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center',
        bgColor,
        className
      )}
    >
      <Icon
        className={cn('w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5', iconColor)}
        strokeWidth={2}
      />
    </div>
  );
};
