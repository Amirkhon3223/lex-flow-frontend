interface CaseItemProps {
  title: string;
  client: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
}

export const CaseItem = ({ title, client, priority, deadline }: CaseItemProps) => {
  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  };

  return (
    <div style={{
      padding: '12px',
      borderBottom: '1px solid #e5e7eb',
      cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{title}</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>{client}</p>
        </div>
        <span style={{
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '500',
          backgroundColor: priorityColors[priority] + '20',
          color: priorityColors[priority],
        }}>
          {priority}
        </span>
      </div>
      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
        Deadline: {deadline}
      </p>
    </div>
  );
};
