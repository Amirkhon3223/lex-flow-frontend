/**
 * @file AddTaskDialog.tsx
 * @description Диалог для добавления новой задачи к делу
 */

import { useState } from 'react';
import { CheckSquare } from 'lucide-react';
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
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ title });
    onOpenChange(false);
    setTitle('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white/95 backdrop-blur-2xl border-gray-200/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-green-600" strokeWidth={2} />
            </div>
            Новая задача
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-gray-700">
              Название задачи *
            </Label>
            <Input
              id="title"
              placeholder="Например: Подготовить документы"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 rounded-xl border-gray-200 focus-visible:ring-green-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md"
            >
              <CheckSquare className="w-4 h-4 mr-2" strokeWidth={2} />
              Создать задачу
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
