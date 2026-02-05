/**
 * @file FocusRing.tsx
 * @description Consistent focus ring styling component and utility
 *
 * Provides a wrapper component and CSS classes for consistent
 * focus indicators across the application, improving keyboard navigation.
 */

/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { cn } from '@/shared/ui/utils';

interface FocusRingProps {
  /** Children to wrap with focus ring */
  children: React.ReactNode;
  /** Additional class names */
  className?: string;
  /** Whether to use inset focus ring */
  inset?: boolean;
  /** Focus ring color variant */
  variant?: 'default' | 'primary' | 'destructive';
  /** Whether to show focus ring on focus (vs focus-visible) */
  focusMode?: 'visible' | 'always';
}

/**
 * CSS classes for focus ring styling
 */
export const focusRingClasses = {
  /** Default focus ring - visible only on keyboard navigation */
  default:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',

  /** Primary colored focus ring */
  primary:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',

  /** Destructive colored focus ring */
  destructive:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background',

  /** Inset focus ring (no offset) */
  inset:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',

  /** Always show focus ring (not just keyboard) */
  always:
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
};

/**
 * FocusRing wrapper component
 *
 * Wraps children with consistent focus ring styling.
 * Use this when you need programmatic control over focus styling.
 *
 * @example
 * <FocusRing>
 *   <button onClick={handleClick}>Click me</button>
 * </FocusRing>
 *
 * // Or use the class directly:
 * <button className={focusRingClasses.default}>Click me</button>
 */
export function FocusRing({
  children,
  className,
  inset = false,
  variant = 'default',
  focusMode = 'visible',
}: FocusRingProps) {
  const ringClass = React.useMemo(() => {
    if (focusMode === 'always') {
      return focusRingClasses.always;
    }
    if (inset) {
      return focusRingClasses.inset;
    }
    return focusRingClasses[variant];
  }, [inset, variant, focusMode]);

  // Clone the child and add focus ring classes
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(
        (children as React.ReactElement<{ className?: string }>).props.className,
        ringClass,
        className
      ),
    });
  }

  // If not a valid element, wrap in a span
  return <span className={cn(ringClass, className)}>{children}</span>;
}

/**
 * Hook to get focus ring classes based on props
 *
 * @example
 * const focusClasses = useFocusRing({ variant: 'primary' });
 * return <button className={cn(buttonClasses, focusClasses)}>...</button>;
 */
export function useFocusRing(options: Omit<FocusRingProps, 'children'> = {}): string {
  const { inset = false, variant = 'default', focusMode = 'visible' } = options;

  return React.useMemo(() => {
    if (focusMode === 'always') {
      return focusRingClasses.always;
    }
    if (inset) {
      return focusRingClasses.inset;
    }
    return focusRingClasses[variant];
  }, [inset, variant, focusMode]);
}

/**
 * Utility function to programmatically manage focus
 * @param element - Element to focus
 * @param options - Focus options
 */
export function focusElement(
  element: HTMLElement | null,
  options: FocusOptions = { preventScroll: false }
): void {
  if (element) {
    element.focus(options);
  }
}

/**
 * Utility to check if an element is focusable
 * @param element - Element to check
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  return (
    focusableSelectors.some((selector) => element.matches(selector)) &&
    element.offsetParent !== null &&
    !element.hasAttribute('inert')
  );
}
