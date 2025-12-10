import { Mail, Lock, ArrowRight } from 'lucide-react';
import type { LoginFormProps } from '@/app/types/auth/auth.interfaces.ts';
import { Button } from '@/shared/ui/button.tsx';
import { Checkbox } from '@/shared/ui/checkbox.tsx';
import { Input } from '@/shared/ui/input.tsx';
import { Label } from '@/shared/ui/label.tsx';

export function LoginForm({
  isLoading,
  email,
  password,
  rememberMe,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="login-email" className="text-foreground text-sm sm:text-base">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="pl-9 sm:pl-11 h-11 sm:h-12 rounded-lg sm:rounded-xl bg-muted/50 border-input focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="login-password" className="text-foreground text-sm sm:text-base">
          Пароль
        </Label>
        <div className="relative">
          <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="pl-9 sm:pl-11 h-11 sm:h-12 rounded-lg sm:rounded-xl bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
            required
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => onRememberMeChange(Boolean(checked))}
            className="rounded-md border-input"
          />
          <label
            htmlFor="remember"
            className="text-xs sm:text-sm text-muted-foreground cursor-pointer select-none"
          >
            Запомнить меня
          </label>
        </div>
        <Button
          type="button"
          variant="link"
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 h-auto p-0"
        >
          Забыли пароль?
        </Button>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 text-sm sm:text-base"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Вход...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Войти
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        )}
      </Button>
    </form>
  );
}
