/**
 * @file Layout.tsx
 * @description Основной layout-компонент приложения с Sidebar и Header
 */

import { useState, type ReactNode, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/app/hooks/useAuth';
import { webSocketService } from '@/app/services/notifications/websocket.service';
import { SelectProvider } from '@/shared/context/SelectContext.tsx';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

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
        {}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeMobileSidebar} />
        )}

        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCollapse={toggleSidebar}
          onMobileClose={closeMobileSidebar}
        />

        {}
        <div
          className={`
          transition-all duration-300 ease-in-out
          lg:ml-72
          ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}
        `}
        >
          <Header onMenuClick={handleMenuClick} isSidebarCollapsed={isSidebarCollapsed} />

          <main className="p-4 sm:p-6 md:p-8">{children || <Outlet />}</main>
        </div>
      </div>
    </SelectProvider>
  );
};
