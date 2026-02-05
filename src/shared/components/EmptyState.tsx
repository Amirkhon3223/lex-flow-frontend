/**
 * @file EmptyState.tsx
 * @description Reusable empty state component for lists with no data
 */

import type { ReactNode } from 'react';
import { FolderOpen, type LucideIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/ui/utils';

interface EmptyStateProps {
  /** Icon to display - defaults to FolderOpen */
  icon?: LucideIcon;
  /** Custom icon element */
  iconElement?: ReactNode;
  /** Main title */
  title: string;
  /** Description text */
  description?: string;
  /** Action button text */
  actionLabel?: string;
  /** Action button click handler */
  onAction?: () => void;
  /** Secondary action button text */
  secondaryActionLabel?: string;
  /** Secondary action button click handler */
  onSecondaryAction?: () => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class names */
  className?: string;
  /** Custom content to render below description */
  children?: ReactNode;
}

const sizeClasses = {
  sm: {
    container: 'py-8 px-4',
    iconWrapper: 'w-12 h-12 mb-3',
    icon: 'w-6 h-6',
    title: 'text-base',
    description: 'text-sm',
    button: 'h-8 text-sm',
  },
  md: {
    container: 'py-12 px-6',
    iconWrapper: 'w-16 h-16 mb-4',
    icon: 'w-8 h-8',
    title: 'text-lg',
    description: 'text-sm',
    button: 'h-9',
  },
  lg: {
    container: 'py-16 px-8',
    iconWrapper: 'w-20 h-20 mb-5',
    icon: 'w-10 h-10',
    title: 'text-xl',
    description: 'text-base',
    button: 'h-10',
  },
};

export function EmptyState({
  icon: Icon = FolderOpen,
  iconElement,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  size = 'md',
  className,
  children,
}: EmptyStateProps) {
  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizes.container,
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-muted/50',
          sizes.iconWrapper
        )}
      >
        {iconElement || (
          <Icon className={cn('text-muted-foreground', sizes.icon)} strokeWidth={1.5} />
        )}
      </div>

      {/* Title */}
      <h3 className={cn('font-semibold text-foreground', sizes.title)}>{title}</h3>

      {/* Description */}
      {description && (
        <p className={cn('mt-2 text-muted-foreground max-w-sm', sizes.description)}>
          {description}
        </p>
      )}

      {/* Custom content */}
      {children && <div className="mt-4">{children}</div>}

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-3 mt-6">
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
              className={sizes.button}
            >
              {secondaryActionLabel}
            </Button>
          )}
          {actionLabel && onAction && (
            <Button onClick={onAction} className={sizes.button}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Empty state specifically for search results
 */
interface SearchEmptyStateProps {
  query: string;
  onClear?: () => void;
  className?: string;
}

export function SearchEmptyState({ query, onClear, className }: SearchEmptyStateProps) {
  return (
    <EmptyState
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search terms.`}
      actionLabel={onClear ? 'Clear search' : undefined}
      onAction={onClear}
      className={className}
    />
  );
}

/**
 * Empty state for error scenarios
 */
interface ErrorEmptyStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorEmptyState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry,
  className,
}: ErrorEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={message}
      actionLabel={onRetry ? 'Try again' : undefined}
      onAction={onRetry}
      className={className}
      iconElement={
        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-2xl">!</span>
        </div>
      }
    />
  );
}
