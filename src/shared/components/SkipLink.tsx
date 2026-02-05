/**
 * @file SkipLink.tsx
 * @description Skip navigation links for keyboard users
 *
 * Provides links to skip directly to main content or navigation,
 * improving keyboard navigation accessibility.
 * Links are visually hidden until focused.
 */

/* eslint-disable react-refresh/only-export-components */
import { cn } from '@/shared/ui/utils';

interface SkipLinkProps {
  /** ID of the main content element to skip to */
  mainContentId?: string;
  /** ID of the navigation element to skip to */
  navigationId?: string;
  /** Custom class names */
  className?: string;
  /** Label for skip to main content link */
  mainContentLabel?: string;
  /** Label for skip to navigation link */
  navigationLabel?: string;
}

/**
 * SkipLink component for keyboard accessibility
 *
 * Renders visually hidden links that become visible when focused,
 * allowing keyboard users to skip repetitive navigation.
 *
 * @example
 * // In your App or Layout component:
 * <SkipLink mainContentId="main-content" navigationId="main-nav" />
 *
 * // Then in your layout:
 * <nav id="main-nav">...</nav>
 * <main id="main-content">...</main>
 */
export function SkipLink({
  mainContentId = 'main-content',
  navigationId = 'main-nav',
  className,
  mainContentLabel = 'Skip to main content',
  navigationLabel = 'Skip to navigation',
}: SkipLinkProps) {
  const linkClasses = cn(
    // Visually hidden by default
    'sr-only',
    // Visible when focused
    'focus:not-sr-only',
    'focus:absolute',
    'focus:top-4',
    'focus:left-4',
    'focus:z-[100]',
    // Styling
    'bg-primary',
    'text-primary-foreground',
    'px-4',
    'py-2',
    'rounded-md',
    'font-medium',
    'text-sm',
    'shadow-lg',
    // Focus ring
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-ring',
    'focus:ring-offset-2',
    // Transition
    'transition-transform',
    className
  );

  return (
    <div className="skip-links">
      <a href={`#${mainContentId}`} className={linkClasses}>
        {mainContentLabel}
      </a>
      <a
        href={`#${navigationId}`}
        className={cn(linkClasses, 'focus:left-[180px]')}
      >
        {navigationLabel}
      </a>
    </div>
  );
}

/**
 * Hook to add skip link target attributes to an element
 * @param id - The ID to use for the skip link target
 * @returns Props to spread on the target element
 *
 * @example
 * const mainProps = useSkipLinkTarget('main-content');
 * return <main {...mainProps}>...</main>;
 */
export function useSkipLinkTarget(id: string) {
  return {
    id,
    tabIndex: -1,
    // Outline none when programmatically focused via skip link
    style: { outline: 'none' } as React.CSSProperties,
  };
}
