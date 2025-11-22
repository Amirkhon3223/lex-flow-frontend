import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

interface InfoCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  icon: Icon,
  children,
  action,
  className,
}) => {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg tracking-tight flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />}
          {title}
        </h3>
      </div>
      {children}
      {action && (
        <Button
          variant="outline"
          className="w-full mt-3 sm:mt-4 text-xs sm:text-sm"
          onClick={action.onClick}
        >
          {action.icon && <action.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />}
          {action.label}
        </Button>
      )}
    </Card>
  );
};
