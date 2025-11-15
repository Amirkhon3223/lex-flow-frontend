import type { AuthCardProps } from "@/app/types/auth/auth.interfaces.ts";
import { LoginForm } from "@/modules/auth/widgets/login-form.tsx";
import { RegisterForm } from "@/modules/auth/widgets/register-form.tsx";
import { SocialAuthButtons } from "@/modules/auth/widgets/social-auth-buttons.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs.tsx';

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
  onRegisterFirstNameChange,
  onRegisterLastNameChange,
  onRegisterEmailChange,
  onRegisterPasswordChange,
  onRegisterFirmNameChange,
  onLoginSubmit,
  onRegisterSubmit,
}: AuthCardProps) {
    return (
        <div
            className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/20 p-5 sm:p-6 md:p-8">
            <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-5 sm:mb-6 md:mb-8 bg-slate-100/80 rounded-xl sm:rounded-2xl p-1">
                    <TabsTrigger
                        value="login"
                        className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm sm:text-base"
                    >
                        Вход
                    </TabsTrigger>
                    <TabsTrigger
                        value="register"
                        className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm sm:text-base"
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
                            <div className="w-full border-t border-slate-200"/>
                        </div>
                        <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-white/70 text-slate-500">
                или продолжить с
              </span>
                        </div>
                    </div>

                    <SocialAuthButtons/>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 sm:space-y-5 md:space-y-6">
                    <RegisterForm
                        isLoading={isLoading}
                        firstName={registerFirstName}
                        lastName={registerLastName}
                        email={registerEmail}
                        password={registerPassword}
                        firmName={registerFirmName}
                        onFirstNameChange={onRegisterFirstNameChange}
                        onLastNameChange={onRegisterLastNameChange}
                        onEmailChange={onRegisterEmailChange}
                        onPasswordChange={onRegisterPasswordChange}
                        onFirmNameChange={onRegisterFirmNameChange}
                        onSubmit={onRegisterSubmit}
                    />

                    <div className="text-center text-xs sm:text-sm text-slate-600 px-2">
                        Регистрируясь, вы получаете доступ к 14-дневному бесплатному пробному
                        периоду
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
