import { useState } from 'react';
import { ShieldOff, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { securityService } from '@/app/services/security/security.service';
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';
import { Label } from '@/shared/ui/label';

interface Disable2FADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function Disable2FADialog({ open, onOpenChange, onSuccess }: Disable2FADialogProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const handleDisable = async () => {
    if (!password) {
      toast.error(t('SETTINGS.SECURITY.PASSWORD_REQUIRED'));
      return;
    }

    if (code.length !== 6 && code.length !== 8) {
      toast.error(t('SETTINGS.SECURITY.TWO_FACTOR.INVALID_CODE_LENGTH'));
      return;
    }

    setLoading(true);
    try {
      await securityService.disable2FA({ password, code });
      toast.success(t('SETTINGS.SECURITY.TWO_FACTOR.DISABLED_SUCCESS'));
      onSuccess();
      handleClose();
    } catch {
      toast.error(t('SETTINGS.SECURITY.TWO_FACTOR.DISABLE_FAILED'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setCode('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <ShieldOff className="w-5 h-5 text-red-600 dark:text-red-400" strokeWidth={2} />
            </div>
            <DialogTitle className="text-xl">
              {t('SETTINGS.SECURITY.TWO_FACTOR.DISABLE_TITLE')}
            </DialogTitle>
          </div>
          <DialogDescription>
            {t('SETTINGS.SECURITY.TWO_FACTOR.DISABLE_DESCRIPTION')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg">
            <div className="flex items-start gap-3">
              <ShieldOff className="w-5 h-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-red-900 dark:text-red-200">
                <p className="font-medium mb-1">
                  {t('SETTINGS.SECURITY.TWO_FACTOR.DISABLE_WARNING_TITLE')}
                </p>
                <p className="text-red-800 dark:text-red-300">
                  {t('SETTINGS.SECURITY.TWO_FACTOR.DISABLE_WARNING_DESC')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {t('SETTINGS.SECURITY.CURRENT_PASSWORD')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('SETTINGS.SECURITY.ENTER_PASSWORD')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp-input" className="text-sm font-medium">
                {t('SETTINGS.SECURITY.TWO_FACTOR.ENTER_CODE_OR_BACKUP')}
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={8}
                  value={code}
                  onChange={setCode}
                  disabled={loading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {t('SETTINGS.SECURITY.TWO_FACTOR.CODE_OR_BACKUP_HINT')}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              {t('COMMON.CANCEL')}
            </Button>
            <Button
              type="button"
              onClick={handleDisable}
              disabled={loading || !password || (code.length !== 6 && code.length !== 8)}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              {loading ? t('COMMON.LOADING') : t('SETTINGS.SECURITY.TWO_FACTOR.DISABLE_CONFIRM')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
