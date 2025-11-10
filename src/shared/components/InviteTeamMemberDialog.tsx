import { useState } from 'react';
import { Mail, UserPlus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface InviteTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: { email: string; role: string }) => void;
}

export function InviteTeamMemberDialog({ open, onOpenChange, onSubmit }: InviteTeamMemberDialogProps) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'lawyer',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onOpenChange(false);
    setFormData({ email: '', role: 'lawyer' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white/95 backdrop-blur-2xl border-gray-200/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-600" strokeWidth={2} />
            </div>
            Пригласить в команду
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Отправьте приглашение новому члену команды
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 pl-12 rounded-xl border-gray-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Роль</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="admin">Администратор</SelectItem>
                <SelectItem value="lawyer">Юрист</SelectItem>
                <SelectItem value="assistant">Ассистент</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
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
              Отправить приглашение
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
