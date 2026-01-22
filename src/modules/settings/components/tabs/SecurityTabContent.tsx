import { useEffect, useState } from 'react';
import { Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { securityService } from '@/app/services/security/security.service';
import type { Session } from '@/app/types/security/security.interfaces';
import { BackupCodesDialog } from '@/modules/settings/components/dialogs/BackupCodesDialog';
import { Disable2FADialog } from '@/modules/settings/components/dialogs/Disable2FADialog';
import { Enable2FADialog } from '@/modules/settings/components/dialogs/Enable2FADialog';
import { SessionItem } from '@/modules/settings/components/SessionItem';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Separator } from '@/shared/ui/separator';
import { cn } from '@/shared/ui/utils';
import { validators, parseApiErrors, type FormErrors } from '@/shared/utils';

export function SecurityTabContent() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<FormErrors>({});
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [enable2FAOpen, setEnable2FAOpen] = useState(false);
  const [disable2FAOpen, setDisable2FAOpen] = useState(false);
  const [backupCodesOpen, setBackupCodesOpen] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

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

  const handlePasswordFieldChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: FormErrors = {};

    const currentPasswordError = validators.required(passwordForm.currentPassword, t('SETTINGS.SECURITY.CURRENT_PASSWORD'));
    if (currentPasswordError) newErrors.currentPassword = currentPasswordError;

    const newPasswordError = validators.required(passwordForm.newPassword, t('SETTINGS.SECURITY.NEW_PASSWORD')) ||
      validators.password(passwordForm.newPassword);
    if (newPasswordError) newErrors.newPassword = newPasswordError;

    const confirmPasswordError = validators.required(passwordForm.confirmPassword, t('SETTINGS.SECURITY.CONFIRM_PASSWORD'));
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    if (passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = t('SETTINGS.SECURITY.PASSWORD_MISMATCH');
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      toast.error(t('COMMON.ERRORS.VALIDATION'));
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
      setPasswordErrors({});
    } catch (error) {
      const apiErrors = parseApiErrors(error);
      if (Object.keys(apiErrors).length > 0) {
        setPasswordErrors(apiErrors);
      }
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FASuccess = (codes: string[]) => {
    setBackupCodes(codes);
    setTwoFactorEnabled(true);
    setBackupCodesOpen(true);
  };

  const handleDisable2FASuccess = () => {
    setTwoFactorEnabled(false);
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
              <Label htmlFor="currentPassword" className={cn("text-xs sm:text-sm", passwordErrors.currentPassword && "text-destructive")}>
                {t('SETTINGS.SECURITY.CURRENT_PASSWORD')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordFieldChange('currentPassword', e.target.value)}
                className={cn(
                  "h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-input text-xs sm:text-sm",
                  passwordErrors.currentPassword && "border-destructive ring-destructive/20"
                )}
              />
              {passwordErrors.currentPassword && <p className="text-destructive text-xs">{passwordErrors.currentPassword}</p>}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="newPassword" className={cn("text-xs sm:text-sm", passwordErrors.newPassword && "text-destructive")}>
                {t('SETTINGS.SECURITY.NEW_PASSWORD')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordFieldChange('newPassword', e.target.value)}
                className={cn(
                  "h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-input text-xs sm:text-sm",
                  passwordErrors.newPassword && "border-destructive ring-destructive/20"
                )}
              />
              {passwordErrors.newPassword && <p className="text-destructive text-xs">{passwordErrors.newPassword}</p>}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="confirmPassword" className={cn("text-xs sm:text-sm", passwordErrors.confirmPassword && "text-destructive")}>
                {t('SETTINGS.SECURITY.CONFIRM_PASSWORD')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordFieldChange('confirmPassword', e.target.value)}
                className={cn(
                  "h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-input text-xs sm:text-sm",
                  passwordErrors.confirmPassword && "border-destructive ring-destructive/20"
                )}
              />
              {passwordErrors.confirmPassword && <p className="text-destructive text-xs">{passwordErrors.confirmPassword}</p>}
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
                onClick={() => setDisable2FAOpen(true)}
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
              <Button
                onClick={() => setEnable2FAOpen(true)}
                className="rounded-lg sm:rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
                disabled={loading}
              >
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={2} />
                {t('SETTINGS.SECURITY.ENABLE')}
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div>
          <div className="flex items-center space-x-3 mb-2 sm:mb-3 md:mb-4">
            <h3 className="text-base sm:text-lg md:text-xl tracking-tight">
              {t('SETTINGS.SECURITY.ACTIVE_SESSIONS')}
            </h3>
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-0.5">
              {t('COMMON.IN_DEVELOPMENT')}
            </Badge>
          </div>
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

      <Enable2FADialog
        open={enable2FAOpen}
        onOpenChange={setEnable2FAOpen}
        onSuccess={handleEnable2FASuccess}
      />

      <BackupCodesDialog
        open={backupCodesOpen}
        onOpenChange={setBackupCodesOpen}
        backupCodes={backupCodes}
      />

      <Disable2FADialog
        open={disable2FAOpen}
        onOpenChange={setDisable2FAOpen}
        onSuccess={handleDisable2FASuccess}
      />
    </div>
  );
}
