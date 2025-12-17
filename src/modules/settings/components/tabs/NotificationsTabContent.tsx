import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNotificationsStore } from '@/app/store/notifications.store';
import { NotificationEventType } from '@/app/types/notifications/notifications.enums';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Switch } from '@/shared/ui/switch';

const notificationTypeLabels: Record<NotificationEventType, string> = {
  [NotificationEventType.CASE_DEADLINE]: 'Case Deadline Reminder',
  [NotificationEventType.TASK_DEADLINE]: 'Task Deadline Reminder',
  [NotificationEventType.COURT_DATE]: 'Court Date Reminder',
  [NotificationEventType.NEW_COMMENT]: 'New Comment',
  [NotificationEventType.CASE_UPDATE]: 'Case Update',
  [NotificationEventType.NEW_DOCUMENT]: 'New Document',
  [NotificationEventType.NEW_MEETING]: 'New Meeting',
  [NotificationEventType.MEETING_UPDATE]: 'Meeting Update',
  [NotificationEventType.STATUS_UPDATE]: 'Status Update',
  [NotificationEventType.NEW_TASK]: 'New Task',
  [NotificationEventType.TASK_UPDATE]: 'Task Update',
  [NotificationEventType.TIMELINE_UPDATE]: 'Timeline Update',
};

export function NotificationsTabContent() {
  const {
    settings: initialSettings,
    loading,
    fetchSettings,
    updateSettings,
  } = useNotificationsStore();
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch once on mount

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await updateSettings(settings);
      toast.success('Notification settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.values(NotificationEventType).map((type) => (
          <div key={type} className="flex items-center justify-between">
            <label htmlFor={type} className="font-medium">
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
        <Button onClick={handleSaveChanges} disabled={loading} className="mt-4">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}
