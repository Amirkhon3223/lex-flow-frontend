/**
 * @file useKeyboardNavigation.ts
 * @description Hook for managing keyboard navigation in lists, menus, and other components
 *
 * Provides arrow key navigation, Enter/Space selection, and Escape handling.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseKeyboardNavigationOptions {
  /** Array of items to navigate through */
  itemCount: number;
  /** Initial focused index (-1 means none focused) */
  initialIndex?: number;
  /** Whether navigation wraps around */
  wrap?: boolean;
  /** Whether the navigation is horizontal (arrow left/right) */
  horizontal?: boolean;
  /** Callback when an item is selected (Enter/Space) */
  onSelect?: (index: number) => void;
  /** Callback when Escape is pressed */
  onEscape?: () => void;
  /** Callback when focus changes */
  onFocusChange?: (index: number) => void;
  /** Whether the navigation is active (for conditional enabling) */
  enabled?: boolean;
}

interface UseKeyboardNavigationReturn {
  /** Currently focused index */
  focusedIndex: number;
  /** Set the focused index manually */
  setFocusedIndex: (index: number) => void;
  /** Props to spread on the container element */
  containerProps: {
    tabIndex: number;
    role: string;
    'aria-activedescendant': string | undefined;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  /** Get props for an individual item */
  getItemProps: (index: number) => {
    id: string;
    role: string;
    tabIndex: number;
    'aria-selected': boolean;
    onClick: () => void;
    onMouseEnter: () => void;
  };
  /** Reset focus to initial state */
  resetFocus: () => void;
  /** Move focus to first item */
  focusFirst: () => void;
  /** Move focus to last item */
  focusLast: () => void;
}

/**
 * Hook for keyboard navigation in lists and menus
 *
 * @example
 * const { focusedIndex, containerProps, getItemProps } = useKeyboardNavigation({
 *   itemCount: items.length,
 *   onSelect: (index) => handleSelect(items[index]),
 *   onEscape: () => setIsOpen(false),
 * });
 *
 * return (
 *   <ul {...containerProps}>
 *     {items.map((item, index) => (
 *       <li key={item.id} {...getItemProps(index)}>
 *         {item.label}
 *       </li>
 *     ))}
 *   </ul>
 * );
 */
export function useKeyboardNavigation(
  options: UseKeyboardNavigationOptions
): UseKeyboardNavigationReturn {
  const {
    itemCount,
    initialIndex = -1,
    wrap = true,
    horizontal = false,
    onSelect,
    onEscape,
    onFocusChange,
    enabled = true,
  } = options;

  const [focusedIndex, setFocusedIndex] = useState(initialIndex);
  const idPrefix = useRef(`kb-nav-${Math.random().toString(36).substr(2, 9)}`);

  // Reset focus when item count changes
  useEffect(() => {
    if (focusedIndex >= itemCount) {
      setFocusedIndex(itemCount > 0 ? itemCount - 1 : -1);
    }
  }, [itemCount, focusedIndex]);

  // Notify when focus changes
  useEffect(() => {
    if (focusedIndex >= 0 && onFocusChange) {
      onFocusChange(focusedIndex);
    }
  }, [focusedIndex, onFocusChange]);

  const moveFocus = useCallback(
    (direction: 'next' | 'prev') => {
      if (itemCount === 0) return;

      setFocusedIndex((current) => {
        let next: number;

        if (direction === 'next') {
          next = current + 1;
          if (next >= itemCount) {
            next = wrap ? 0 : itemCount - 1;
          }
        } else {
          next = current - 1;
          if (next < 0) {
            next = wrap ? itemCount - 1 : 0;
          }
        }

        return next;
      });
    },
    [itemCount, wrap]
  );

  const focusFirst = useCallback(() => {
    if (itemCount > 0) {
      setFocusedIndex(0);
    }
  }, [itemCount]);

  const focusLast = useCallback(() => {
    if (itemCount > 0) {
      setFocusedIndex(itemCount - 1);
    }
  }, [itemCount]);

  const resetFocus = useCallback(() => {
    setFocusedIndex(initialIndex);
  }, [initialIndex]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!enabled) return;

      const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';
      const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';

      switch (event.key) {
        case prevKey:
          event.preventDefault();
          moveFocus('prev');
          break;

        case nextKey:
          event.preventDefault();
          moveFocus('next');
          break;

        case 'Home':
          event.preventDefault();
          focusFirst();
          break;

        case 'End':
          event.preventDefault();
          focusLast();
          break;

        case 'Enter':
        case ' ':
          if (focusedIndex >= 0 && onSelect) {
            event.preventDefault();
            onSelect(focusedIndex);
          }
          break;

        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
      }
    },
    [
      enabled,
      horizontal,
      moveFocus,
      focusFirst,
      focusLast,
      focusedIndex,
      onSelect,
      onEscape,
    ]
  );

  const getItemId = useCallback(
    (index: number) => `${idPrefix.current}-item-${index}`,
    []
  );

  const containerProps = {
    tabIndex: enabled ? 0 : -1,
    role: 'listbox' as const,
    'aria-activedescendant':
      focusedIndex >= 0 ? getItemId(focusedIndex) : undefined,
    onKeyDown: handleKeyDown,
  };

  const getItemProps = useCallback(
    (index: number) => ({
      id: getItemId(index),
      role: 'option' as const,
      tabIndex: -1,
      'aria-selected': focusedIndex === index,
      onClick: () => {
        setFocusedIndex(index);
        onSelect?.(index);
      },
      onMouseEnter: () => {
        setFocusedIndex(index);
      },
    }),
    [focusedIndex, getItemId, onSelect]
  );

  return {
    focusedIndex,
    setFocusedIndex,
    containerProps,
    getItemProps,
    resetFocus,
    focusFirst,
    focusLast,
  };
}

/**
 * Simpler hook just for handling Escape key
 * @param onEscape - Callback when Escape is pressed
 * @param enabled - Whether the handler is active
 *
 * @example
 * useEscapeKey(() => setIsOpen(false), isOpen);
 */
export function useEscapeKey(
  onEscape: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, enabled]);
}

/**
 * Hook for handling click outside an element
 * Useful for closing dropdowns/modals when clicking outside
 *
 * @example
 * const ref = useClickOutside(() => setIsOpen(false), isOpen);
 * return <div ref={ref}>...</div>;
 */
export function useClickOutside<T extends HTMLElement>(
  onClickOutside: () => void,
  enabled: boolean = true
): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    // Use mousedown to catch clicks before they bubble
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClickOutside, enabled]);

  return ref;
}
