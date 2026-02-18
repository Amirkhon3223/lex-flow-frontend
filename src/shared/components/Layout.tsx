/**
 * @file Layout.tsx
 * @description Основной layout-компонент приложения с Sidebar и Header
 */

import { useState, useCallback, type ReactNode, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { useAuth } from '@/app/hooks/useAuth';
import { webSocketService } from '@/app/services/notifications/websocket.service';
import { SelectProvider } from '@/shared/context/SelectContext.tsx';
import { usePageTracking } from '@/shared/hooks/useAnalytics';
import { useKeyboardShortcuts, type Shortcut } from '@/shared/hooks/useKeyboardShortcuts';
import { Header } from './Header';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { Sidebar } from './Sidebar';
import { SkipLink } from './SkipLink';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  usePageTracking();

  const shortcuts: Shortcut[] = [
    {
      key: 'k',
      ctrl: true,
      description: 'SHORTCUTS.SEARCH',
      scope: 'global',
      action: useCallback(() => setIsSearchOpen(true), []),
    },
    {
      key: '/',
      ctrl: true,
      description: 'SHORTCUTS.HELP',
      scope: 'global',
      action: useCallback(() => setIsShortcutsHelpOpen(true), []),
    },
    {
      key: 'Escape',
      description: 'SHORTCUTS.CLOSE',
      scope: 'global',
      action: useCallback(() => {
        setIsSearchOpen(false);
        setIsShortcutsHelpOpen(false);
      }, []),
    },
    {
      key: 'g',
      ctrl: true,
      description: 'SHORTCUTS.GO_TO_DASHBOARD',
      action: useCallback(() => navigate(ROUTES.DASHBOARD), [navigate]),
    },
    {
      key: '1',
      ctrl: true,
      description: 'SHORTCUTS.GO_TO_CLIENTS',
      action: useCallback(() => navigate(ROUTES.CLIENTS.BASE), [navigate]),
    },
    {
      key: '2',
      ctrl: true,
      description: 'SHORTCUTS.GO_TO_CASES',
      action: useCallback(() => navigate(ROUTES.CASES.BASE), [navigate]),
    },
    {
      key: '3',
      ctrl: true,
      description: 'SHORTCUTS.GO_TO_DOCUMENTS',
      action: useCallback(() => navigate(ROUTES.DOCUMENTS.BASE), [navigate]),
    },
    {
      key: '4',
      ctrl: true,
      description: 'SHORTCUTS.GO_TO_CALENDAR',
      action: useCallback(() => navigate(ROUTES.CALENDAR), [navigate]),
    },
  ];

  useKeyboardShortcuts({ shortcuts, enabled: isAuthenticated });

  useEffect(() => {
    if (isAuthenticated) {
      webSocketService.connect();
    } else {
      webSocketService.disconnect();
    }

    return () => {
      webSocketService.disconnect();
    };
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <SelectProvider>
      <div className="min-h-screen bg-background">
        <SkipLink mainContentId="main-content" navigationId="main-nav" />

        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />
        )}

        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCollapse={toggleSidebar}
          onMobileClose={closeMobileSidebar}
        />

        <div
          className={`
          transition-all duration-300 ease-in-out
          lg:ml-72
          ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}
        `}
        >
          <Header
            onMenuClick={handleMenuClick}
            isSidebarCollapsed={isSidebarCollapsed}
            onSearchOpen={() => setIsSearchOpen(true)}
            isSearchOpen={isSearchOpen}
            onSearchClose={() => setIsSearchOpen(false)}
          />

          <main
            id="main-content"
            role="main"
            tabIndex={-1}
            className="p-4 sm:p-6 md:p-8 outline-none"
          >
            {children || <Outlet />}
          </main>
        </div>

        <KeyboardShortcutsHelp
          open={isShortcutsHelpOpen}
          onOpenChange={setIsShortcutsHelpOpen}
        />
      </div>
    </SelectProvider>
  );
};
