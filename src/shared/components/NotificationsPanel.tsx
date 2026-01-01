import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Bell,
  CheckCircle2,
  Trash2,
  X,
  Settings,
  Info,
  BadgeAlert,
  BadgeCheck,
  CircleX,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useNotificationsStore } from '@/app/store/notifications.store';
import { NotificationCategory } from '@/app/types/notifications/notifications.enums';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NOTIFICATIONS_PER_PAGE = 20;

export function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const { t } = useI18n();
  const {
    notifications,
    stats,
    pagination,
    loading,
    fetchNotifications,
    fetchStats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationsStore();
  const [currentTab, setCurrentTab] = useState('all');

  useEffect(() => {
    if (open) {
      fetchNotifications(1, NOTIFICATIONS_PER_PAGE);
      fetchStats();
    }
  }, [open]);

  const handleLoadMore = () => {
    if (pagination.page * pagination.limit < (pagination.total ?? 0)) {
      fetchNotifications(pagination.page + 1, NOTIFICATIONS_PER_PAGE);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    deleteAllNotifications();
  };

  const getNotificationIcon = (type: NotificationCategory) => {
    switch (type) {
      case NotificationCategory.INFO:
        return <Info className="w-5 h-5 text-blue-500" strokeWidth={2} />;
      case NotificationCategory.SUCCESS:
        return <BadgeCheck className="w-5 h-5 text-green-500" strokeWidth={2} />;
      case NotificationCategory.WARNING:
        return <BadgeAlert className="w-5 h-5 text-orange-500" strokeWidth={2} />;
      case NotificationCategory.ERROR:
        return <CircleX className="w-5 h-5 text-red-500" strokeWidth={2} />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" strokeWidth={2} />;
    }
  };

  const displayedNotifications =
    currentTab === 'all' ? notifications : notifications.filter((n) => !n.read);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] bg-background border-0 shadow-2xl p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-2xl tracking-tight">
                {t('NOTIFICATIONS.TITLE')}
              </SheetTitle>
              <SheetDescription>
                {stats.unread > 0
                  ? `${stats.unread} unread notifications`
                  : 'All caught up!'}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1">
          <div className="px-6 pt-4 pb-2 border-b border-border">
            <TabsList className="bg-muted rounded-xl p-1 w-full">
              <TabsTrigger value="all" className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                All
                <Badge className="ml-2 bg-muted-foreground/20 text-foreground border-0 text-xs">
                  {stats.total}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Unread
                {stats.unread > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white border-0 text-xs">
                    {stats.unread}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {stats.total > 0 && (
            <div className="px-6 py-3 flex items-center justify-between border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                disabled={stats.unread === 0 || loading}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" strokeWidth={2} />
                Mark all as read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-muted-foreground hover:bg-muted rounded-lg"
                disabled={stats.total === 0 || loading}
              >
                <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                Clear all
              </Button>
            </div>
          )}

          <TabsContent value={currentTab} className="mt-0 h-[calc(100vh-280px)] overflow-y-auto">
            {displayedNotifications.length > 0 ? (
              <div className="divide-y divide-border">
                {displayedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm tracking-tight ${!notification.read ? 'font-medium' : ''}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground/70">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ru })}
                            </span>
                            {notification.actionUrl && notification.actionLabel && (
                                <NavLink to={notification.actionUrl} className="text-xs text-blue-500 hover:underline">
                                    {notification.actionLabel}
                                </NavLink>
                            )}
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
                 {notifications.length < (pagination.total ?? 0) && (
                    <div className="p-4">
                        <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleLoadMore}
                        disabled={loading}
                        >
                        {loading ? 'Loading...' : 'Load More'}
                        </Button>
                    </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-4">
                  <Bell className="w-10 h-10 text-muted-foreground/50" strokeWidth={2} />
                </div>
                <h3 className="text-lg tracking-tight mb-2">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You're all caught up.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="px-6 py-4 border-t border-border">
          <NavLink to="/settings" className="w-full">
            <Button variant="outline" className="w-full rounded-xl border-input hover:bg-muted">
              <Settings className="w-4 h-4 mr-2" strokeWidth={2} />
              Notification Settings
            </Button>
          </NavLink>
        </div>
      </SheetContent>
    </Sheet>
  );
}
