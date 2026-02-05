/**
 * @file a11y.ts
 * @description Accessibility utilities for LexFlow application
 *
 * Provides helpers for:
 * - Screen reader announcements
 * - Focus management
 * - ARIA label generation
 * - Keyboard navigation
 */

/**
 * Live region element for screen reader announcements
 * Created lazily on first use
 */
let liveRegion: HTMLElement | null = null;

/**
 * Creates or returns the live region element for announcements
 */
function getLiveRegion(): HTMLElement {
  if (liveRegion && document.body.contains(liveRegion)) {
    return liveRegion;
  }

  liveRegion = document.createElement('div');
  liveRegion.id = 'a11y-live-region';
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  document.body.appendChild(liveRegion);

  return liveRegion;
}

/**
 * Announces a message to screen readers
 * @param message - The message to announce
 * @param priority - 'polite' for non-urgent, 'assertive' for important messages
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const region = getLiveRegion();
  region.setAttribute('aria-live', priority);

  // Clear existing content first to ensure the message is announced
  region.textContent = '';

  // Use requestAnimationFrame to ensure the DOM update is processed
  requestAnimationFrame(() => {
    region.textContent = message;
  });
}

/**
 * Gets all focusable elements within a container
 * @param container - The container element
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors)
  );

  return elements.filter(
    (el) => el.offsetParent !== null && !el.hasAttribute('inert')
  );
}

/**
 * Traps focus within a container element (useful for modals)
 * @param container - The container to trap focus within
 * @returns Cleanup function to remove the trap
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) {
    return () => {};
  }

  const firstElement = focusableElements[0];

  // Store the previously focused element
  const previouslyFocused = document.activeElement as HTMLElement | null;

  // Focus the first element
  firstElement.focus();

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    // Recalculate focusable elements in case DOM changed
    const currentFocusable = getFocusableElements(container);
    if (currentFocusable.length === 0) return;

    const first = currentFocusable[0];
    const last = currentFocusable[currentFocusable.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      // Tab
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
    // Restore focus to previously focused element
    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
    }
  };
}

/**
 * Generates an aria-label for a button with an icon
 * @param action - The action the button performs
 * @param target - Optional target of the action
 */
export function getButtonAriaLabel(action: string, target?: string): string {
  return target ? `${action} ${target}` : action;
}

/**
 * Generates an aria-label for a link
 * @param text - The link text
 * @param destination - Where the link goes
 * @param opensNewTab - Whether the link opens in a new tab
 */
export function getLinkAriaLabel(
  text: string,
  destination?: string,
  opensNewTab?: boolean
): string {
  let label = text;
  if (destination) {
    label += `, navigates to ${destination}`;
  }
  if (opensNewTab) {
    label += ', opens in new tab';
  }
  return label;
}

/**
 * Generates an aria-label for an input field
 * @param label - The field label
 * @param required - Whether the field is required
 * @param error - Any error message
 */
export function getInputAriaLabel(
  label: string,
  required?: boolean,
  error?: string
): string {
  let ariaLabel = label;
  if (required) {
    ariaLabel += ', required';
  }
  if (error) {
    ariaLabel += `, error: ${error}`;
  }
  return ariaLabel;
}

/**
 * Generates an aria-label for a status badge
 * @param status - The status text
 * @param context - Optional context (e.g., "case", "document")
 */
export function getStatusAriaLabel(status: string, context?: string): string {
  return context ? `${context} status: ${status}` : `Status: ${status}`;
}

/**
 * Generates an aria-label for a count badge
 * @param count - The count number
 * @param itemType - The type of items being counted
 */
export function getCountAriaLabel(count: number, itemType: string): string {
  const plural = count === 1 ? '' : 's';
  return `${count} ${itemType}${plural}`;
}

/**
 * Generates an aria-describedby ID for form errors
 * @param fieldName - The name of the field
 */
export function getErrorId(fieldName: string): string {
  return `${fieldName}-error`;
}

/**
 * Generates an aria-describedby ID for form hints
 * @param fieldName - The name of the field
 */
export function getHintId(fieldName: string): string {
  return `${fieldName}-hint`;
}

/**
 * Checks if reduced motion is preferred
 * @returns true if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Returns duration value based on reduced motion preference
 * @param normalDuration - Duration in ms for normal motion
 * @param reducedDuration - Duration in ms for reduced motion (default: 0)
 */
export function getMotionDuration(
  normalDuration: number,
  reducedDuration: number = 0
): number {
  return prefersReducedMotion() ? reducedDuration : normalDuration;
}

/**
 * CSS class helper for focus ring styling
 * Provides consistent focus indicators across the app
 */
export const focusRingClasses =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/**
 * CSS class helper for visually hidden but screen reader accessible content
 */
export const srOnlyClasses =
  'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

/**
 * Generates ID for connecting labels to inputs
 * @param baseName - The base name for the ID
 */
export function generateId(baseName: string): string {
  return `${baseName}-${Math.random().toString(36).substr(2, 9)}`;
}
