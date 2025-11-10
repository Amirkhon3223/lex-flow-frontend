/**
 * @file Layout.tsx
 * @description Основной layout-компонент приложения с Sidebar и Header
 *
 * НАЗНАЧЕНИЕ:
 * - Предоставляет единую структуру страниц (Sidebar + Header + Content)
 * - Управляет глобальным поиском, уведомлениями и профилем пользователя
 * - Фиксированный Sidebar (слева) и липкий Header (сверху)
 */

import React, { type ReactNode } from 'react';
import { SelectProvider } from "@/shared/context/SelectContext.tsx";
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SelectProvider>
      <div className="min-h-screen bg-[#f5f5f7]">
        <Sidebar/>

        <div className="ml-72">
          <Header/>

          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </SelectProvider>
  );
};
