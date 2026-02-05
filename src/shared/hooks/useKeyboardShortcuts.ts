/**
 * @file useKeyboardShortcuts.ts
 * @description Hook for global and page-specific keyboard shortcuts
 */

import { useEffect, useCallback, useRef } from 'react';

export interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  /** Scope for the shortcut - global shortcuts work everywhere */
  scope?: 'global' | 'page';
}

interface UseKeyboardShortcutsOptions {
  shortcuts: Shortcut[];
  enabled?: boolean;
}

/**
 * Normalize key for cross-platform compatibility
 */
function normalizeKey(key: string): string {
  return key.toLowerCase();
}

/**
 * Check if the event target is an input element
 */
function isInputElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    target.isContentEditable
  );
}

/**
 * Hook for registering keyboard shortcuts
 */
export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) {
  const shortcutsRef = useRef(shortcuts);

  // Keep shortcuts ref updated
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const target = event.target;
      const isInput = isInputElement(target);

      for (const shortcut of shortcutsRef.current) {
        // Skip page shortcuts when in input unless explicitly global
        if (isInput && shortcut.scope !== 'global') continue;

        const keyMatch = normalizeKey(event.key) === normalizeKey(shortcut.key);
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        // Handle meta key separately for Mac
        const metaMatch = shortcut.meta ? event.metaKey : true;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.action();
          break;
        }
      }
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

/**
 * Format shortcut for display
 */
export function formatShortcut(shortcut: Shortcut): string {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const parts: string[] = [];

  if (shortcut.ctrl) {
    parts.push(isMac ? '\u2318' : 'Ctrl');
  }
  if (shortcut.alt) {
    parts.push(isMac ? '\u2325' : 'Alt');
  }
  if (shortcut.shift) {
    parts.push(isMac ? '\u21E7' : 'Shift');
  }

  // Format the key
  let key = shortcut.key.toUpperCase();
  if (key === ' ') key = 'Space';
  if (key === 'ESCAPE') key = 'Esc';
  if (key === 'ARROWUP') key = '\u2191';
  if (key === 'ARROWDOWN') key = '\u2193';
  if (key === 'ARROWLEFT') key = '\u2190';
  if (key === 'ARROWRIGHT') key = '\u2192';
  if (key === 'ENTER') key = '\u21B5';
  if (key === '/') key = '/';

  parts.push(key);

  return parts.join(isMac ? '' : '+');
}

/**
 * Common global shortcuts definition
 */
export const GLOBAL_SHORTCUTS = {
  SEARCH: { key: 'k', ctrl: true, description: 'SHORTCUTS.SEARCH' },
  HELP: { key: '/', ctrl: true, description: 'SHORTCUTS.HELP' },
  ESCAPE: { key: 'Escape', description: 'SHORTCUTS.CLOSE' },
} as const;

/**
 * Page-specific shortcuts definitions
 */
export const PAGE_SHORTCUTS = {
  CLIENTS: {
    NEW: { key: 'n', ctrl: true, description: 'SHORTCUTS.NEW_CLIENT' },
  },
  CASES: {
    NEW: { key: 'n', ctrl: true, description: 'SHORTCUTS.NEW_CASE' },
  },
  DOCUMENTS: {
    UPLOAD: { key: 'u', ctrl: true, description: 'SHORTCUTS.UPLOAD_DOCUMENT' },
  },
  CALENDAR: {
    NEW_MEETING: { key: 'm', ctrl: true, description: 'SHORTCUTS.NEW_MEETING' },
    TODAY: { key: 't', description: 'SHORTCUTS.GO_TO_TODAY' },
  },
} as const;
