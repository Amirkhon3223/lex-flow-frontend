import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/config/routes.config';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: '250px',
        background: '#1a1a1a',
        color: '#fff',
        padding: '20px',
      }}>
        <h2 style={{ marginBottom: '30px' }}>LexFlow</h2>
        <nav>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to={ROUTES.DASHBOARD} style={{ color: '#fff', textDecoration: 'none' }}>
                Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to={ROUTES.CLIENTS.BASE} style={{ color: '#fff', textDecoration: 'none' }}>
                Clients
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to={ROUTES.CASES.BASE} style={{ color: '#fff', textDecoration: 'none' }}>
                Cases
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to={ROUTES.DOCUMENTS.BASE} style={{ color: '#fff', textDecoration: 'none' }}>
                Documents
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to={ROUTES.CALENDAR} style={{ color: '#fff', textDecoration: 'none' }}>
                Calendar
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to={ROUTES.REPORTS} style={{ color: '#fff', textDecoration: 'none' }}>
                Reports
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to={ROUTES.NOTIFICATIONS} style={{ color: '#fff', textDecoration: 'none' }}>
                Notifications
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to={ROUTES.SETTINGS} style={{ color: '#fff', textDecoration: 'none' }}>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '30px', background: '#f5f5f5' }}>
        {children}
      </main>
    </div>
  );
};
