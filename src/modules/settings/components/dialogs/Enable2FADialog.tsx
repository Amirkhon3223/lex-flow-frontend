import { useState, useEffect } from 'react';
import { Shield, Copy, Check } from 'lucide-react';
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';
import { Label } from '@/shared/ui/label';

interface Enable2FADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (backupCodes: string[]) => void;
}

export function Enable2FADialog({ open, onOpenChange, onSuccess }: Enable2FADialogProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    if (open && step === 'setup') {
      initiate2FA();
    }
  }, [open, step]);

  const initiate2FA = async () => {
    setLoading(true);
    try {
      const response = await securityService.enable2FA();
      setQrCode(response.qrCode);
      setSecret(response.secret);
      setStep('verify');
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Failed to initiate 2FA:', error);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error(t('SETTINGS.SECURITY.TWO_FACTOR.INVALID_CODE_LENGTH'));
      return;
    }

    setLoading(true);
    try {
      const response = await securityService.verify2FA({ code });
      toast.success(t('SETTINGS.SECURITY.TWO_FACTOR.ENABLED_SUCCESS'));
      onSuccess(response.backupCodes || []);
      handleClose();
    } catch (error) {
      toast.error(t('SETTINGS.SECURITY.TWO_FACTOR.INVALID_CODE'));
      console.error('Failed to verify 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopiedSecret(true);
      toast.success(t('COMMON.COPIED'));
      setTimeout(() => setCopiedSecret(false), 2000);
    } catch (error) {
      toast.error(t('COMMON.ERRORS.COPY_FAILED'));
    }
  };

  const handleClose = () => {
    setStep('setup');
    setCode('');
    setQrCode('');
    setSecret('');
    setCopiedSecret(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
            </div>
            <DialogTitle className="text-xl">
              {t('SETTINGS.SECURITY.TWO_FACTOR.ENABLE_TITLE')}
            </DialogTitle>
          </div>
          <DialogDescription>
            {t('SETTINGS.SECURITY.TWO_FACTOR.ENABLE_DESCRIPTION')}
          </DialogDescription>
        </DialogHeader>

        {step === 'verify' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-xl border-2 border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                {qrCode && (
                  <img
                    src={qrCode}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                )}
              </div>

              <div className="w-full space-y-2">
                <Label className="text-sm text-muted-foreground text-center block">
                  {t('SETTINGS.SECURITY.TWO_FACTOR.MANUAL_ENTRY')}
                </Label>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                  <code className="flex-1 text-sm font-mono text-center break-all">
                    {secret}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopySecret}
                    className="shrink-0"
                  >
                    {copiedSecret ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="otp-input" className="text-sm font-medium">
                {t('SETTINGS.SECURITY.TWO_FACTOR.ENTER_CODE')}
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
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
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {t('SETTINGS.SECURITY.TWO_FACTOR.CODE_HINT')}
              </p>
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
                onClick={handleVerify}
                disabled={loading || code.length !== 6}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                {loading ? t('COMMON.LOADING') : t('SETTINGS.SECURITY.TWO_FACTOR.VERIFY')}
              </Button>
            </div>
          </div>
        )}

        {step === 'setup' && loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
