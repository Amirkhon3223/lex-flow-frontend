import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { ROUTES } from './config/routes.config';
import { AuthGuard } from './guards/auth.guard';

const AuthPage = lazy(() => import('@/pages/AuthPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ClientsPage = lazy(() => import('@/pages/ClientsPage'));
const ClientDetailPage = lazy(() => import('@/modules/clients/pages/ClientDetailPage'));
const CasesPage = lazy(() => import('@/pages/CasesPage'));
const CaseDetailPage = lazy(() => import('@/pages/CaseDetailPage'));
const DocumentsPage = lazy(() => import('@/pages/DocumentsPage'));
const DocumentVersionsPage = lazy(() => import('@/pages/DocumentVersionsPage'));
const DocumentComparePage = lazy(() => import('@/pages/DocumentComparePage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const MeetingDetailPage = lazy(() => import('@/modules/calendar/pages/MeetingDetailPage').then(m => ({ default: m.MeetingDetailPage })));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const AiAssistantPage = lazy(() => import('@/pages/AiAssistantPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfilePage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: ROUTES.AUTH.LOGIN,
    element: (
      <SuspenseWrapper>
        <AuthPage />
      </SuspenseWrapper>
    ),
  },
  {
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.CLIENTS.BASE,
        element: (
          <SuspenseWrapper>
            <ClientsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/clients/:id',
        element: (
          <SuspenseWrapper>
            <ClientDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.CASES.BASE,
        element: (
          <SuspenseWrapper>
            <CasesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/cases/:id',
        element: (
          <SuspenseWrapper>
            <CaseDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.DOCUMENTS.BASE,
        element: (
          <SuspenseWrapper>
            <DocumentsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.DOCUMENTS.DETAIL(':id'),
        element: (
          <SuspenseWrapper>
            <DocumentVersionsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/documents/:id/compare',
        element: (
          <SuspenseWrapper>
            <DocumentComparePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.CALENDAR,
        element: (
          <SuspenseWrapper>
            <CalendarPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/calendar/meetings/:id',
        element: (
          <SuspenseWrapper>
            <MeetingDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.ANALYTICS,
        element: (
          <SuspenseWrapper>
            <AnalyticsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.AI_ASSISTANT,
        element: (
          <SuspenseWrapper>
            <AiAssistantPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.NOTIFICATIONS,
        element: (
          <SuspenseWrapper>
            <NotificationsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.SETTINGS,
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.USER_PROFILE,
        element: (
          <SuspenseWrapper>
            <UserProfilePage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);
