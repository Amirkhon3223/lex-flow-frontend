/**
 * @file Header.tsx
 * @description Верхняя панель приложения с поиском, уведомлениями и профилем
 *
 * НАЗНАЧЕНИЕ:
 * - Глобальный поиск по клиентам, делам, документам
 * - Уведомления с счетчиком непрочитанных
 * - Профиль пользователя с аватаром
 */

import { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { GlobalSearchDialog } from './GlobalSearchDialog';
import { NotificationsPanel } from './NotificationsPanel';

export function Header() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-200/50">
        <div className="flex items-center justify-between px-8 py-4">
          {}
          <div className="flex-1 max-w-2xl">
            <div className="relative cursor-pointer" onClick={() => setIsSearchOpen(true)}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
              <Input
                placeholder="Поиск клиентов, дел, документов..."
                className="pl-12 h-11 bg-gray-100/80 border-0 rounded-xl text-[15px] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white cursor-pointer"
                readOnly
              />
            </div>
          </div>

          {}
          <div className="flex items-center gap-3">
            {}
            <Button
              variant="ghost"
              size="icon"
              className="relative w-11 h-11 rounded-xl hover:bg-gray-100"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <Bell className="w-5 h-5" strokeWidth={2} />
              {}
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </Button>

            {}
            <button
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              onClick={() => {

                console.log('Open profile');
              }}
            >
              <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                  АП
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </header>

      {}
      <NotificationsPanel open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} />
      <GlobalSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}
