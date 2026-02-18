import { useState, useEffect } from 'react';
import { ArrowRight, Mail, LogOut, RotateCw } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';
import { Label } from '@/shared/ui/label';

interface VerifyEmailFormProps {
  isLoading: boolean;
  email: string;
  onSubmit: (code: string) => void;
  onResend: () => void;
  onLogout: () => void;
}

export function VerifyEmailForm({ isLoading, email, onSubmit, onResend, onLogout }: VerifyEmailFormProps) {
  const { t } = useI18n();
  const [code, setCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length === 6) {
      onSubmit(code);
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    onResend();
    setResendCooldown(60);
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_match, start, _middle, end) => `${start}${'*'.repeat(Math.min(_middle.length, 5))}${end}`)
    : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Mail className="w-7 h-7 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          {t('AUTH.VERIFY_EMAIL.TITLE')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('AUTH.VERIFY_EMAIL.DESCRIPTION')}
        </p>
        {maskedEmail && (
          <p className="text-sm font-medium text-foreground">{maskedEmail}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-foreground text-sm">
          {t('AUTH.VERIFY_EMAIL.CODE_LABEL')}
        </Label>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-14 text-lg" />
              <InputOTPSlot index={1} className="w-12 h-14 text-lg" />
              <InputOTPSlot index={2} className="w-12 h-14 text-lg" />
              <InputOTPSlot index={3} className="w-12 h-14 text-lg" />
              <InputOTPSlot index={4} className="w-12 h-14 text-lg" />
              <InputOTPSlot index={5} className="w-12 h-14 text-lg" />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t('AUTH.VERIFY_EMAIL.VERIFYING')}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {t('AUTH.VERIFY_EMAIL.BUTTON')}
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={handleResend}
          disabled={isLoading || resendCooldown > 0}
          className="w-full h-11 rounded-xl text-muted-foreground hover:text-foreground"
        >
          <RotateCw className="w-4 h-4 mr-2" />
          {resendCooldown > 0
            ? t('AUTH.VERIFY_EMAIL.RESEND_COOLDOWN', { seconds: resendCooldown })
            : t('AUTH.VERIFY_EMAIL.RESEND')}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onLogout}
          disabled={isLoading}
          className="w-full h-11 rounded-xl text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t('AUTH.VERIFY_EMAIL.LOGOUT')}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {t('AUTH.VERIFY_EMAIL.HINT')}
        </p>
      </div>
    </form>
  );
}
