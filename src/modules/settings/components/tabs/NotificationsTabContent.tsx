import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';
import { Switch } from '@/shared/ui/switch';

export function NotificationsTabContent() {
  const { t } = useI18n();

  const emailNotifications = [
    {
      labelKey: 'SETTINGS.NOTIFICATIONS.EMAIL.NEW_CASES_LABEL',
      descKey: 'SETTINGS.NOTIFICATIONS.EMAIL.NEW_CASES_DESC',
      checked: true,
    },
    {
      labelKey: 'SETTINGS.NOTIFICATIONS.EMAIL.DEADLINES_LABEL',
      descKey: 'SETTINGS.NOTIFICATIONS.EMAIL.DEADLINES_DESC',
      checked: true,
    },
    {
      labelKey: 'SETTINGS.NOTIFICATIONS.EMAIL.DOCUMENTS_LABEL',
      descKey: 'SETTINGS.NOTIFICATIONS.EMAIL.DOCUMENTS_DESC',
      checked: true,
    },
    {
      labelKey: 'SETTINGS.NOTIFICATIONS.EMAIL.COMMENTS_LABEL',
      descKey: 'SETTINGS.NOTIFICATIONS.EMAIL.COMMENTS_DESC',
      checked: false,
    },
    {
      labelKey: 'SETTINGS.NOTIFICATIONS.EMAIL.WEEKLY_REPORT_LABEL',
      descKey: 'SETTINGS.NOTIFICATIONS.EMAIL.WEEKLY_REPORT_DESC',
      checked: true,
    },
    {
      labelKey: 'SETTINGS.NOTIFICATIONS.EMAIL.EMAIL_ALERTS_LABEL',
      descKey: 'SETTINGS.NOTIFICATIONS.EMAIL.EMAIL_ALERTS_DESC',
      checked: true,
    },
  ];

  const pushNotifications = [
    {
      labelKey: 'SETTINGS.NOTIFICATIONS.PUSH.URGENT_LABEL',
      descKey: 'SETTINGS.NOTIFICATIONS.PUSH.URGENT_DESC',
      checked: true,
    },
    {
      labelKey: 'SETTINGS.NOTIFICATIONS.PUSH.MEETINGS_LABEL',
      descKey: 'SETTINGS.NOTIFICATIONS.PUSH.MEETINGS_DESC',
      checked: true,
    },
    {
      labelKey: 'SETTINGS.NOTIFICATIONS.PUSH.MESSAGES_LABEL',
      descKey: 'SETTINGS.NOTIFICATIONS.PUSH.MESSAGES_DESC',
      checked: false,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
            {t('SETTINGS.NOTIFICATIONS.EMAIL.TITLE')}
          </h3>

          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {emailNotifications.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-muted/50"
              >
                <div className="min-w-0">
                  <h4 className="tracking-tight mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">
                    {t(item.labelKey)}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {t(item.descKey)}
                  </p>
                </div>
                <Switch defaultChecked={item.checked} className="flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
            {t('SETTINGS.NOTIFICATIONS.PUSH.TITLE')}
          </h3>

          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {pushNotifications.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-muted/50"
              >
                <div className="min-w-0">
                  <h4 className="tracking-tight mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">
                    {t(item.labelKey)}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {t(item.descKey)}
                  </p>
                </div>
                <Switch defaultChecked={item.checked} className="flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
