/**
 * @file PageLoader.tsx
 * @description Full-page loading component with LexFlow branding
 */

import { Scale } from 'lucide-react';
import { cn } from '@/shared/ui/utils';

interface PageLoaderProps {
  /** Optional loading message */
  message?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the full-screen overlay */
  fullScreen?: boolean;
  /** Additional class names */
  className?: string;
}

export function PageLoader({
  message,
  size = 'md',
  fullScreen = true,
  className,
}: PageLoaderProps) {
  const sizeClasses = {
    sm: {
      container: 'gap-3',
      icon: 'w-8 h-8',
      text: 'text-sm',
      spinner: 'w-12 h-12',
    },
    md: {
      container: 'gap-4',
      icon: 'w-10 h-10',
      text: 'text-base',
      spinner: 'w-16 h-16',
    },
    lg: {
      container: 'gap-5',
      icon: 'w-14 h-14',
      text: 'text-lg',
      spinner: 'w-20 h-20',
    },
  };

  const sizes = sizeClasses[size];

  const content = (
    <div className={cn('flex flex-col items-center justify-center', sizes.container, className)}>
      {/* Animated logo */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div
          className={cn(
            'absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin',
            sizes.spinner
          )}
          style={{ animationDuration: '1s' }}
        />

        {/* Inner pulsing circle */}
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5',
            sizes.spinner
          )}
        >
          <Scale
            className={cn('text-primary animate-pulse', sizes.icon)}
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Brand text */}
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-foreground tracking-tight">Lex</span>
        <span className="font-semibold text-primary tracking-tight">Flow</span>
      </div>

      {/* Optional message */}
      {message && (
        <p className={cn('text-muted-foreground animate-pulse', sizes.text)}>{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">{content}</div>
  );
}

/**
 * Inline loader for smaller sections
 */
interface SectionLoaderProps {
  message?: string;
  className?: string;
}

export function SectionLoader({ message, className }: SectionLoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <div className="relative w-10 h-10">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"
          style={{ animationDuration: '0.8s' }}
        />
        <div className="absolute inset-2 rounded-full bg-primary/10" />
      </div>
      {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
