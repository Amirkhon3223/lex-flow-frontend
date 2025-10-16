interface StatCardProps {
  title: string;
  value: number;
  icon?: string;
  trend?: number;
}

export const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>{title}</p>
          <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{value}</h3>
        </div>
        {icon && <span style={{ fontSize: '32px' }}>{icon}</span>}
      </div>
      {trend !== undefined && (
        <p style={{
          marginTop: '12px',
          fontSize: '12px',
          color: trend >= 0 ? '#10b981' : '#ef4444',
        }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </p>
      )}
    </div>
  );
};
