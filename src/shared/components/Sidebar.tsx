/**
 * @file Sidebar.tsx
 * @description Боковая навигационная панель приложения LexFlow
 *
 * НАЗНАЧЕНИЕ:
 * - Главная навигация по разделам приложения
 * - Отображение логотипа и брендинга LexFlow
 * - Счетчики активных элементов (дела, клиенты)
 * - Быстрый доступ к AI-помощнику, настройкам и выходу
 * - Адаптивные режимы: desktop (полный), tablet (collapsed), mobile (overlay)
 */

import {
  Home,
  Briefcase,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Sparkles,
  Settings,
  LogOut, Scale,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config.ts';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';

const navigationItems = [
  { icon: Home, label: 'Обзор', path: ROUTES.DASHBOARD, id: 'overview' },
  { icon: Briefcase, label: 'Дела', path: ROUTES.CASES.BASE, id: 'cases', count: 47 },
  { icon: Users, label: 'Клиенты', path: ROUTES.CLIENTS.BASE, id: 'clients', count: 24 },
  { icon: FileText, label: 'Документы', path: ROUTES.DOCUMENTS.BASE, id: 'documents' },
  { icon: Calendar, label: 'Календарь', path: ROUTES.CALENDAR, id: 'calendar' },
  { icon: BarChart3, label: 'Аналитика', path: ROUTES.ANALYTICS, id: 'analytics' },
];

interface SidebarProps {
  isCollapsed?: boolean;
  isMobileOpen?: boolean;
  onCollapse?: () => void;
  onMobileClose?: () => void;
}

export function Sidebar({ isCollapsed = false, isMobileOpen = false, onCollapse, onMobileClose }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white dark:bg-gradient-to-br from-gray-900 to-gray-950 border-r border-border z-50 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'md:w-20 lg:w-72' : 'md:w-72'}
        ${isMobileOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`px-6 py-8 transition-all duration-300 ${isCollapsed ? 'md:px-3 lg:px-6' : ''}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'md:justify-center lg:justify-start' : ''}`}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
              <Scale className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            {/* Text visible on mobile and desktop, hidden on tablet collapsed */}
            <div className={`transition-all duration-300 ${isCollapsed ? 'hidden lg:block' : 'block'}`}>
              <h1 className="text-xl tracking-tight">LexFlow</h1>
              <p className="text-xs text-muted-foreground">Legal Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 px-4 space-y-1 ${isCollapsed ? 'md:px-2 lg:px-4' : ''}`}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onMobileClose}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer relative
                  ${isCollapsed ? 'md:justify-center md:px-2 lg:justify-start lg:px-4' : ''}
                  ${isActive
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-muted-foreground hover:bg-muted'
                  }
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                <span className={`flex-1 text-left text-[15px] transition-all duration-300 ${isCollapsed ? 'md:hidden lg:block' : ''}`}>
                  {item.label}
                </span>
                {item.count && (
                  <>
                    {/* Badge for collapsed mode (tablet only) - показываем над иконкой, скрыто на mobile */}
                    <span className={`
                      absolute top-0.5 right-0 w-5 h-5 flex items-center justify-center text-[10px] font-semibold rounded-full
                      ${isActive ? 'bg-white text-blue-500' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'}
                      ${isCollapsed ? 'hidden md:flex lg:hidden' : 'hidden'}
                    `}>
                      {item.count}
                    </span>
                    {/* Badge for expanded mode */}
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full font-bold
                      ${isActive ? 'bg-white text-black' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'}
                      ${isCollapsed ? 'md:hidden lg:inline-block' : ''}
                    `}>
                      {item.count}
                    </span>
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className={`p-4 space-y-1 ${isCollapsed ? 'md:p-2 lg:p-4' : ''}`}>
          <Separator className="mb-3 bg-border" />
          <Link
            to={ROUTES.AI_ASSISTANT}
            onClick={onMobileClose}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer relative
              ${isCollapsed ? 'md:justify-center md:px-2 lg:justify-start lg:px-4' : ''}
              ${location.pathname === ROUTES.AI_ASSISTANT
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'text-muted-foreground hover:bg-muted'
              }
            `}
          >
            <Sparkles className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
            <span className={`text-[15px] transition-all duration-300 ${isCollapsed ? 'md:hidden lg:block' : ''}`}>
              AI Помощник
            </span>
            <Badge className={`
              ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs border-0
              ${isCollapsed ? 'md:hidden lg:flex' : ''}
            `}>
              Новое
            </Badge>
            {/* Badge indicator for collapsed mode (tablet only) */}
            <span className={`
              absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full
              ${isCollapsed ? 'hidden md:block lg:hidden' : 'hidden'}
            `} />
          </Link>
          <Link
            to={ROUTES.SETTINGS}
            onClick={onMobileClose}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer
              ${isCollapsed ? 'md:justify-center md:px-2 lg:justify-start lg:px-4' : ''}
              ${location.pathname === ROUTES.SETTINGS
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'text-muted-foreground hover:bg-muted'
              }
            `}
          >
            <Settings className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
            <span className={`text-[15px] transition-all duration-300 ${isCollapsed ? 'md:hidden lg:block' : ''}`}>
              Настройки
            </span>
          </Link>
          <button
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-muted-foreground hover:bg-red-50 hover:text-red-600 cursor-pointer
              ${isCollapsed ? 'md:justify-center md:px-2 lg:justify-start lg:px-4' : ''}
            `}
            onClick={() => {
              // console.log('Logout clicked');
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
            <span className={`text-[15px] transition-all duration-300 ${isCollapsed ? 'md:hidden lg:block' : ''}`}>
              Выход
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
