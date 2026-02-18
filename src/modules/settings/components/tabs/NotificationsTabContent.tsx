import { useEffect, useState } from 'react';
import { Send, CheckCircle, XCircle, Loader2, Bot, Bell, BellOff, BellRing, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { telegramService, type TelegramBotStatusResponse } from '@/app/services/telegram/telegram.service';
import { useNotificationsStore } from '@/app/store/notifications.store';
import { NotificationEventType, EmailNotificationType } from '@/app/types/notifications/notifications.enums';
import { GoogleCalendarSettings } from '@/modules/settings/components/GoogleCalendarSettings';
import { useI18n } from '@/shared/context/I18nContext';
import { usePushNotifications } from '@/shared/hooks/usePushNotifications';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
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

  const {
    isSupported: pushSupported,
    isSubscribed: pushSubscribed,
    permission: pushPermission,
    loading: pushLoading,
    subscribe: pushSubscribe,
    unsubscribe: pushUnsubscribe,
    sendTest: pushSendTest,
  } = usePushNotifications();

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

  const [telegramStatus, setTelegramStatus] = useState<TelegramBotStatusResponse | null>(null);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [pushTestSending, setPushTestSending] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchTelegramStatus();
  }, []);

  const fetchTelegramStatus = async () => {
    setTelegramLoading(true);
    try {
      const status = await telegramService.getBotStatus();
      setTelegramStatus(status);
    } catch {
      setTelegramStatus(null);
    } finally {
      setTelegramLoading(false);
    }
  };

  const handleSendTestMessage = async () => {
    if (!telegramChatId.trim()) {
      toast.error(t('TELEGRAM.CHAT_ID_REQUIRED'));
      return;
    }

    setSendingTest(true);
    try {
      await telegramService.sendTestMessage(telegramChatId.trim());
      toast.success(t('TELEGRAM.TEST_SENT'));
    } catch {
      toast.error(t('TELEGRAM.TEST_FAILED'));
    } finally {
      setSendingTest(false);
    }
  };

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
    } catch {
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
    } catch {
      toast.error(t('NOTIFICATIONS.SETTING_UPDATE_FAILED'));
      setEmailSettings(emailSettings);
    }
  };

  const handlePushToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        await pushSubscribe();
        if (Notification.permission === 'granted') {
          toast.success(t('PUSH.ENABLED'));
        } else if (Notification.permission === 'denied') {
          toast.error(t('PUSH.PERMISSION_DENIED'));
        }
      } else {
        await pushUnsubscribe();
        toast.success(t('PUSH.DISABLED'));
      }
    } catch {
      toast.error(t('PUSH.SUBSCRIBE_ERROR'));
    }
  };

  const handlePushTest = async () => {
    setPushTestSending(true);
    try {
      await pushSendTest();
      toast.success(t('PUSH.TEST_SENT'));
    } catch {
      toast.error(t('PUSH.SUBSCRIBE_ERROR'));
    } finally {
      setPushTestSending(false);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BellRing className="w-5 h-5 text-purple-500" />
              <div>
                <CardTitle>{t('PUSH.SETTINGS')}</CardTitle>
                <CardDescription>
                  {pushSubscribed ? t('PUSH.ENABLED') : t('PUSH.DISABLED')}
                </CardDescription>
              </div>
            </div>
            {pushSubscribed ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Bell className="w-4 h-4" />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BellOff className="w-4 h-4" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!pushSupported ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{t('PUSH.NOT_SUPPORTED')}</span>
            </div>
          ) : (
            <>
              {pushPermission === 'denied' && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{t('PUSH.PERMISSION_DENIED')}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label htmlFor="push-toggle" className="font-medium text-sm">
                  {pushSubscribed ? t('PUSH.DISABLE') : t('PUSH.ENABLE')}
                </label>
                <Switch
                  id="push-toggle"
                  checked={pushSubscribed}
                  onCheckedChange={handlePushToggle}
                  disabled={pushLoading || pushPermission === 'denied'}
                />
              </div>

              {pushSubscribed && (
                <Button
                  onClick={handlePushTest}
                  disabled={pushTestSending}
                  variant="outline"
                  className="w-full"
                >
                  {pushTestSending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {t('PUSH.TEST')}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>{t('NOTIFICATIONS.EMAIL_TITLE')}</CardTitle>
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-blue-500" />
              <div>
                <CardTitle>{t('TELEGRAM.TITLE')}</CardTitle>
                <CardDescription>{t('TELEGRAM.DESCRIPTION')}</CardDescription>
              </div>
            </div>
            {telegramLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : telegramStatus?.enabled ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>{t('TELEGRAM.BOT_ACTIVE')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <XCircle className="w-4 h-4" />
                <span>{t('TELEGRAM.BOT_INACTIVE')}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {telegramStatus?.enabled ? (
            <>
              {telegramStatus.botUsername && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <span>{t('TELEGRAM.BOT_NAME')}:</span>
                  <a
                    href={`https://t.me/${telegramStatus.botUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline font-medium"
                  >
                    @{telegramStatus.botUsername}
                  </a>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="telegram-chat-id">{t('TELEGRAM.CHAT_ID_LABEL')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="telegram-chat-id"
                    type="text"
                    placeholder={t('TELEGRAM.CHAT_ID_PLACEHOLDER')}
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendTestMessage}
                    disabled={sendingTest || !telegramChatId.trim()}
                    variant="outline"
                  >
                    {sendingTest ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="ml-2">{t('TELEGRAM.SEND_TEST')}</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('TELEGRAM.CHAT_ID_HINT')}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>{t('TELEGRAM.NOT_CONFIGURED')}</p>
              <p className="text-xs mt-1">{t('TELEGRAM.CONTACT_ADMIN')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <GoogleCalendarSettings />
    </div>
  );
}
