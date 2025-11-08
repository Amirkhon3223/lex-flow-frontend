import { ActivityTypeEnum } from '@/app/types/dashboard/dashboard.enums';

interface ActivityItemProps {
  action: string;
  user: string;
  time: string;
  type: ActivityTypeEnum;
}

export const ActivityItem = ({ action, user, time, type }: ActivityItemProps) => {
  const typeIcons = {
    [ActivityTypeEnum.CASE]: '⚖️',
    [ActivityTypeEnum.DOCUMENT]: '📄',
    [ActivityTypeEnum.CLIENT]: '👤',
  };

  return (
    <div style={{
      padding: '12px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      gap: '12px',
    }}>
      <span style={{ fontSize: '24px' }}>{typeIcons[type]}</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          <strong>{user}</strong> {action}
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#999' }}>{time}</p>
      </div>
    </div>
  );
};
