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
  /** External control for search dialog open state */
  isSearchOpen?: boolean;
  /** Callback when search should open */
  onSearchOpen?: () => void;
  /** Callback when search should close */
  onSearchClose?: () => void;
}

export function Header({
  onMenuClick,
  isSidebarCollapsed,
  isSearchOpen: externalSearchOpen,
  onSearchOpen,
  onSearchClose,
}: HeaderProps) {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [internalSearchOpen, setInternalSearchOpen] = useState(false);
  const { t } = useI18n();
  const { stats } = useNotificationsStore();

  // Use external control if provided, otherwise use internal state
  const isSearchOpen = externalSearchOpen ?? internalSearchOpen;
  const handleSearchOpen = onSearchOpen ?? (() => setInternalSearchOpen(true));
  const handleSearchClose = onSearchClose ?? (() => setInternalSearchOpen(false));

  const handleSearchChange = (open: boolean) => {
    if (open) {
      handleSearchOpen();
    } else {
      handleSearchClose();
    }
  };

  return (
    <>
      <header
        role="banner"
        className="sticky top-0 z-30 bg-card/70 backdrop-blur-2xl border-b border-border"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-10 h-10 rounded-xl hover:bg-muted mr-2"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-expanded={false}
          >
            <Menu className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
          </Button>

          {/* Tablet sidebar toggle button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex lg:hidden w-10 h-10 rounded-xl hover:bg-muted bg-muted/50 mr-2"
            onClick={onMenuClick}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isSidebarCollapsed}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
            ) : (
              <ChevronLeft className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
            )}
          </Button>

          <div className="flex-1 max-w-2xl" role="search">
            <button
              type="button"
              className="relative cursor-pointer w-full text-left"
              onClick={handleSearchOpen}
              aria-label={`${t('COMMON.ACTIONS.SEARCH')}. Press to open search dialog`}
            >
              <Search
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
                strokeWidth={2}
                aria-hidden="true"
              />
              <Input
                placeholder={t('COMMON.ACTIONS.SEARCH')}
                className="pl-10 sm:pl-12 h-10 sm:h-11 bg-muted/50 border-0 rounded-xl text-sm sm:text-[15px] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-background cursor-pointer"
                readOnly
                tabIndex={-1}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl hover:bg-muted cursor-pointer"
              onClick={() => setIsNotificationsOpen(true)}
              aria-label={
                stats.unread > 0
                  ? `Notifications, ${stats.unread} unread`
                  : 'Notifications'
              }
              aria-haspopup="dialog"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} aria-hidden="true" />
              {stats.unread > 0 && (
                <Badge
                  className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white border-2 border-card"
                  aria-hidden="true"
                >
                  {stats.unread}
                </Badge>
              )}
            </Button>
            <ThemeToggle />
            <LanguageSelector />
            <button
              type="button"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => navigate(ROUTES.USER_PROFILE)}
              aria-label="Go to user profile"
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
      <GlobalSearchDialog open={isSearchOpen} onOpenChange={handleSearchChange} />
    </>
  );
}
