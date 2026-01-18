import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNotificationsStore } from '@/app/store/notifications.store';
import { NotificationEventType, EmailNotificationType } from '@/app/types/notifications/notifications.enums';
import { useI18n } from '@/shared/context/I18nContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Switch } from '@/shared/ui/switch';

export function NotificationsTabContent() {
  const { t } = useI18n();
  const {
    settings: initialSettings,
    emailSettings: initialEmailSettings,
    loading,
    fetchSettings,
    updateSettings,
  } = useNotificationsStore();

  const notificationTypeLabels: Record<NotificationEventType, string> = {
    [NotificationEventType.CASE_DEADLINE]: t('NOTIFICATIONS.TYPES.CASE_DEADLINE'),
    [NotificationEventType.TASK_DEADLINE]: t('NOTIFICATIONS.TYPES.TASK_DEADLINE'),
    [NotificationEventType.COURT_DATE]: t('NOTIFICATIONS.TYPES.COURT_DATE'),
    [NotificationEventType.NEW_COMMENT]: t('NOTIFICATIONS.TYPES.NEW_COMMENT'),
    [NotificationEventType.CASE_UPDATE]: t('NOTIFICATIONS.TYPES.CASE_UPDATE'),
    [NotificationEventType.NEW_DOCUMENT]: t('NOTIFICATIONS.TYPES.NEW_DOCUMENT'),
    [NotificationEventType.NEW_MEETING]: t('NOTIFICATIONS.TYPES.NEW_MEETING'),
    [NotificationEventType.MEETING_UPDATE]: t('NOTIFICATIONS.TYPES.MEETING_UPDATE'),
    [NotificationEventType.STATUS_UPDATE]: t('NOTIFICATIONS.TYPES.STATUS_UPDATE'),
    [NotificationEventType.NEW_TASK]: t('NOTIFICATIONS.TYPES.NEW_TASK'),
    [NotificationEventType.TASK_UPDATE]: t('NOTIFICATIONS.TYPES.TASK_UPDATE'),
    [NotificationEventType.TIMELINE_UPDATE]: t('NOTIFICATIONS.TYPES.TIMELINE_UPDATE'),
  };

  const emailNotificationTypeLabels: Record<EmailNotificationType, string> = {
    [EmailNotificationType.WELCOME]: t('NOTIFICATIONS.EMAIL_TYPES.WELCOME'),
    [EmailNotificationType.MEETING_REMINDER]: t('NOTIFICATIONS.EMAIL_TYPES.MEETING_REMINDER'),
    [EmailNotificationType.TASK_DEADLINE]: t('NOTIFICATIONS.EMAIL_TYPES.TASK_DEADLINE'),
    [EmailNotificationType.PASSWORD_RESET]: t('NOTIFICATIONS.EMAIL_TYPES.PASSWORD_RESET'),
  };

  const [settings, setSettings] = useState(initialSettings);
  const [emailSettings, setEmailSettings] = useState(initialEmailSettings);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    setSettings(initialSettings);
    setEmailSettings(initialEmailSettings);
  }, [initialSettings, initialEmailSettings]);

  const handleSettingChange = async (key: string, value: boolean) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);

    try {
      await updateSettings(updatedSettings, emailSettings);
      toast.success(t('NOTIFICATIONS.SETTING_UPDATED'));
    } catch (error) {
      toast.error(t('NOTIFICATIONS.SETTING_UPDATE_FAILED'));
      setSettings(settings);
    }
  };

  const handleEmailSettingChange = async (key: string, value: boolean) => {
    const updatedEmailSettings = { ...emailSettings, [key]: value };
    setEmailSettings(updatedEmailSettings);

    try {
      await updateSettings(settings, updatedEmailSettings);
      toast.success(t('NOTIFICATIONS.SETTING_UPDATED'));
    } catch (error) {
      toast.error(t('NOTIFICATIONS.SETTING_UPDATE_FAILED'));
      setEmailSettings(emailSettings);
    }
  };

  return (
    <div className="space-y-6">
      {}
      <Card>
        <CardHeader>
          <CardTitle>{t('NOTIFICATIONS.IN_APP_TITLE')}</CardTitle>
          <CardDescription>{t('NOTIFICATIONS.IN_APP_DESCRIPTION')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.values(NotificationEventType).map((type) => (
            <div key={type} className="flex items-center justify-between">
              <label htmlFor={type} className="font-medium text-sm">
                {notificationTypeLabels[type]}
              </label>
              <Switch
                id={type}
                checked={settings[type] ?? false}
                onCheckedChange={(value) => handleSettingChange(type, value)}
                disabled={loading}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>📧 {t('NOTIFICATIONS.EMAIL_TITLE')}</CardTitle>
          <CardDescription>{t('NOTIFICATIONS.EMAIL_DESCRIPTION')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.values(EmailNotificationType).map((type) => (
            <div key={type} className="flex items-center justify-between">
              <label htmlFor={`email-${type}`} className="font-medium text-sm">
                {emailNotificationTypeLabels[type]}
              </label>
              <Switch
                id={`email-${type}`}
                checked={emailSettings[type] ?? true}
                onCheckedChange={(value) => handleEmailSettingChange(type, value)}
                disabled={loading}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
