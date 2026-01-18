/**
 * @file Header.tsx
 * @description Верхняя панель приложения с поиском, уведомлениями и профилем
 *
 * НАЗНАЧЕНИЕ:
 * - Глобальный поиск по клиентам, делам, документам
 * - Уведомления с счетчиком непрочитанных
 * - Профиль пользователя с аватаром
 * - Кнопка меню для мобильных устройств и планшетов
 */

import { useState } from 'react';
import { Search, Bell, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config.ts';
import { useNotificationsStore } from '@/app/store/notifications.store';
import { LanguageSelector } from '@/shared/components/LanguageSelector';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { useI18n } from '@/shared/context/I18nContext';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { GlobalSearchDialog } from './GlobalSearchDialog';
import { NotificationsPanel } from './NotificationsPanel';

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarCollapsed?: boolean;
}

export function Header({ onMenuClick, isSidebarCollapsed }: HeaderProps) {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t } = useI18n();
  const { stats } = useNotificationsStore();

  return (
    <>
      <header className="sticky top-0 z-30 bg-card/70 backdrop-blur-2xl border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          {}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-10 h-10 rounded-xl hover:bg-muted mr-2"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" strokeWidth={2} />
          </Button>

          {}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex lg:hidden w-10 h-10 rounded-xl hover:bg-muted bg-muted/50 mr-2"
            onClick={onMenuClick}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            ) : (
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            )}
          </Button>

          <div className="flex-1 max-w-2xl">
            <div className="relative cursor-pointer" onClick={() => setIsSearchOpen(true)}>
              <Search
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
                strokeWidth={2}
              />
              <Input
                placeholder={t('COMMON.ACTIONS.SEARCH')}
                className="pl-10 sm:pl-12 h-10 sm:h-11 bg-muted/50 border-0 rounded-xl text-sm sm:text-[15px] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-background cursor-pointer"
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl hover:bg-muted cursor-pointer"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
              {stats.unread > 0 && (
                <Badge className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white border-2 border-card">
                  {stats.unread}
                </Badge>
              )}
            </Button>
            <ThemeToggle />
            <LanguageSelector />
            <button
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => navigate(ROUTES.USER_PROFILE)}
            >
              <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border-1 border-white shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-[#7B22F6] to-[#3C47F7] text-white text-xs sm:text-sm">
                  АП
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </header>
      <NotificationsPanel open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} />
      <GlobalSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}
