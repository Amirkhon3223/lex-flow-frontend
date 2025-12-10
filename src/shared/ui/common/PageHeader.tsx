import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/ui/utils';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  gradient?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  gradient = 'from-blue-500 to-purple-600',
  actions,
  className,
}) => {
  return (
    <header className={cn('relative bg-background border-b border-border rounded-xl', className)}>
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              className={cn(
                'w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                gradient
              )}
            >
              <Icon
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 text-white"
                strokeWidth={2}
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl tracking-tight truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      </div>
    </header>
  );
};
