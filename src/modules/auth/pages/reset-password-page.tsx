import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/app/services/auth/auth.service';
import { GradientBackground } from '@/modules/auth/ui/gradient-background';
import { BrandHeader } from '@/modules/auth/ui/brand-header';
import { PageFooter } from '@/modules/auth/widgets/page-footer';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/ui/utils';

export function ResetPasswordPage() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  // Auto-redirect after success
  useEffect(() => {
    if (!isSuccess) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/login';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!token) {
      newErrors.token = t('AUTH.ERRORS.INVALID_RESET_TOKEN');
    }

    if (!newPassword) {
      newErrors.newPassword = t('AUTH.ERRORS.PASSWORD_REQUIRED');
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t('AUTH.ERRORS.PASSWORD_MIN_LENGTH');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('AUTH.ERRORS.CONFIRM_PASSWORD_REQUIRED');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('AUTH.ERRORS.PASSWORDS_NOT_MATCH');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      await authService.resetPassword(token, newPassword, confirmPassword);
      setIsSuccess(true);
      toast.success(t('AUTH.PASSWORD_RESET_SUCCESS'));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || t('AUTH.ERRORS.RESET_FAILED');
      toast.error(message);

      if (message.includes('expired') || message.includes('invalid')) {
        setErrors({ token: t('AUTH.ERRORS.INVALID_RESET_TOKEN') });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    window.location.href = '/login';
  };

  // Simple card wrapper (not AuthCard which requires login/register props)
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-card/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-muted/50 border border-border/20 p-5 sm:p-6 md:p-8">
      {children}
    </div>
  );

  // No token provided
  if (!token && !isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <GradientBackground />
        <div className="relative z-10 w-full max-w-md">
          <BrandHeader />
          <Card>
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{t('AUTH.INVALID_RESET_LINK')}</h2>
              <p className="text-muted-foreground mb-6">{t('AUTH.INVALID_RESET_LINK_DESC')}</p>
              <Button
                onClick={handleGoToLogin}
                className="h-11 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('AUTH.BACK_TO_LOGIN')}
              </Button>
            </div>
          </Card>
          <PageFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <GradientBackground />
      <div className="relative z-10 w-full max-w-md">
        <BrandHeader />
        <Card>
          {!isSuccess ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">{t('AUTH.RESET_PASSWORD_TITLE')}</h2>
                <p className="text-muted-foreground mt-2">{t('AUTH.RESET_PASSWORD_DESC')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="new-password"
                    className={cn(errors.newPassword && 'text-destructive')}
                  >
                    {t('AUTH.NEW_PASSWORD')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock
                      className={cn(
                        'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                        errors.newPassword ? 'text-destructive' : 'text-muted-foreground'
                      )}
                    />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, newPassword: '' }));
                      }}
                      className={cn(
                        'pl-11 h-12 rounded-xl',
                        errors.newPassword && 'border-destructive ring-destructive/20'
                      )}
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-destructive text-sm">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirm-password"
                    className={cn(errors.confirmPassword && 'text-destructive')}
                  >
                    {t('AUTH.CONFIRM_PASSWORD')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock
                      className={cn(
                        'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                        errors.confirmPassword ? 'text-destructive' : 'text-muted-foreground'
                      )}
                    />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      className={cn(
                        'pl-11 h-12 rounded-xl',
                        errors.confirmPassword && 'border-destructive ring-destructive/20'
                      )}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-destructive text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                {errors.token && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm">{errors.token}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('COMMON.LOADING')}
                    </>
                  ) : (
                    t('AUTH.RESET_PASSWORD')
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleGoToLogin}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('AUTH.BACK_TO_LOGIN')}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{t('AUTH.PASSWORD_CHANGED')}</h2>
              <p className="text-muted-foreground mb-4">{t('AUTH.PASSWORD_CHANGED_DESC')}</p>
              <p className="text-sm text-muted-foreground mb-6">
                {t('AUTH.REDIRECTING_TO_LOGIN', { seconds: countdown })}
              </p>
              <Button
                onClick={handleGoToLogin}
                className="h-11 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                {t('AUTH.GO_TO_LOGIN')}
              </Button>
            </div>
          )}
        </Card>
        <PageFooter />
      </div>
    </div>
  );
}

export default ResetPasswordPage;
