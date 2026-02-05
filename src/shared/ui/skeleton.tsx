import { cn } from './utils';

interface SkeletonProps extends React.ComponentProps<'div'> {
  /** Animation variant */
  variant?: 'pulse' | 'shimmer' | 'wave';
}

function Skeleton({ className, variant = 'pulse', ...props }: SkeletonProps) {
  const variantClasses = {
    pulse: 'animate-pulse',
    shimmer: 'skeleton-shimmer',
    wave: 'skeleton-wave',
  };

  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-muted/60 rounded-md relative overflow-hidden',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton text lines for paragraph loading states
 */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton card for card loading states
 */
interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  showAvatar?: boolean;
}

function SkeletonCard({ className, showImage = false, showAvatar = true }: SkeletonCardProps) {
  return (
    <div className={cn('bg-card rounded-xl p-4 space-y-4', className)}>
      {showImage && <Skeleton className="w-full h-32 rounded-lg" />}
      <div className="flex items-start gap-3">
        {showAvatar && <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

/**
 * Skeleton table row for table loading states
 */
interface SkeletonTableRowProps {
  columns?: number;
  className?: string;
}

function SkeletonTableRow({ columns = 4, className }: SkeletonTableRowProps) {
  return (
    <div className={cn('flex items-center gap-4 py-3', className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === 0 ? 'w-1/4' : 'flex-1'
          )}
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTableRow };
