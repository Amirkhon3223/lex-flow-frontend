import { useState, useEffect } from 'react';
import { Mail, Lock, User, Building2, Sparkles, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { COUNTRIES, CITIES } from '@/app/constants/locations';
import { ROUTES } from '@/app/config/routes.config';
import type { RegisterFormProps } from '@/app/types/auth/auth.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { cn } from '@/shared/ui/utils';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Combobox } from '@/shared/ui/Combobox.tsx';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export function RegisterForm({
  isLoading,
  firstName,
  lastName,
  email,
  password,
  firmName,
  country,
  city,
  phone,
  errors = {},
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onFirmNameChange,
  onCountryChange,
  onCityChange,
  onPhoneChange,
  onSubmit,
}: RegisterFormProps) {
  const { t } = useI18n();

  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [cityError, setCityError] = useState('');

  useEffect(() => {
    if (country) {
      setAvailableCities(CITIES[country] || []);
      setCityError('');
    } else {
      setAvailableCities([]);
    }
  }, [country]);

  const countryOptions = COUNTRIES.map((c) => ({
    label: c.label,
    value: c.value,
    icon: c.flag,
  }));

  const cityOptions = availableCities.map((c) => ({
    label: c,
    value: c,
  }));

  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className={cn(errors.firstName && "text-destructive")}>
            {t('AUTH.FIRST_NAME')} <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
              errors.firstName ? "text-destructive" : "text-muted-foreground"
            )} />
            <Input
              placeholder={t('AUTH.PLACEHOLDER.FIRST_NAME')}
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              className={cn(
                "pl-11 h-12 rounded-xl bg-muted/50 border-input",
                errors.firstName && "border-destructive ring-destructive/20"
              )}
            />
          </div>
          {errors.firstName && <p className="text-destructive text-xs">{errors.firstName}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className={cn(errors.lastName && "text-destructive")}>
            {t('AUTH.LAST_NAME')} <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder={t('AUTH.PLACEHOLDER.LAST_NAME')}
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            className={cn(
              "h-12 rounded-xl bg-muted/50 border-input",
              errors.lastName && "border-destructive ring-destructive/20"
            )}
          />
          {errors.lastName && <p className="text-destructive text-xs">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className={cn(errors.email && "text-destructive")}>
          {t('AUTH.EMAIL')} <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Mail className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
            errors.email ? "text-destructive" : "text-slate-400"
          )} />
          <Input
            type="email"
            placeholder="you@lawfirm.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className={cn(
              "pl-11 h-12 rounded-xl bg-slate-50/50 border-slate-200",
              errors.email && "border-destructive ring-destructive/20"
            )}
          />
        </div>
        {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>{t('AUTH.FIRM_NAME')}</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder={t('AUTH.PLACEHOLDER.FIRM_NAME')}
            value={firmName}
            onChange={(e) => onFirmNameChange(e.target.value)}
            className="pl-11 h-12 rounded-xl bg-slate-50/50 border-slate-200"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>{t('AUTH.PHONE')}</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="tel"
            placeholder="+1 234 567 890"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="pl-11 h-12 rounded-xl bg-slate-50/50 border-slate-200"
          />
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>{t('AUTH.COUNTRY')}</Label>
          <Combobox
            value={country}
            options={countryOptions}
            placeholder={t('AUTH.PLACEHOLDER.COUNTRY')}
            onChange={(val) => {
              onCountryChange(val);
              setCityError('');
            }}
            renderIcon={true}
          />
        </div>

        <div className="space-y-1.5">
          <Label>{t('AUTH.CITY')}</Label>
          <Combobox
            value={city}
            options={cityOptions}
            placeholder={t('AUTH.PLACEHOLDER.CITY')}
            disabled={!country}
            onChange={(val) => {
              if (!country) {
                const msg = t('AUTH.ERROR.SELECT_COUNTRY');
                toast.error(msg);
                setCityError(msg);
              } else {
                onCityChange(val);
                setCityError('');
              }
            }}
            errorText={cityError}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className={cn(errors.password && "text-destructive")}>
          {t('AUTH.PASSWORD')} <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Lock className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
            errors.password ? "text-destructive" : "text-slate-400"
          )} />
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={cn(
              "pl-11 h-12 rounded-xl bg-slate-50/50 border-slate-200",
              errors.password && "border-destructive ring-destructive/20"
            )}
          />
        </div>
        {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
        <p className="text-xs text-muted-foreground">{t('AUTH.PASSWORD_REQUIREMENTS')}</p>
      </div>

      <div className="flex items-start space-x-2 pt-2">
        <Checkbox id="terms" required className="rounded-md border-input mt-0.5" />
        <label htmlFor="terms" className="text-xs sm:text-sm text-muted-foreground cursor-pointer">
          {t('AUTH.AGREE')}{' '}
          <Link
            to={ROUTES.TERMS_OF_SERVICE}
            className="text-blue-600 underline hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('AUTH.TERMS')}
          </Link>{' '}
          {t('AUTH.AND')}{' '}
          <Link
            to={ROUTES.PRIVACY_POLICY}
            className="text-blue-600 underline hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('AUTH.PRIVACY')}
          </Link>
        </label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t('AUTH.CREATING_ACCOUNT')}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {t('AUTH.CREATE_ACCOUNT')}
            <Sparkles className="w-5 h-5" />
          </span>
        )}
      </Button>
    </form>
  );
}
