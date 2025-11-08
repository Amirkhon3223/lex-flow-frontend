/**
 * @file Layout.tsx
 * @description Основной layout-компонент приложения с Sidebar и Header
 *
 * НАЗНАЧЕНИЕ:
 * - Предоставляет единую структуру страниц (Sidebar + Header + Content)
 * - Управляет глобальным поиском, уведомлениями и профилем пользователя
 * - Фиксированный Sidebar (слева) и липкий Header (сверху)
 */

import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {}
      <Sidebar />

      {}
      <div className="ml-72">
        {}
        <Header />

        {}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
