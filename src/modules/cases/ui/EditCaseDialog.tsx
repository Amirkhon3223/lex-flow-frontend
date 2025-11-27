/**
 * @file EditCaseDialog.tsx
 * @description Диалог для редактирования существующего юридического дела
 */

import { useState, useEffect } from 'react';
import {
  Briefcase,
  User,
  Tag,
  Calendar,
  DollarSign,
} from 'lucide-react';
import type { EditCaseDialogProps } from '@/app/types/cases/cases.interfaces';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

export function EditCaseDialog({ open, onOpenChange, initialData, onSubmit }: EditCaseDialogProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: '',
    deadline: '',
    fee: '',
    description: '',
    priority: 'medium',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-2xl border-border">
        <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" strokeWidth={2} />
            </div>
            {t('CASES.EDIT_DIALOG.TITLE')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-foreground">
              {t('CASES.FIELDS.TITLE')} *
            </Label>
            <Input
              id="title"
              placeholder={t('CASES.EDIT_DIALOG.TITLE_PLACEHOLDER')}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-12 rounded-xl border-input focus-visible:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client" className="text-sm text-foreground">
                {t('CASES.FIELDS.CLIENT')} *
              </Label>
              <Select
                value={formData.client}
                onValueChange={(value) => setFormData({ ...formData, client: value })}
                required
              >
                <SelectTrigger className="h-12 rounded-xl border-input">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" strokeWidth={2} />
                  <SelectValue placeholder={t('CASES.EDIT_DIALOG.SELECT_CLIENT_PLACEHOLDER')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">Иванов Петр Алексеевич</SelectItem>
                  <SelectItem value="client2">ООО "ТехноСтрой"</SelectItem>
                  <SelectItem value="client3">Смирнова Анна Викторовна</SelectItem>
                  <SelectItem value="client4">ИП Петров М.И.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm text-foreground">
                {t('CASES.FIELDS.CATEGORY')} *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger className="h-12 rounded-xl border-input">
                  <Tag className="w-4 h-4 mr-2 text-muted-foreground" strokeWidth={2} />
                  <SelectValue placeholder={t('CASES.EDIT_DIALOG.SELECT_CATEGORY_PLACEHOLDER')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="labor">{t('CASES.CATEGORIES.LABOR')}</SelectItem>
                  <SelectItem value="civil">{t('CASES.CATEGORIES.CIVIL')}</SelectItem>
                  <SelectItem value="family">{t('CASES.CATEGORIES.FAMILY')}</SelectItem>
                  <SelectItem value="inheritance">{t('CASES.CATEGORIES.INHERITANCE')}</SelectItem>
                  <SelectItem value="contract">{t('CASES.CATEGORIES.CONTRACT')}</SelectItem>
                  <SelectItem value="corporate">{t('CASES.CATEGORIES.CORPORATE')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm text-foreground">
                {t('CASES.FIELDS.DEADLINE')}
              </Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="h-12 pl-12 rounded-xl border-input focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee" className="text-sm text-foreground">
                {t('CASES.FIELDS.FEE')}
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
                <Input
                  id="fee"
                  type="number"
                  placeholder="150000"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  className="h-12 pl-12 rounded-xl border-input focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm text-foreground">
              {t('COMMON.PRIORITY.PRIORITY')}
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger className="h-12 rounded-xl border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t('COMMON.PRIORITY.LOW')}</SelectItem>
                <SelectItem value="medium">{t('COMMON.PRIORITY.MEDIUM')}</SelectItem>
                <SelectItem value="high">{t('COMMON.PRIORITY.HIGH')}</SelectItem>
                <SelectItem value="urgent">{t('COMMON.STATUS.URGENT')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-foreground">
              {t('CASES.FIELDS.DESCRIPTION')}
            </Label>
            <Textarea
              id="description"
              placeholder={t('CASES.EDIT_DIALOG.DESCRIPTION_PLACEHOLDER')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[120px] rounded-xl border-input focus-visible:ring-blue-500 resize-none"
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
              className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
            >
              <Briefcase className="w-4 h-4 mr-2" strokeWidth={2} />
              {t('CASES.EDIT_DIALOG.SAVE')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
