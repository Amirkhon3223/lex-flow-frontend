import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/app/store/auth.store';
import { BrandHeader } from '@/modules/auth/ui/brand-header.tsx';
import { GradientBackground } from '@/modules/auth/ui/gradient-background.tsx';
import { AuthCard } from '@/modules/auth/widgets/auth-card.tsx';
import { PageFooter } from '@/modules/auth/widgets/page-footer.tsx';
import { LanguageSelectorPublic } from '@/shared/components/LanguageSelectorPublic.tsx';
import { useI18n } from '@/shared/context/I18nContext';
import { validators, parseApiErrors, type FormErrors } from '@/shared/utils';

export default function AuthPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const {
    login,
    register,
    verify2FALogin,
    clearTwoFactorState,
    loading,
    isAuthenticated,
    twoFactorRequired,
    error: _error,
  } = useAuthStore();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [_localError, setLocalError] = useState('');
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});

  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFirmName, setRegisterFirmName] = useState('');
  const [registerCountry, setRegisterCountry] = useState('');
  const [registerCity, setRegisterCity] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  const validateLoginForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validators.required(loginEmail, t('AUTH.EMAIL')) || validators.email(loginEmail, t('AUTH.EMAIL'));
    if (emailError) newErrors.email = emailError;

    const passwordError = validators.required(loginPassword, t('AUTH.PASSWORD')) || validators.minLength(loginPassword, 8, t('AUTH.PASSWORD'));
    if (passwordError) newErrors.password = passwordError;

    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginEmailChange = (value: string) => {
    setLoginEmail(value);
    if (loginErrors.email) {
      setLoginErrors((prev) => { const n = { ...prev }; delete n.email; return n; });
    }
  };

  const handleLoginPasswordChange = (value: string) => {
    setLoginPassword(value);
    if (loginErrors.password) {
      setLoginErrors((prev) => { const n = { ...prev }; delete n.password; return n; });
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    if (!validateLoginForm()) {
      toast.error(t('COMMON.ERRORS.VALIDATION'));
      return;
    }

    try {
      await login({
        email: loginEmail,
        password: loginPassword,
        rememberMe,
      });
    } catch (error) {
      const apiErrors = parseApiErrors(error);
      if (Object.keys(apiErrors).length > 0) {
        setLoginErrors(apiErrors);
      }
      const errMsg = (error as Error).message || t('AUTH.ERROR.LOGIN_FAILED');
      setLocalError(errMsg);
      toast.error(errMsg);
    }
  };

  const validateRegisterForm = (): boolean => {
    const newErrors: FormErrors = {};

    const firstNameError = validators.required(registerFirstName, t('AUTH.FIRST_NAME'));
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validators.required(registerLastName, t('AUTH.LAST_NAME'));
    if (lastNameError) newErrors.lastName = lastNameError;

    const emailError = validators.required(registerEmail, t('AUTH.EMAIL')) || validators.email(registerEmail, t('AUTH.EMAIL'));
    if (emailError) newErrors.email = emailError;

    const passwordError = validators.required(registerPassword, t('AUTH.PASSWORD')) || validators.password(registerPassword);
    if (passwordError) newErrors.password = passwordError;

    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterFieldChange = (field: string, setter: (value: string) => void) => (value: string) => {
    setter(value);
    if (registerErrors[field]) {
      setRegisterErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    if (!validateRegisterForm()) {
      toast.error(t('COMMON.ERRORS.VALIDATION'));
      return;
    }

    try {
      await register({
        email: registerEmail,
        password: registerPassword,
        firstName: registerFirstName,
        lastName: registerLastName,
        firmName: registerFirmName.trim() || undefined,
        phone: registerPhone.trim() || undefined,
        country: registerCountry.trim() || undefined,
        city: registerCity.trim() || undefined,
      });
      toast.success(t('AUTH.REGISTER_SUCCESS'));
    } catch (error) {
      const apiErrors = parseApiErrors(error);
      if (Object.keys(apiErrors).length > 0) {
        setRegisterErrors(apiErrors);
      }
      const errMsg = (error as Error).message || t('AUTH.ERROR.REGISTER_FAILED');
      setLocalError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleVerify2FA = async (code: string) => {
    setLocalError('');
    try {
      await verify2FALogin(code);
    } catch (error) {
      setLocalError((error as Error).message || '2FA verification failed');
    }
  };

  const handleBackFrom2FA = () => {
    clearTwoFactorState();
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      <GradientBackground />

      {}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelectorPublic />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-[95%] sm:max-w-md">
          <BrandHeader />

          <AuthCard
            isLoading={loading}
            twoFactorRequired={twoFactorRequired}
            loginEmail={loginEmail}
            loginPassword={loginPassword}
            rememberMe={rememberMe}
            loginErrors={loginErrors}
            onLoginEmailChange={handleLoginEmailChange}
            onLoginPasswordChange={handleLoginPasswordChange}
            onRememberMeChange={setRememberMe}
            registerFirstName={registerFirstName}
            registerLastName={registerLastName}
            registerEmail={registerEmail}
            registerPassword={registerPassword}
            registerFirmName={registerFirmName}
            registerCountry={registerCountry}
            registerCity={registerCity}
            registerPhone={registerPhone}
            registerErrors={registerErrors}
            onRegisterFirstNameChange={handleRegisterFieldChange('firstName', setRegisterFirstName)}
            onRegisterLastNameChange={handleRegisterFieldChange('lastName', setRegisterLastName)}
            onRegisterEmailChange={handleRegisterFieldChange('email', setRegisterEmail)}
            onRegisterPasswordChange={handleRegisterFieldChange('password', setRegisterPassword)}
            onRegisterFirmNameChange={setRegisterFirmName}
            onRegisterCountryChange={setRegisterCountry}
            onRegisterCityChange={setRegisterCity}
            onRegisterPhoneChange={setRegisterPhone}
            onLoginSubmit={handleLogin}
            onRegisterSubmit={handleRegister}
            onVerify2FA={handleVerify2FA}
            onBackFrom2FA={handleBackFrom2FA}
          />

          <PageFooter />
        </div>
      </div>
    </div>
  );
}
