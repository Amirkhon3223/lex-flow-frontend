import { Lock, Shield } from 'lucide-react';
import type { SessionInterface } from '@/app/types/settings/settings.interfaces';
import { SessionItem } from '@/modules/settings/components/SessionItem';
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
      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">Изменить пароль</h3>

          <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="currentPassword" className="text-xs sm:text-sm">
                Текущий пароль
              </Label>
              <Input
                id="currentPassword"
                type="password"
                className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-input text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="newPassword" className="text-xs sm:text-sm">
                Новый пароль
              </Label>
              <Input
                id="newPassword"
                type="password"
                className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-input text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">
                Подтвердите пароль
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-input text-xs sm:text-sm"
              />
            </div>

            <Separator className="my-4 sm:my-5 md:my-6 bg-border" />

            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 md:h-10"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={2} />
              Обновить пароль
            </Button>
          </form>
        </div>
      </Card>

      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
            Двухфакторная аутентификация
          </h3>

          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-green-600 dark:text-green-400" strokeWidth={2} />
              </div>
              <div>
                <h4 className="tracking-tight text-green-900 dark:text-green-300 mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">
                  2FA активирована
                </h4>
                <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">
                  Ваш аккаунт защищен двухфакторной аутентификацией
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleToggle2FA}
              className="rounded-lg sm:rounded-xl border-green-500/30 hover:bg-green-500/20 text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
            >
              Отключить
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-2 sm:mb-3 md:mb-4">Активные сессии</h3>
          <p className="text-muted-foreground mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm">
            Это устройства, на которых выполнен вход в ваш аккаунт
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
