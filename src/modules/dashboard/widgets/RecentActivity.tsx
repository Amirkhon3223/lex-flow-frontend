import { ActivityItem } from '../ui/ActivityItem';

export const RecentActivity = () => {
  const activities = [
    {
      action: 'created a new case',
      user: 'John Doe',
      time: '5 minutes ago',
      type: 'case' as const,
    },
    {
      action: 'uploaded a document',
      user: 'Jane Smith',
      time: '15 minutes ago',
      type: 'document' as const,
    },
    {
      action: 'added a new client',
      user: 'Mike Johnson',
      time: '1 hour ago',
      type: 'client' as const,
    },
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Recent Activity</h3>
      </div>
      <div>
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </div>
  );
};
