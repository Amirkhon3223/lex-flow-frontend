import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { authService } from '@/app/services/auth/auth.service';
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
import { cn } from '@/shared/ui/utils';

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordModalProps) {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(t('AUTH.ERRORS.EMAIL_REQUIRED'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('AUTH.ERRORS.INVALID_EMAIL'));
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSuccess(true);
    } catch {
      // Always show success to not reveal if email exists (security)
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setEmail('');
    setError('');
    setIsSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{t('AUTH.FORGOT_PASSWORD_TITLE')}</DialogTitle>
              <DialogDescription>
                {t('AUTH.FORGOT_PASSWORD_DESCRIPTION')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className={cn(error && 'text-destructive')}>
                  {t('AUTH.EMAIL')}
                </Label>
                <div className="relative">
                  <Mail
                    className={cn(
                      'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                      error ? 'text-destructive' : 'text-muted-foreground'
                    )}
                  />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={cn(
                      'pl-11 h-12 rounded-xl',
                      error && 'border-destructive ring-destructive/20'
                    )}
                    autoFocus
                  />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-11 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('COMMON.ACTIONS.BACK')}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('COMMON.LOADING')}
                    </>
                  ) : (
                    t('AUTH.SEND_RESET_LINK')
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl">{t('AUTH.CHECK_YOUR_EMAIL')}</DialogTitle>
              <DialogDescription className="text-base">
                {t('AUTH.RESET_LINK_SENT')}
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm text-muted-foreground mt-4">
              {t('AUTH.RESET_LINK_EXPIRY')}
            </p>
            <Button
              onClick={handleClose}
              className="mt-6 h-11 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              {t('COMMON.ACTIONS.CLOSE')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
