import { CaseItem } from '../ui/CaseItem';

export const PriorityCases = () => {
  const cases = [
    {
      title: 'Corporate Merger Review',
      client: 'Tech Corp Inc.',
      priority: 'high' as const,
      deadline: '2025-10-20',
    },
    {
      title: 'Contract Dispute',
      client: 'Smith & Associates',
      priority: 'medium' as const,
      deadline: '2025-10-25',
    },
    {
      title: 'Trademark Registration',
      client: 'Brand Ltd.',
      priority: 'low' as const,
      deadline: '2025-11-05',
    },
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Priority Cases</h3>
      </div>
      <div>
        {cases.map((caseItem, index) => (
          <CaseItem key={index} {...caseItem} />
        ))}
      </div>
    </div>
  );
};
