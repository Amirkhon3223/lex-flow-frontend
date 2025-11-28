/**
 * @file AddTaskDialog.tsx
 * @description Диалог для добавления новой задачи к делу
 */

import { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (taskData: { title: string }) => void;
}

export function AddTaskDialog({ open, onOpenChange, onSubmit }: AddTaskDialogProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ title });
    onOpenChange(false);
    setTitle('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-2xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-green-600 dark:text-green-400" strokeWidth={2} />
            </div>
            {t('TASKS.NEW_TASK')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-foreground">
              {t('TASKS.TASK_TITLE')} *
            </Label>
            <Input
              id="title"
              placeholder={t('TASKS.TASK_TITLE_PLACEHOLDER')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 rounded-xl border-input focus-visible:ring-green-500"
              required
            />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl border-input hover:bg-muted"
            >
              {t('COMMON.ACTIONS.CANCEL')}
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md"
            >
              <CheckSquare className="w-4 h-4 mr-2" strokeWidth={2} />
              {t('TASKS.CREATE_TASK')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
