import { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp.tsx';
import { Label } from '@/shared/ui/label.tsx';

interface TwoFactorFormProps {
  isLoading: boolean;
  onSubmit: (code: string) => void;
  onBack: () => void;
}

export function TwoFactorForm({ isLoading, onSubmit, onBack }: TwoFactorFormProps) {
  const { t } = useI18n();
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length === 6) {
      onSubmit(code);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          {t('SETTINGS.SECURITY.TWO_FACTOR.VERIFY_TITLE')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('SETTINGS.SECURITY.TWO_FACTOR.VERIFY_DESCRIPTION')}
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground text-sm">
          {t('SETTINGS.SECURITY.TWO_FACTOR.CODE_LABEL')}
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
              {t('SETTINGS.SECURITY.TWO_FACTOR.VERIFYING')}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {t('SETTINGS.SECURITY.TWO_FACTOR.VERIFY_BUTTON')}
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          className="w-full h-11 rounded-xl text-muted-foreground hover:text-foreground"
        >
          {t('COMMON.ACTIONS.BACK')}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {t('SETTINGS.SECURITY.TWO_FACTOR.BACKUP_CODE_HINT')}
        </p>
      </div>
    </form>
  );
}
