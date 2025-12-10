import { useState } from 'react';
import { Mail, UserPlus } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface InviteTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: { email: string; role: string }) => void;
}

export function InviteTeamMemberDialog({
  open,
  onOpenChange,
  onSubmit,
}: InviteTeamMemberDialogProps) {
  const { t } = useI18n();
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
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-2xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
            </div>
            {t('SETTINGS.TEAM.INVITE_MEMBER')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('SETTINGS.TEAM.INVITE_DESCRIPTION')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('CLIENTS.FIELDS.EMAIL')}</Label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                strokeWidth={2}
              />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 pl-12 rounded-xl border-input"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">{t('SETTINGS.TEAM.ROLE')}</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className="h-12 rounded-xl border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="admin">{t('SETTINGS.TEAM.ROLES.ADMIN')}</SelectItem>
                <SelectItem value="lawyer">{t('SETTINGS.TEAM.ROLES.LAWYER')}</SelectItem>
                <SelectItem value="assistant">{t('SETTINGS.TEAM.ROLES.ASSISTANT')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
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
              {t('SETTINGS.TEAM.SEND_INVITE')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
