/**
 * @file Layout.tsx
 * @description Основной layout-компонент приложения с Sidebar и Header
 *
 * НАЗНАЧЕНИЕ:
 * - Предоставляет единую структуру страниц (Sidebar + Header + Content)
 * - Управляет глобальным поиском, уведомлениями и профилем пользователя
 * - Фиксированный Sidebar (слева) и липкий Header (сверху)
 * - Адаптивное поведение для планшетов и мобильных устройств
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
    // На мобильных (< md) открываем/закрываем mobile sidebar
    // На планшетах (md - lg) переключаем collapsed состояние
    if (window.innerWidth < 768) {
      // Mobile
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      // Tablet
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <SelectProvider>
      <div className="min-h-screen bg-background">
        {/* Mobile overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeMobileSidebar} />
        )}

        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCollapse={toggleSidebar}
          onMobileClose={closeMobileSidebar}
        />

        {/* Main content area with responsive margin */}
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
