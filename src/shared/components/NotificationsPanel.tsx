/**
 * @file NotificationsPanel.tsx
 * @description Боковая панель уведомлений с фильтрацией и управлением
 *
 * НАЗНАЧЕНИЕ:
 * - Отображение всех уведомлений пользователя
 * - Фильтрация по типам: Все / Непрочитанные
 * - Управление уведомлениями (отметить как прочитанное, удалить)
 */

import { useState } from 'react';
import {
  Bell,
  FileText,
  Calendar,
  User,
  DollarSign,
  Clock,
  X,
  Settings,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

interface Notification {
  id: number;
  type: 'document' | 'meeting' | 'payment' | 'client' | 'deadline' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
  priority?: 'high' | 'medium' | 'low';
  avatar?: string;
}

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'deadline',
      title: 'Приближается дедлайн',
      description: 'Дело "Трудовой спор" - до окончания осталось 2 дня',
      time: '10 минут назад',
      read: false,
      priority: 'high',
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Встреча через 30 минут',
      description: 'Консультация с клиентом Ивановым П.А.',
      time: '30 минут назад',
      read: false,
      priority: 'high',
      avatar: 'ИП',
    },
    {
      id: 3,
      type: 'document',
      title: 'Новый документ загружен',
      description: 'Иванов П.А. загрузил "Трудовой договор.pdf"',
      time: '2 часа назад',
      read: false,
      avatar: 'ИП',
    },
    {
      id: 4,
      type: 'payment',
      title: 'Получен платеж',
      description: 'ООО "ТехноСтрой" - 75 000 ₽',
      time: '3 часа назад',
      read: true,
      avatar: 'ТС',
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5 text-blue-500" strokeWidth={2} />;
      case 'meeting':
        return <Calendar className="w-5 h-5 text-purple-500" strokeWidth={2} />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-500" strokeWidth={2} />;
      case 'client':
        return <User className="w-5 h-5 text-orange-500" strokeWidth={2} />;
      case 'deadline':
        return <Clock className="w-5 h-5 text-red-500" strokeWidth={2} />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" strokeWidth={2} />;
    }
  };

  const getPriorityColor = (priority?: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500';
      case 'medium':
        return 'border-l-4 border-l-amber-500';
      default:
        return '';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] bg-background border-0 shadow-2xl p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-2xl tracking-tight">Уведомления</SheetTitle>
              <SheetDescription>
                {unreadCount > 0 ? `${unreadCount} новых уведомлений` : 'Нет новых уведомлений'}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="all" className="flex-1">
          <div className="px-6 pt-4 pb-2 border-b border-border">
            <TabsList className="bg-muted rounded-xl p-1 w-full">
              <TabsTrigger value="all" className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Все
                {!!notifications.length && (
                  <Badge className="ml-2 bg-muted-foreground/20 text-foreground border-0 text-xs">
                    {notifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Новые
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white border-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {!!notifications.length && (
            <div className="px-6 py-3 flex items-center justify-between border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                disabled={unreadCount === 0}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" strokeWidth={2} />
                Прочитать все
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-muted-foreground hover:bg-muted rounded-lg"
              >
                <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                Очистить все
              </Button>
            </div>
          )}

          <TabsContent value="all" className="mt-0 h-[calc(100vh-280px)] overflow-y-auto">
            {notifications.length ? (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                      } ${getPriorityColor(notification.priority)}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {notification.avatar ? (
                        <Avatar className="w-10 h-10 ring-2 ring-background flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                            {notification.avatar}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm tracking-tight ${!notification.read ? 'font-medium' : ''}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground/70">{notification.time}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <X className="w-4 h-4" strokeWidth={2} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-4">
                  <Bell className="w-10 h-10 text-muted-foreground/50" strokeWidth={2} />
                </div>
                <h3 className="text-lg tracking-tight mb-2">Нет уведомлений</h3>
                <p className="text-sm text-muted-foreground">Все уведомления будут отображаться здесь</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="unread" className="mt-0 h-[calc(100vh-280px)] overflow-y-auto">
            {unreadNotifications.length ? (
              <div className="divide-y divide-border">
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer bg-blue-50/30 dark:bg-blue-900/10 ${getPriorityColor(notification.priority)}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {notification.avatar ? (
                        <Avatar className="w-10 h-10 ring-2 ring-background flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                            {notification.avatar}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm tracking-tight font-medium">
                            {notification.title}
                          </h4>
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground/70">{notification.time}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <X className="w-4 h-4" strokeWidth={2} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <div className="w-20 h-20 rounded-3xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-500" strokeWidth={2} />
                </div>
                <h3 className="text-lg tracking-tight mb-2">Все прочитано!</h3>
                <p className="text-sm text-muted-foreground">У вас нет новых уведомлений</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {!!notifications.length && (
          <div className="px-6 py-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full rounded-xl border-input hover:bg-muted"
            >
              <Settings className="w-4 h-4 mr-2" strokeWidth={2} />
              Настройки уведомлений
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
