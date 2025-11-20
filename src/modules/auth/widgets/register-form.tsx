import { Mail, Lock, User, Building2, Sparkles } from 'lucide-react';
import type { RegisterFormProps } from "@/app/types/auth/auth.interfaces.ts";
import { Button } from '@/shared/ui/button.tsx';
import { Checkbox } from '@/shared/ui/checkbox.tsx';
import { Input } from '@/shared/ui/input.tsx';
import { Label } from '@/shared/ui/label.tsx';

export function RegisterForm({
  isLoading,
  firstName,
  lastName,
  email,
  password,
  firmName,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onFirmNameChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="register-firstname" className="text-foreground text-sm sm:text-base">
            Имя
          </Label>
          <div className="relative">
            <User className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              id="register-firstname"
              type="text"
              placeholder="Иван"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              className="pl-9 sm:pl-11 h-11 sm:h-12 rounded-lg sm:rounded-xl bg-muted/50 border-input focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
              required
            />
          </div>
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="register-lastname" className="text-foreground text-sm sm:text-base">
            Фамилия
          </Label>
          <Input
            id="register-lastname"
            type="text"
            placeholder="Петров"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            className="h-11 sm:h-12 rounded-lg sm:rounded-xl bg-muted/50 border-input focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="register-email" className="text-foreground text-sm sm:text-base">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          <Input
            id="register-email"
            type="email"
            placeholder="you@lawfirm.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="pl-9 sm:pl-11 h-11 sm:h-12 rounded-lg sm:rounded-xl bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="register-firm" className="text-foreground text-sm sm:text-base">
          Название фирмы
        </Label>
        <div className="relative">
          <Building2 className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          <Input
            id="register-firm"
            type="text"
            placeholder="Юридическая компания"
            value={firmName}
            onChange={(e) => onFirmNameChange(e.target.value)}
            className="pl-9 sm:pl-11 h-11 sm:h-12 rounded-lg sm:rounded-xl bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="register-password" className="text-foreground text-sm sm:text-base">
          Пароль
        </Label>
        <div className="relative">
          <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          <Input
            id="register-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="pl-9 sm:pl-11 h-11 sm:h-12 rounded-lg sm:rounded-xl bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
            required
          />
        </div>
        <p className="text-xs sm:text-xs text-muted-foreground">
          Минимум 8 символов, включая буквы и цифры
        </p>
      </div>

      <div className="flex items-start space-x-2 pt-1 sm:pt-2">
        <Checkbox
          id="terms"
          className="rounded-md border-input mt-0.5"
          required
        />
        <label
          htmlFor="terms"
          className="text-xs sm:text-sm text-muted-foreground cursor-pointer select-none"
        >
          Я согласен с{' '}
          <Button
            type="button"
            variant="link"
            className="text-blue-600 hover:text-blue-700 underline h-auto p-0 inline text-xs sm:text-sm"
          >
            условиями использования
          </Button>{' '}
          и{' '}
          <Button
            type="button"
            variant="link"
            className="text-blue-600 hover:text-blue-700 underline h-auto p-0 inline text-xs sm:text-sm"
          >
            политикой конфиденциальности
          </Button>
        </label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 text-sm sm:text-base"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Создание аккаунта...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Создать аккаунт
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        )}
      </Button>
    </form>
  );
}
