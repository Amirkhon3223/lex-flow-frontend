import { StatCard } from '../ui/StatCard';

export const StatsCards = () => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    }}>
      <StatCard title="Total Clients" value={150} icon="👥" trend={12} />
      <StatCard title="Active Cases" value={45} icon="⚖️" trend={-3} />
      <StatCard title="Documents" value={320} icon="📄" trend={8} />
      <StatCard title="This Month Revenue" value={85000} icon="💰" trend={15} />
    </div>
  );
};
