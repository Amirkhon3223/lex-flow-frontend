import type { NotificationToggleItemProps } from '@/app/types/settings/settings.interfaces';
import { Switch } from '@/shared/ui/switch';

export function NotificationToggleItem({ setting, onToggle }: NotificationToggleItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
      <div>
        <h4 className="tracking-tight mb-1">{setting.label}</h4>
        <p className="text-sm text-gray-500">{setting.description}</p>
      </div>
      <Switch defaultChecked={setting.checked} onCheckedChange={onToggle} />
    </div>
  );
}
