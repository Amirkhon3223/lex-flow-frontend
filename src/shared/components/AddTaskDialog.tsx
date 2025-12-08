import { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { useCasesStore } from '@/app/store/cases.store';
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
  caseId: string;
}

export function AddTaskDialog({ open, onOpenChange, caseId }: AddTaskDialogProps) {
  const { t } = useI18n();

  const { addTask, fetchTasks } = useCasesStore();
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    await addTask(caseId, title);
    await fetchTasks(caseId);

    setTitle('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-green-600" strokeWidth={2} />
            </div>
            {t('TASKS.NEW_TASK')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('TASKS.TASK_TITLE')} *</Label>
            <Input
              id="title"
              placeholder={t('TASKS.TASK_TITLE_PLACEHOLDER')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {t('COMMON.ACTIONS.CANCEL')}
            </Button>
            <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white">
              {t('TASKS.CREATE_TASK')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
