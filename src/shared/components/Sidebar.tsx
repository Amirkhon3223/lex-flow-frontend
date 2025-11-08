/**
 * @file Sidebar.tsx
 * @description Боковая навигационная панель приложения LexFlow
 *
 * НАЗНАЧЕНИЕ:
 * - Главная навигация по разделам приложения
 * - Отображение логотипа и брендинга LexFlow
 * - Счетчики активных элементов (дела, клиенты)
 * - Быстрый доступ к AI-помощнику, настройкам и выходу
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
  LogOut,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';
import { ROUTES } from '../../app/config/routes.config';

const navigationItems = [
  { icon: Home, label: 'Обзор', path: ROUTES.DASHBOARD, id: 'overview' },
  { icon: Briefcase, label: 'Дела', path: ROUTES.CASES.BASE, id: 'cases', count: 47 },
  { icon: Users, label: 'Клиенты', path: ROUTES.CLIENTS.BASE, id: 'clients', count: 24 },
  { icon: FileText, label: 'Документы', path: ROUTES.DOCUMENTS.BASE, id: 'documents' },
  { icon: Calendar, label: 'Календарь', path: ROUTES.CALENDAR, id: 'calendar' },
  { icon: BarChart3, label: 'Аналитика', path: ROUTES.ANALYTICS, id: 'analytics' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white/80 backdrop-blur-2xl border-r border-gray-200/50 z-40">
      <div className="flex flex-col h-full">
        {}
        <div className="px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl tracking-tight">LexFlow</h1>
              <p className="text-xs text-gray-500">Legal Platform</p>
            </div>
          </div>
        </div>

        {}
        <nav className="flex-1 px-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" strokeWidth={2} />
                <span className="flex-1 text-left text-[15px]">{item.label}</span>
                {item.count && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {}
        <div className="p-4 space-y-1">
          <Separator className="mb-3 bg-gray-200" />
          <Link
            to={ROUTES.AI_ASSISTANT}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
              location.pathname === ROUTES.AI_ASSISTANT
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-5 h-5" strokeWidth={2} />
            <span className="text-[15px]">AI Помощник</span>
            <Badge className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs border-0">
              Новое
            </Badge>
          </Link>
          <Link
            to={ROUTES.SETTINGS}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
              location.pathname === ROUTES.SETTINGS
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" strokeWidth={2} />
            <span className="text-[15px]">Настройки</span>
          </Link>
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-gray-700 hover:bg-red-50 hover:text-red-600"
            onClick={() => {

              console.log('Logout clicked');
            }}
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span className="text-[15px]">Выход</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
