import { useEffect, useState } from 'react';
import { Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { securityService } from '@/app/services/security/security.service';
import type { Session } from '@/app/types/security/security.interfaces';
import { SessionItem } from '@/modules/settings/components/SessionItem';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Separator } from '@/shared/ui/separator';

export function SecurityTabContent() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Load 2FA status and sessions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [twoFactorStatus, sessionsData] = await Promise.all([
          securityService.get2FAStatus(),
          securityService.getSessions(),
        ]);
        setTwoFactorEnabled(twoFactorStatus.enabled);
        setSessions(sessionsData.sessions);
      } catch (error) {
        console.error('Failed to fetch security data:', error);
      }
    };
    fetchData();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t('SETTINGS.SECURITY.PASSWORD_MISMATCH'));
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error(t('SETTINGS.SECURITY.PASSWORD_TOO_SHORT'));
      return;
    }

    setLoading(true);
    try {
      await securityService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      toast.success(t('SETTINGS.SECURITY.PASSWORD_UPDATED'));
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setLoading(true);
    try {
      if (twoFactorEnabled) {
        // TODO: Implement proper 2FA disable with password and code verification
        await securityService.disable2FA({ password: '', code: '' });
        setTwoFactorEnabled(false);
        toast.success(t('SETTINGS.SECURITY.TWO_FACTOR_DISABLED'));
      }
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('2FA toggle error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    setLoading(true);
    try {
      await securityService.terminateSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success(t('SETTINGS.SECURITY.SESSION_TERMINATED'));
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Session termination error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
            {t('SETTINGS.SECURITY.CHANGE_PASSWORD')}
          </h3>

          <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="currentPassword" className="text-xs sm:text-sm">
                {t('SETTINGS.SECURITY.CURRENT_PASSWORD')}
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-input text-xs sm:text-sm"
                required
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="newPassword" className="text-xs sm:text-sm">
                {t('SETTINGS.SECURITY.NEW_PASSWORD')}
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-input text-xs sm:text-sm"
                required
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">
                {t('SETTINGS.SECURITY.CONFIRM_PASSWORD')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                className="h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-input text-xs sm:text-sm"
                required
              />
            </div>

            <Separator className="my-4 sm:my-5 md:my-6 bg-border" />

            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 md:h-10"
              disabled={loading}
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={2} />
              {loading ? t('COMMON.LOADING') : t('SETTINGS.SECURITY.UPDATE_PASSWORD')}
            </Button>
          </form>
        </div>
      </Card>

      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
            {t('SETTINGS.SECURITY.TWO_FACTOR_AUTH')}
          </h3>

          {twoFactorEnabled ? (
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-green-600 dark:text-green-400"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <h4 className="tracking-tight text-green-900 dark:text-green-300 mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">
                    {t('SETTINGS.SECURITY.TWO_FACTOR_ENABLED')}
                  </h4>
                  <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">
                    {t('SETTINGS.SECURITY.TWO_FACTOR_DESC')}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleToggle2FA}
                className="rounded-lg sm:rounded-xl border-green-500/30 hover:bg-green-500/20 text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
                disabled={loading}
              >
                {t('SETTINGS.SECURITY.DISABLE')}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Shield
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gray-600 dark:text-gray-400"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <h4 className="tracking-tight text-gray-900 dark:text-gray-300 mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">
                    {t('SETTINGS.SECURITY.TWO_FACTOR_DISABLED')}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">
                    {t('SETTINGS.SECURITY.TWO_FACTOR_DESC')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-2 sm:mb-3 md:mb-4">
            {t('SETTINGS.SECURITY.ACTIVE_SESSIONS')}
          </h3>
          <p className="text-muted-foreground mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm">
            {t('SETTINGS.SECURITY.ACTIVE_SESSIONS_DESC')}
          </p>

          <div className="space-y-2 sm:space-y-3">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={{
                    device: `${session.device} - ${session.browser}`,
                    location: `${session.location} • ${session.ip}`,
                    current: session.current,
                    time: new Date(session.lastActivityAt).toLocaleString(),
                  }}
                  onTerminate={() => handleTerminateSession(session.id)}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t('SETTINGS.SECURITY.NO_SESSIONS')}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
