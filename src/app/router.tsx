import { createBrowserRouter } from 'react-router-dom';
import { MeetingDetailPage } from '@/modules/calendar/pages/MeetingDetailPage';
import ClientDetailPage from '@/modules/clients/pages/ClientDetailPage';
import AiAssistantPage from '@/pages/AiAssistantPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import CalendarPage from '@/pages/CalendarPage';
import CaseDetailPage from '@/pages/CaseDetailPage';
import CasesPage from '@/pages/CasesPage';
import ClientsPage from '@/pages/ClientsPage';
import DashboardPage from '@/pages/DashboardPage';
import DocumentComparePage from '@/pages/DocumentComparePage';
import DocumentsPage from '@/pages/DocumentsPage';
import DocumentVersionsPage from '@/pages/DocumentVersionsPage';
import LoginPage from '@/pages/LoginPage';
import NotificationsPage from '@/pages/NotificationsPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import UserProfilePage from '@/pages/UserProfilePage';
import { Layout } from '@/shared/components/Layout';
import { ROUTES } from './config/routes.config';

export const router = createBrowserRouter([
  {
    path: ROUTES.AUTH.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <Layout>
        <DashboardPage />
      </Layout>
    ),
  },
  {
    path: ROUTES.CLIENTS.BASE,
    element: (
      <Layout>
        <ClientsPage />
      </Layout>
    ),
  },
  {
    path: '/clients/:id',
    element: (
      <Layout>
        <ClientDetailPage />
      </Layout>
    ),
  },
  {
    path: ROUTES.CASES.BASE,
    element: (
      <Layout>
        <CasesPage />
      </Layout>
    ),
  },
  {
    path: '/cases/:id',
    element: (
      <Layout>
        <CaseDetailPage />
      </Layout>
    ),
  },
  {
    path: ROUTES.DOCUMENTS.BASE,
    element: (
      <Layout>
        <DocumentsPage />
      </Layout>
    ),
  },
  {
    path: '/documents/:id/versions',
    element: (
      <Layout>
        <DocumentVersionsPage />
      </Layout>
    ),
  },
  {
    path: '/documents/:id/compare',
    element: (
      <Layout>
        <DocumentComparePage />
      </Layout>
    ),
  },
  {
    path: ROUTES.CALENDAR,
    element: (
      <Layout>
        <CalendarPage />
      </Layout>
    ),
  },
  {
    path: '/calendar/meetings/:id',
    element: (
      <Layout>
        <MeetingDetailPage />
      </Layout>
    ),
  },
  {
    path: ROUTES.ANALYTICS,
    element: (
      <Layout>
        <AnalyticsPage />
      </Layout>
    ),
  },
  {
    path: ROUTES.AI_ASSISTANT,
    element: (
      <Layout>
        <AiAssistantPage />
      </Layout>
    ),
  },
  {
    path: ROUTES.REPORTS,
    element: (
      <Layout>
        <ReportsPage />
      </Layout>
    ),
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: (
      <Layout>
        <NotificationsPage />
      </Layout>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <Layout>
        <SettingsPage />
      </Layout>
    ),
  },
  {
    path: ROUTES.USER_PROFILE,
    element: (
      <Layout>
        <UserProfilePage />
      </Layout>
    ),
  },
  // {
  //   path: '/settings/profile',
  //   element: (
  //     <Layout>
  //       <UserProfilePage />
  //     </Layout>
  //   ),
  // },
]);
