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
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
        <div className="p-6">
          <h3 className="text-xl tracking-tight mb-6">Изменить пароль</h3>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <Input
                id="currentPassword"
                type="password"
                className="h-12 rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                type="password"
                className="h-12 rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                className="h-12 rounded-xl border-gray-200"
              />
            </div>

            <Separator className="my-6 bg-gray-200" />

            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
              <Lock className="w-4 h-4 mr-2" strokeWidth={2} />
              Обновить пароль
            </Button>
          </form>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
        <div className="p-6">
          <h3 className="text-xl tracking-tight mb-6">Двухфакторная аутентификация</h3>

          <div className="flex items-start justify-between p-4 rounded-xl bg-green-50 border border-green-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-green-600" strokeWidth={2} />
              </div>
              <div>
                <h4 className="tracking-tight text-green-900 mb-1">2FA активирована</h4>
                <p className="text-sm text-green-700">Ваш аккаунт защищен двухфакторной аутентификацией</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleToggle2FA}
              className="rounded-xl border-green-200 hover:bg-green-100"
            >
              Отключить
            </Button>
          </div>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
        <div className="p-6">
          <h3 className="text-xl tracking-tight mb-4">Активные сессии</h3>
          <p className="text-gray-500 mb-6">Это устройства, на которых выполнен вход в ваш аккаунт</p>

          <div className="space-y-3">
            {ACTIVE_SESSIONS.map((session, index) => (
              <SessionItem
                key={index}
                session={session}
                onTerminate={() => handleTerminateSession(session.device)}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
