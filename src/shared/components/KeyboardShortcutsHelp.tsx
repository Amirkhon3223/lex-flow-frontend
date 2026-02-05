/**
 * @file KeyboardShortcutsHelp.tsx
 * @description Modal showing all available keyboard shortcuts
 */

import { Keyboard } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { formatShortcut, type Shortcut } from '@/shared/hooks/useKeyboardShortcuts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    keys: Shortcut;
    label: string;
  }>;
}

export function KeyboardShortcutsHelp({ open, onOpenChange }: KeyboardShortcutsHelpProps) {
  const { t } = useI18n();

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: t('SHORTCUTS.GROUPS.GLOBAL'),
      shortcuts: [
        {
          keys: { key: 'k', ctrl: true, description: '', action: () => {} },
          label: t('SHORTCUTS.SEARCH'),
        },
        {
          keys: { key: '/', ctrl: true, description: '', action: () => {} },
          label: t('SHORTCUTS.HELP'),
        },
        {
          keys: { key: 'Escape', description: '', action: () => {} },
          label: t('SHORTCUTS.CLOSE'),
        },
      ],
    },
    {
      title: t('SHORTCUTS.GROUPS.NAVIGATION'),
      shortcuts: [
        {
          keys: { key: 'g', ctrl: true, description: '', action: () => {} },
          label: t('SHORTCUTS.GO_TO_DASHBOARD'),
        },
        {
          keys: { key: '1', ctrl: true, description: '', action: () => {} },
          label: t('SHORTCUTS.GO_TO_CLIENTS'),
        },
        {
          keys: { key: '2', ctrl: true, description: '', action: () => {} },
          label: t('SHORTCUTS.GO_TO_CASES'),
        },
        {
          keys: { key: '3', ctrl: true, description: '', action: () => {} },
          label: t('SHORTCUTS.GO_TO_DOCUMENTS'),
        },
        {
          keys: { key: '4', ctrl: true, description: '', action: () => {} },
          label: t('SHORTCUTS.GO_TO_CALENDAR'),
        },
      ],
    },
    {
      title: t('SHORTCUTS.GROUPS.ACTIONS'),
      shortcuts: [
        {
          keys: { key: 'n', ctrl: true, description: '', action: () => {} },
          label: t('SHORTCUTS.NEW_ITEM'),
        },
        {
          keys: { key: 's', ctrl: true, description: '', action: () => {} },
          label: t('SHORTCUTS.SAVE'),
        },
        {
          keys: { key: 'Enter', ctrl: true, description: '', action: () => {} },
          label: t('SHORTCUTS.SUBMIT'),
        },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            {t('SHORTCUTS.TITLE')}
          </DialogTitle>
          <DialogDescription>{t('SHORTCUTS.DESCRIPTION')}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {shortcutGroups.map((group, index) => (
              <div key={group.title}>
                {index > 0 && <Separator className="mb-6" />}
                <h3 className="text-sm font-semibold text-foreground mb-3">{group.title}</h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm text-muted-foreground">{shortcut.label}</span>
                      <kbd className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium bg-muted rounded border border-border shadow-sm">
                        {formatShortcut(shortcut.keys)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            {t('SHORTCUTS.PRESS_ESCAPE_TO_CLOSE')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
