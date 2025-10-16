import { StatsCards } from './widgets/StatsCards';
import { PriorityCases } from './widgets/PriorityCases';
import { RecentActivity } from './widgets/RecentActivity';

export const DashboardPage = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: 'bold' }}>Dashboard</h1>

      <StatsCards />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
      }}>
        <PriorityCases />
        <RecentActivity />
      </div>
    </div>
  );
};
