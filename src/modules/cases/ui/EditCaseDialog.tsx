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
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: '',
    deadline: '',
    fee: '',
    description: '',
    priority: 'medium',
  });

  // Update form data when initialData changes
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
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-2xl border-gray-200/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" strokeWidth={2} />
            </div>
            Редактировать дело
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Название дела */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-gray-700">
              Название дела *
            </Label>
            <Input
              id="title"
              placeholder="Например: Трудовой спор - увольнение"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-12 rounded-xl border-gray-200 focus-visible:ring-blue-500"
              required
            />
          </div>

          {/* Клиент и Категория */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client" className="text-sm text-gray-700">
                Клиент *
              </Label>
              <Select
                value={formData.client}
                onValueChange={(value) => setFormData({ ...formData, client: value })}
                required
              >
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
                  <User className="w-4 h-4 mr-2 text-gray-400" strokeWidth={2} />
                  <SelectValue placeholder="Выберите клиента" />
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
              <Label htmlFor="category" className="text-sm text-gray-700">
                Категория *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
                  <Tag className="w-4 h-4 mr-2 text-gray-400" strokeWidth={2} />
                  <SelectValue placeholder="Категория дела" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="labor">Трудовое право</SelectItem>
                  <SelectItem value="civil">Гражданское право</SelectItem>
                  <SelectItem value="family">Семейное право</SelectItem>
                  <SelectItem value="inheritance">Наследственное право</SelectItem>
                  <SelectItem value="contract">Договорное право</SelectItem>
                  <SelectItem value="corporate">Корпоративное право</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Срок и Гонорар */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm text-gray-700">
                Срок выполнения
              </Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="h-12 pl-12 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee" className="text-sm text-gray-700">
                Гонорар (₽)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
                <Input
                  id="fee"
                  type="number"
                  placeholder="150000"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  className="h-12 pl-12 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Приоритет */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm text-gray-700">
              Приоритет
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger className="h-12 rounded-xl border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Низкий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="high">Высокий</SelectItem>
                <SelectItem value="urgent">Срочный</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-gray-700">
              Описание дела
            </Label>
            <Textarea
              id="description"
              placeholder="Краткое описание обстоятельств дела..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[120px] rounded-xl border-gray-200 focus-visible:ring-blue-500 resize-none"
            />
          </div>

          {/* Кнопки */}
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
              className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
            >
              <Briefcase className="w-4 h-4 mr-2" strokeWidth={2} />
              Сохранить изменения
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
