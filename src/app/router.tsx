import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './config/routes.config';
import { AuthGuard } from './guards/auth.guard';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../modules/dashboard';
import { ClientsPage } from '../modules/clients';
import { CasesPage } from '../modules/cases';
import { DocumentsPage } from '../modules/documents';
import { CalendarPage } from '../modules/calendar';
import { ReportsPage } from '../modules/reports';
import { NotificationsPage } from '../modules/notifications';
import { SettingsPage } from '../modules/settings';

export const router = createBrowserRouter([
  {
    path: ROUTES.AUTH.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <AuthGuard>
        <DashboardPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.CLIENTS.BASE,
    element: (
      <AuthGuard>
        <ClientsPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.CASES.BASE,
    element: (
      <AuthGuard>
        <CasesPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.DOCUMENTS.BASE,
    element: (
      <AuthGuard>
        <DocumentsPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.CALENDAR,
    element: (
      <AuthGuard>
        <CalendarPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.REPORTS,
    element: (
      <AuthGuard>
        <ReportsPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: (
      <AuthGuard>
        <NotificationsPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <AuthGuard>
        <SettingsPage />
      </AuthGuard>
    ),
  },
]);
