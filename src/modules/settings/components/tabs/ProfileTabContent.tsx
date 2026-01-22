import { useEffect, useState } from 'react';
import { Clock, Coins, Globe, Mail, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { usersService } from '@/app/services/users/users.service';
import { useAuthStore } from '@/app/store/auth.store';
import { RussiaFlag } from '@/shared/components/flags/RussiaFlag';
import { TajikistanFlag } from '@/shared/components/flags/TajikistanFlag';
import { UKFlag } from '@/shared/components/flags/UKFlag';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { cn } from '@/shared/ui/utils';
import { validators, parseApiErrors, type FormErrors } from '@/shared/utils';

export function ProfileTabContent() {
  const { t, setLanguage } = useI18n();
  const { user, refreshUser: _refreshUser, updateUserData } = useAuthStore();
  const [openSelect, setOpenSelect] = useState<'language' | 'timezone' | 'currency' | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    position: '',
    company: '',
    address: '',
    country: '',
    city: '',
  });
  const [currentLanguage, setCurrentLanguage] = useState<'ru' | 'en' | 'tj'>('ru');
  const [currentCurrency, setCurrentCurrency] = useState<'USD' | 'RUB' | 'EUR' | 'TJS' | 'UZS' | 'KZT' | 'CAD'>('USD');
  const [timezone, setTimezone] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        middleName: user.middleName || '',
        email: user.email || '',
        phone: user.phone || '',
        position: user.position || '',
        company: user.company || '',
        address: user.address || '',
        country: user.country || '',
        city: user.city || '',
      });
      setCurrentLanguage((user.language || 'ru') as 'ru' | 'en' | 'tj');
      setCurrentCurrency((user.currency || 'USD') as 'USD' | 'RUB' | 'EUR' | 'TJS' | 'UZS' | 'KZT' | 'CAD');
      setTimezone(user.timezone || 'Europe/Moscow');
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const validateProfileForm = (): boolean => {
    const newErrors: FormErrors = {};

    const firstNameError = validators.required(formData.firstName, t('SETTINGS.PROFILE.FIRST_NAME')) ||
      validators.minLength(formData.firstName, 2, t('SETTINGS.PROFILE.FIRST_NAME'));
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validators.required(formData.lastName, t('SETTINGS.PROFILE.LAST_NAME')) ||
      validators.minLength(formData.lastName, 2, t('SETTINGS.PROFILE.LAST_NAME'));
    if (lastNameError) newErrors.lastName = lastNameError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      toast.error(t('COMMON.ERRORS.VALIDATION'));
      return;
    }

    setLoading(true);

    try {
      const updatedUser = await usersService.updateMe({
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || undefined,
        phone: formData.phone,
        position: formData.position,
        company: formData.company || undefined,
        address: formData.address || undefined,
        country: formData.country || undefined,
        city: formData.city || undefined,
      });

      updateUserData(updatedUser);
      setErrors({});
      toast.success(t('SETTINGS.PROFILE.PROFILE_UPDATED'));
    } catch (error) {
      const apiErrors = parseApiErrors(error);
      if (Object.keys(apiErrors).length > 0) {
        setErrors(apiErrors);
      }
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage: 'ru' | 'en' | 'tj') => {
    try {
      await usersService.updateLanguage({ language: newLanguage });
      await setLanguage(newLanguage);
      updateUserData({ language: newLanguage });
      toast.success(t('SETTINGS.PROFILE.LANGUAGE_UPDATED'));
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Language update error:', error);
    }
  };

  const handleTimezoneChange = async (newTimezone: string) => {
    setTimezone(newTimezone);

    try {
      await usersService.updateTimezone({ timezone: newTimezone });
      updateUserData({ timezone: newTimezone });
      toast.success(t('SETTINGS.PROFILE.TIMEZONE_UPDATED'));
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Timezone update error:', error);
    }
  };

  const handleCurrencyChange = async (newCurrency: 'USD' | 'RUB' | 'EUR' | 'TJS' | 'UZS' | 'KZT' | 'CAD') => {
    setCurrentCurrency(newCurrency);

    try {
      await usersService.updateCurrency({ currency: newCurrency });
      updateUserData({ currency: newCurrency });
      toast.success(t('SETTINGS.PROFILE.CURRENCY_UPDATED'));
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Currency update error:', error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
            {t('SETTINGS.PROFILE.PERSONAL_INFO')}
          </h3>

          <form onSubmit={handleProfileSubmit}>
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="firstName" className={cn("text-xs sm:text-sm", errors.firstName && "text-destructive")}>
                    {t('SETTINGS.PROFILE.FIRST_NAME')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={cn(
                      "h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm",
                      errors.firstName && "border-destructive ring-destructive/20"
                    )}
                  />
                  {errors.firstName && <p className="text-destructive text-xs">{errors.firstName}</p>}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="lastName" className={cn("text-xs sm:text-sm", errors.lastName && "text-destructive")}>
                    {t('SETTINGS.PROFILE.LAST_NAME')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={cn(
                      "h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm",
                      errors.lastName && "border-destructive ring-destructive/20"
                    )}
                  />
                  {errors.lastName && <p className="text-destructive text-xs">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">
                  {t('SETTINGS.PROFILE.EMAIL')}
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400"
                    strokeWidth={2}
                  />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    className="h-9 sm:h-10 md:h-12 pl-9 sm:pl-11 md:pl-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="phone" className="text-xs sm:text-sm">
                  {t('SETTINGS.PROFILE.PHONE')}
                </Label>
                <div className="relative">
                  <Smartphone
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400"
                    strokeWidth={2}
                  />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="h-9 sm:h-10 md:h-12 pl-9 sm:pl-11 md:pl-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="position" className="text-xs sm:text-sm">
                  {t('SETTINGS.PROFILE.POSITION')}
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            <Separator className="my-4 sm:my-5 md:my-6 bg-gray-200" />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg sm:rounded-xl border-gray-200 hover:bg-gray-50 text-xs sm:text-sm h-8 sm:h-9 md:h-10 order-2 sm:order-1"
                onClick={() => {
                  if (user) {
                    setFormData({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      middleName: user.middleName || '',
                      email: user.email || '',
                      phone: user.phone || '',
                      position: user.position || '',
                      company: user.company || '',
                      address: user.address || '',
                      country: user.country || '',
                      city: user.city || '',
                    });
                  }
                }}
              >
                {t('COMMON.ACTIONS.CANCEL')}
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 md:h-10 order-1 sm:order-2"
                disabled={loading}
              >
                {loading ? t('COMMON.LOADING') : t('SETTINGS.PROFILE.SAVE_CHANGES')}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
            {t('SETTINGS.PROFILE.REGIONAL_SETTINGS')}
          </h3>

          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="language" className="text-xs sm:text-sm">
                {t('SETTINGS.PROFILE.LANGUAGE')}
              </Label>
              <Select
                value={currentLanguage}
                onValueChange={(value) => handleLanguageChange(value as 'ru' | 'en' | 'tj')}
                open={openSelect === 'language'}
                onOpenChange={(open) => setOpenSelect(open ? 'language' : null)}
              >
                <SelectTrigger className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm">
                  <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-400" strokeWidth={2} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">
                    <div className="flex items-center gap-2">
                      <RussiaFlag className="w-5 h-4" />
                      <span>Русский</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <UKFlag className="w-5 h-4" />
                      <span>English</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="tj">
                    <div className="flex items-center gap-2">
                      <TajikistanFlag className="w-5 h-4" />
                      <span>Тоҷикӣ</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="currency" className="text-xs sm:text-sm">
                {t('SETTINGS.PROFILE.CURRENCY')}
              </Label>
              <Select
                value={currentCurrency}
                onValueChange={(value) => handleCurrencyChange(value as 'USD' | 'RUB' | 'EUR' | 'TJS')}
                open={openSelect === 'currency'}
                onOpenChange={(open) => setOpenSelect(open ? 'currency' : null)}
              >
                <SelectTrigger className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm">
                  <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-400" strokeWidth={2} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">🇺🇸 US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">🇪🇺 Euro (€)</SelectItem>
                  <SelectItem value="CAD">🇨🇦 Canadian Dollar (C$)</SelectItem>
                  <SelectItem value="RUB">🇷🇺 Российский рубль (₽)</SelectItem>
                  <SelectItem value="TJS">🇹🇯 Таджикский сомони (сом.)</SelectItem>
                  <SelectItem value="UZS">🇺🇿 Узбекский сум (сўм)</SelectItem>
                  <SelectItem value="KZT">🇰🇿 Казахстанский тенге (₸)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="timezone" className="text-xs sm:text-sm">
                {t('SETTINGS.PROFILE.TIMEZONE')}
              </Label>
              <Select
                value={timezone}
                onValueChange={handleTimezoneChange}
                open={openSelect === 'timezone'}
                onOpenChange={(open) => setOpenSelect(open ? 'timezone' : null)}
              >
                <SelectTrigger className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-400" strokeWidth={2} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                  <SelectItem value="America/Chicago">Chicago (GMT-6)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Los Angeles (GMT-8)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                  <SelectItem value="Europe/Moscow">Moscow (GMT+3)</SelectItem>
                  <SelectItem value="Europe/Samara">Samara (GMT+4)</SelectItem>
                  <SelectItem value="Asia/Yekaterinburg">Yekaterinburg (GMT+5)</SelectItem>
                  <SelectItem value="Asia/Dushanbe">Dushanbe (GMT+5)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
