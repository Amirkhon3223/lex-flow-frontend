import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BrandHeader } from '@/modules/auth/ui/brand-header.tsx';
import { GradientBackground } from '@/modules/auth/ui/gradient-background.tsx';
import { AuthCard } from '@/modules/auth/widgets/auth-card.tsx';
import { PageFooter } from '@/modules/auth/widgets/page-footer.tsx';

export default function AuthPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFirmName, setRegisterFirmName] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Register:', {
        firstName: registerFirstName,
        lastName: registerLastName,
        email: registerEmail,
        password: registerPassword,
        firmName: registerFirmName,
      });
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      <GradientBackground />

      <div className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-[95%] sm:max-w-md">
          <BrandHeader />

          <AuthCard
            isLoading={isLoading}
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
            onRegisterFirstNameChange={setRegisterFirstName}
            onRegisterLastNameChange={setRegisterLastName}
            onRegisterEmailChange={setRegisterEmail}
            onRegisterPasswordChange={setRegisterPassword}
            onRegisterFirmNameChange={setRegisterFirmName}
            onLoginSubmit={handleLogin}
            onRegisterSubmit={handleRegister}
          />

          <PageFooter />
        </div>
      </div>
    </div>
  );
}
