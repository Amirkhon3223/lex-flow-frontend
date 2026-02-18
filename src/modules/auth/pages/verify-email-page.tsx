import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/app/hooks/useAuth';
import { ROUTES } from '@/app/config/routes.config';
import { GradientBackground } from '@/modules/auth/ui/gradient-background';
import { BrandHeader } from '@/modules/auth/ui/brand-header';
import { PageFooter } from '@/modules/auth/widgets/page-footer';
import { VerifyEmailForm } from '@/modules/auth/widgets/verify-email-form';
import { LanguageSelectorPublic } from '@/shared/components/LanguageSelectorPublic';
import { useI18n } from '@/shared/context/I18nContext';

export function VerifyEmailPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user, isAuthenticated, emailVerificationRequired, loading, verifyEmail, resendVerificationCode, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
      return;
    }
    if (isAuthenticated && !emailVerificationRequired) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, emailVerificationRequired, navigate]);

  const handleSubmit = async (code: string) => {
    try {
      await verifyEmail(code);
      toast.success(t('AUTH.VERIFY_EMAIL.SUCCESS'));
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; code?: string } } };
      const code = err.response?.data?.code;
      if (code === 'INVALID_VERIFICATION_CODE') {
        toast.error(t('AUTH.VERIFY_EMAIL.INVALID_CODE'));
      } else {
        toast.error(err.response?.data?.message || t('AUTH.VERIFY_EMAIL.ERROR'));
      }
    }
  };

  const handleResend = async () => {
    try {
      await resendVerificationCode();
      toast.success(t('AUTH.VERIFY_EMAIL.CODE_SENT'));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { code?: string; message?: string } } };
      if (err.response?.data?.code === 'RESEND_TOO_SOON') {
        toast.error(t('AUTH.VERIFY_EMAIL.RESEND_TOO_SOON'));
      } else {
        toast.error(err.response?.data?.message || t('AUTH.VERIFY_EMAIL.RESEND_ERROR'));
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  if (!isAuthenticated || !emailVerificationRequired) {
    return null;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      <GradientBackground />
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelectorPublic />
      </div>
      <div className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-[95%] sm:max-w-md">
          <BrandHeader />
          <div className="bg-card/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-muted/50 border border-border/20 p-5 sm:p-6 md:p-8">
            <VerifyEmailForm
              isLoading={loading}
              email={user?.email || ''}
              onSubmit={handleSubmit}
              onResend={handleResend}
              onLogout={handleLogout}
            />
          </div>
          <PageFooter />
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
