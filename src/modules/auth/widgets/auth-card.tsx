import type { AuthCardProps } from '@/app/types/auth/auth.interfaces.ts';
import { LoginForm } from '@/modules/auth/widgets/login-form.tsx';
import { RegisterForm } from '@/modules/auth/widgets/register-form.tsx';
import { SocialAuthButtons } from '@/modules/auth/widgets/social-auth-buttons.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs.tsx';
import './auth-card.css';

export function AuthCard({
  isLoading,
  loginEmail,
  loginPassword,
  rememberMe,
  onLoginEmailChange,
  onLoginPasswordChange,
  onRememberMeChange,
  registerFirstName,
  registerLastName,
  registerEmail,
  registerPassword,
  registerFirmName,
  registerCountry,
  registerCity,
  registerPhone,
  onRegisterFirstNameChange,
  onRegisterLastNameChange,
  onRegisterEmailChange,
  onRegisterPasswordChange,
  onRegisterFirmNameChange,
  onRegisterCountryChange,
  onRegisterCityChange,
  onRegisterPhoneChange,
  onLoginSubmit,
  onRegisterSubmit,
}: AuthCardProps) {
  return (
    <div className="bg-card/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-muted/50 border border-border/20 p-5 sm:p-6 md:p-8">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-5 sm:mb-6 md:mb-8 bg-muted/80 rounded-2xl sm:rounded-2xl shadow-2xl p-0">
          <TabsTrigger
            value="login"
            className="rounded-2xl sm:rounded-2xl data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm sm:text-base"
          >
            Вход
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="rounded-2xl sm:rounded-2xl data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm sm:text-base"
          >
            Регистрация
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4 sm:space-y-5 md:space-y-6">
          <LoginForm
            isLoading={isLoading}
            email={loginEmail}
            password={loginPassword}
            rememberMe={rememberMe}
            onEmailChange={onLoginEmailChange}
            onPasswordChange={onLoginPasswordChange}
            onRememberMeChange={onRememberMeChange}
            onSubmit={onLoginSubmit}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-background/70 text-muted-foreground">
                или продолжить с
              </span>
            </div>
          </div>

          <SocialAuthButtons />
        </TabsContent>

        <TabsContent value="register" className="space-y-4 sm:space-y-5 md:space-y-6">
          <RegisterForm
            isLoading={isLoading}
            firstName={registerFirstName}
            lastName={registerLastName}
            email={registerEmail}
            password={registerPassword}
            firmName={registerFirmName}
            country={registerCountry}
            city={registerCity}
            phone={registerPhone}
            onFirstNameChange={onRegisterFirstNameChange}
            onLastNameChange={onRegisterLastNameChange}
            onEmailChange={onRegisterEmailChange}
            onPasswordChange={onRegisterPasswordChange}
            onFirmNameChange={onRegisterFirmNameChange}
            onCountryChange={onRegisterCountryChange}
            onCityChange={onRegisterCityChange}
            onPhoneChange={onRegisterPhoneChange}
            onSubmit={onRegisterSubmit}
          />

          <div className="text-center text-xs sm:text-sm text-muted-foreground px-2">
            Регистрируясь, вы получаете доступ к 14-дневному бесплатному пробному периоду
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
