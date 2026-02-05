/**
 * @file useReducedMotion.ts
 * @description Hook for respecting user's reduced motion preferences
 *
 * Uses the prefers-reduced-motion media query to determine if
 * animations should be reduced or disabled for accessibility.
 */

import { useEffect, useState } from 'react';

/**
 * Hook that returns whether the user prefers reduced motion
 * @returns true if user has enabled reduced motion preference
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 *
 * const animationDuration = prefersReducedMotion ? 0 : 300;
 * const shouldAnimate = !prefersReducedMotion;
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    () => {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return false;
      }
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  );

  useEffect(() => {
    // Return early if not in browser
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Update state when preference changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers (Safari < 14)
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Helper function to get animation duration based on reduced motion preference
 * @param normalDuration - Duration in ms when motion is allowed
 * @param reducedDuration - Duration in ms when motion should be reduced (default: 0)
 * @param prefersReduced - Whether reduced motion is preferred
 * @returns The appropriate duration
 */
export function getAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0,
  prefersReduced: boolean
): number {
  return prefersReduced ? reducedDuration : normalDuration;
}

/**
 * Helper function to get transition class based on reduced motion preference
 * @param normalClass - CSS class for normal transitions
 * @param reducedClass - CSS class for reduced/no transitions (default: '')
 * @param prefersReduced - Whether reduced motion is preferred
 * @returns The appropriate CSS class
 */
export function getTransitionClass(
  normalClass: string,
  reducedClass: string = '',
  prefersReduced: boolean
): string {
  return prefersReduced ? reducedClass : normalClass;
}
