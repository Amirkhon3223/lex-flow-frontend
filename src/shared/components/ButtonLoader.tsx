/**
 * @file ButtonLoader.tsx
 * @description Inline loading spinner for buttons
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/ui/utils';

interface ButtonLoaderProps {
  /** Size of the loader */
  size?: 'sm' | 'md' | 'lg';
  /** Optional class name */
  className?: string;
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function ButtonLoader({ size = 'md', className }: ButtonLoaderProps) {
  return (
    <Loader2
      className={cn('animate-spin', sizeClasses[size], className)}
      strokeWidth={2}
    />
  );
}

/**
 * Custom dots loader for a different style
 */
interface DotsLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const dotSizeClasses = {
  sm: 'w-1 h-1',
  md: 'w-1.5 h-1.5',
  lg: 'w-2 h-2',
};

const gapClasses = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5',
};

export function DotsLoader({ size = 'md', className }: DotsLoaderProps) {
  return (
    <div className={cn('flex items-center', gapClasses[size], className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            'rounded-full bg-current animate-pulse',
            dotSizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: '600ms',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Spinner with text for longer operations
 */
interface LoadingTextProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingText({ text, size = 'md', className }: LoadingTextProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <ButtonLoader size={size} />
      <span>{text}</span>
    </span>
  );
}
