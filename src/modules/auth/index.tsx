import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { BrandHeader } from '@/modules/auth/ui/brand-header.tsx';
import { GradientBackground } from '@/modules/auth/ui/gradient-background.tsx';
import { AuthCard } from '@/modules/auth/widgets/auth-card.tsx';
import { PageFooter } from '@/modules/auth/widgets/page-footer.tsx';

export default function AuthPage() {
  const navigate = useNavigate();
  const {
    login,
    register,
    verify2FALogin,
    clearTwoFactorState,
    loading,
    isAuthenticated,
    twoFactorRequired,
    error: _error
  } = useAuthStore();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [_localError, setLocalError] = useState('');

  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFirmName, setRegisterFirmName] = useState('');
  const [registerCountry, setRegisterCountry] = useState('');
  const [registerCity, setRegisterCity] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');
    try {
      await login({
        email: loginEmail,
        password: loginPassword,
        rememberMe,
      });
    } catch (error) {
      setLocalError((error as Error).message || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');
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
    } catch (error) {
      setLocalError((error as Error).message || 'Registration failed');
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

      <div className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-[95%] sm:max-w-md">
          <BrandHeader />

          <AuthCard
            isLoading={loading}
            twoFactorRequired={twoFactorRequired}
            loginEmail={loginEmail}
            loginPassword={loginPassword}
            rememberMe={rememberMe}
            onLoginEmailChange={setLoginEmail}
            onLoginPasswordChange={setLoginPassword}
            onRememberMeChange={setRememberMe}
            registerFirstName={registerFirstName}
            registerLastName={registerLastName}
            registerEmail={registerEmail}
            registerPassword={registerPassword}
            registerFirmName={registerFirmName}
            registerCountry={registerCountry}
            registerCity={registerCity}
            registerPhone={registerPhone}
            onRegisterFirstNameChange={setRegisterFirstName}
            onRegisterLastNameChange={setRegisterLastName}
            onRegisterEmailChange={setRegisterEmail}
            onRegisterPasswordChange={setRegisterPassword}
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
