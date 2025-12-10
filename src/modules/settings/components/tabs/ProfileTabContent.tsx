import { useState } from 'react';
import { Clock, Globe, Mail, Smartphone } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';

export function ProfileTabContent() {
  const { t } = useI18n();
  const [openSelect, setOpenSelect] = useState<'language' | 'timezone' | null>(null);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile saved');
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
                  <Label htmlFor="firstName" className="text-xs sm:text-sm">
                    {t('SETTINGS.PROFILE.FIRST_NAME')}
                  </Label>
                  <Input
                    id="firstName"
                    defaultValue="Александр"
                    className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="lastName" className="text-xs sm:text-sm">
                    {t('SETTINGS.PROFILE.LAST_NAME')}
                  </Label>
                  <Input
                    id="lastName"
                    defaultValue="Иванов"
                    className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm"
                  />
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
                    defaultValue="aleksandr.ivanov@lexflow.ru"
                    className="h-9 sm:h-10 md:h-12 pl-9 sm:pl-11 md:pl-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm"
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
                    defaultValue="+7 (999) 123-45-67"
                    className="h-9 sm:h-10 md:h-12 pl-9 sm:pl-11 md:pl-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="position" className="text-xs sm:text-sm">
                  {t('SETTINGS.PROFILE.POSITION')}
                </Label>
                <Input
                  id="position"
                  defaultValue="Старший юрист"
                  className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm"
                />
              </div>
            </div>

            <Separator className="my-4 sm:my-5 md:my-6 bg-gray-200" />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg sm:rounded-xl border-gray-200 hover:bg-gray-50 text-xs sm:text-sm h-8 sm:h-9 md:h-10 order-2 sm:order-1"
              >
                {t('COMMON.ACTIONS.CANCEL')}
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 md:h-10 order-1 sm:order-2"
              >
                {t('SETTINGS.PROFILE.SAVE_CHANGES')}
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
                defaultValue="ru"
                open={openSelect === 'language'}
                onOpenChange={(open) => setOpenSelect(open ? 'language' : null)}
              >
                <SelectTrigger className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm">
                  <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-400" strokeWidth={2} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="timezone" className="text-xs sm:text-sm">
                {t('SETTINGS.PROFILE.TIMEZONE')}
              </Label>
              <Select
                defaultValue="msk"
                open={openSelect === 'timezone'}
                onOpenChange={(open) => setOpenSelect(open ? 'timezone' : null)}
              >
                <SelectTrigger className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-400" strokeWidth={2} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="msk">Москва (GMT+3)</SelectItem>
                  <SelectItem value="spb">Санкт-Петербург (GMT+3)</SelectItem>
                  <SelectItem value="ekb">Екатеринбург (GMT+5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
