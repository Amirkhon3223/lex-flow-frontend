import { Lock, Shield } from 'lucide-react';
import type { SessionInterface } from '@/app/types/settings/settings.interfaces';
import { SessionItem } from '@/modules/settings/components/SessionItem';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Separator } from '@/shared/ui/separator';

const ACTIVE_SESSIONS: SessionInterface[] = [
  { device: 'MacBook Pro', location: 'Москва, Россия', current: true, time: 'Сейчас' },
  { device: 'iPhone 14', location: 'Москва, Россия', current: false, time: '2 часа назад' },
];

export function SecurityTabContent() {
  const { t } = useI18n();

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Обновить пароль');
  };

  const handleToggle2FA = () => {
    console.log('Отключить 2FA');
  };

  const handleTerminateSession = (device: string) => {
    console.log('Завершить сессию:', device);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Change Password */}
      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">{t('SETTINGS.SECURITY.CHANGE_PASSWORD')}</h3>

          <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="currentPassword" className="text-xs sm:text-sm">
                {t('SETTINGS.SECURITY.CURRENT_PASSWORD')}
              </Label>
              <Input
                id="currentPassword"
                type="password"
                className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="newPassword" className="text-xs sm:text-sm">
                {t('SETTINGS.SECURITY.NEW_PASSWORD')}
              </Label>
              <Input
                id="newPassword"
                type="password"
                className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">
                {t('SETTINGS.SECURITY.CONFIRM_PASSWORD')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm"
              />
            </div>

            <Separator className="my-4 sm:my-5 md:my-6 bg-gray-200" />

            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 md:h-10"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={2} />
              {t('SETTINGS.SECURITY.UPDATE_PASSWORD')}
            </Button>
          </form>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
            {t('SETTINGS.SECURITY.TWO_FACTOR')}
          </h3>

          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-green-50 border border-green-100">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-green-600" strokeWidth={2} />
              </div>
              <div>
                <h4 className="tracking-tight text-green-900 mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">
                  {t('SETTINGS.SECURITY.TWO_FACTOR_ACTIVE')}
                </h4>
                <p className="text-xs sm:text-sm text-green-700">
                  {t('SETTINGS.SECURITY.TWO_FACTOR_PROTECTED')}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleToggle2FA}
              className="rounded-lg sm:rounded-xl border-green-200 hover:bg-green-100 text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
            >
              {t('SETTINGS.SECURITY.DISABLE')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-2 sm:mb-3 md:mb-4">{t('SETTINGS.SECURITY.SESSIONS')}</h3>
          <p className="text-gray-500 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm">
            {t('SETTINGS.SECURITY.SESSIONS_DESCRIPTION')}
          </p>

          <div className="space-y-2 sm:space-y-3">
            {ACTIVE_SESSIONS.map((session, index) => (
              <SessionItem key={index} session={session} onTerminate={() => handleTerminateSession(session.device)} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
