import { createBrowserRouter } from 'react-router-dom';
import { MeetingDetailPage } from '@/modules/calendar/pages/MeetingDetailPage';
import ClientDetailPage from '@/modules/clients/pages/ClientDetailPage';
import AiAssistantPage from '@/pages/AiAssistantPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import AuthPage from '@/pages/AuthPage.tsx';
import CalendarPage from '@/pages/CalendarPage';
import CaseDetailPage from '@/pages/CaseDetailPage';
import CasesPage from '@/pages/CasesPage';
import ClientsPage from '@/pages/ClientsPage';
import DashboardPage from '@/pages/DashboardPage';
import DocumentComparePage from '@/pages/DocumentComparePage';
import DocumentsPage from '@/pages/DocumentsPage';
import DocumentVersionsPage from '@/pages/DocumentVersionsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SettingsPage from '@/pages/SettingsPage';
import UserProfilePage from '@/pages/UserProfilePage';
import { Layout } from '@/shared/components/Layout';
import { ROUTES } from './config/routes.config';
import { AuthGuard } from './guards/auth.guard';

export const router = createBrowserRouter([
  // Публичные маршруты
  {
    path: ROUTES.AUTH.LOGIN,
    element: <AuthPage />,
  },
  // Защищенные маршруты с Layout
  {
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.CLIENTS.BASE,
        element: <ClientsPage />,
      },
      {
        path: '/clients/:id',
        element: <ClientDetailPage />,
      },
      {
        path: ROUTES.CASES.BASE,
        element: <CasesPage />,
      },
      {
        path: '/cases/:id',
        element: <CaseDetailPage />,
      },
      {
        path: ROUTES.DOCUMENTS.BASE,
        element: <DocumentsPage />,
      },
      {
        path: ROUTES.DOCUMENTS.DETAIL(':id'),
        element: <DocumentVersionsPage />,
      },
      {
        path: '/documents/:id/compare',
        element: <DocumentComparePage />,
      },
      {
        path: ROUTES.CALENDAR,
        element: <CalendarPage />,
      },
      {
        path: '/calendar/meetings/:id',
        element: <MeetingDetailPage />,
      },
      {
        path: ROUTES.ANALYTICS,
        element: <AnalyticsPage />,
      },
      {
        path: ROUTES.AI_ASSISTANT,
        element: <AiAssistantPage />,
      },
      {
        path: ROUTES.NOTIFICATIONS,
        element: <NotificationsPage />,
      },
      {
        path: ROUTES.SETTINGS,
        element: <SettingsPage />,
      },
      {
        path: ROUTES.USER_PROFILE,
        element: <UserProfilePage />,
      },
    ],
  },
]);
