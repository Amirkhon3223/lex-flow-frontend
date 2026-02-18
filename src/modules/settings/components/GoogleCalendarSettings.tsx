/**
 * @file GoogleCalendarSettings.tsx
 * @description Settings component for Google Calendar integration
 */

import { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  CloudOff,
  ExternalLink,
  Loader2,
  RefreshCw,
  Settings2,
  Unlink,
  XCircle,
} from 'lucide-react';
import type { SyncDirection } from '@/app/types/calendar/googleCalendar.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { useGoogleCalendar } from '@/shared/hooks/useGoogleCalendar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { Switch } from '@/shared/ui/switch';

/**
 * Format date for display
 */
function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString();
}

/**
 * Format relative time
 */
function formatRelativeTime(dateString?: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

/**
 * Google Calendar Settings Component
 */
export function GoogleCalendarSettings() {
  const { t } = useI18n();
  const {
    connection,
    calendars,
    syncSettings,
    lastSyncResult,
    isAvailable,
    isConnected,
    loading,
    error,
    connect,
    disconnect,
    syncToGoogle,
    updateSettings,
  } = useGoogleCalendar();

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  if (!isAvailable) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>{t('GOOGLE_CALENDAR.TITLE')}</CardTitle>
              <CardDescription>{t('GOOGLE_CALENDAR.DESCRIPTION')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CloudOff className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">{t('GOOGLE_CALENDAR.COMING_SOON')}</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              {t('GOOGLE_CALENDAR.COMING_SOON_DESC')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading.connection && !connection) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>{t('GOOGLE_CALENDAR.TITLE')}</CardTitle>
              <CardDescription>{t('GOOGLE_CALENDAR.DESCRIPTION')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>{t('GOOGLE_CALENDAR.TITLE')}</CardTitle>
              <CardDescription>{t('GOOGLE_CALENDAR.DESCRIPTION')}</CardDescription>
            </div>
          </div>
          {isConnected ? (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              {t('GOOGLE_CALENDAR.CONNECTED')}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              <XCircle className="w-3.5 h-3.5 mr-1" />
              {t('GOOGLE_CALENDAR.NOT_CONNECTED')}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Not Connected State */}
        {!isConnected && (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">{t('GOOGLE_CALENDAR.CONNECT_BENEFITS_TITLE')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {t('GOOGLE_CALENDAR.BENEFIT_1')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {t('GOOGLE_CALENDAR.BENEFIT_2')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {t('GOOGLE_CALENDAR.BENEFIT_3')}
                </li>
              </ul>
            </div>

            <Button
              onClick={connect}
              disabled={loading.connection}
              className="w-full"
              size="lg"
            >
              {loading.connection ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              {t('GOOGLE_CALENDAR.CONNECT_BUTTON')}
            </Button>
          </div>
        )}

        {/* Connected State */}
        {isConnected && (
          <>
            {/* Account Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('GOOGLE_CALENDAR.CONNECTED_AS')}
                  </p>
                  <p className="font-medium">{connection?.email || '-'}</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{t('GOOGLE_CALENDAR.CONNECTED_SINCE')}</p>
                  <p>{formatDate(connection?.connectedAt)}</p>
                </div>
              </div>
            </div>

            {/* Sync Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{t('GOOGLE_CALENDAR.LAST_SYNC')}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatRelativeTime(connection?.lastSyncAt)}
                </span>
              </div>

              {lastSyncResult && (
                <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                  {t('GOOGLE_CALENDAR.LAST_SYNC_RESULT', {
                    pushed: lastSyncResult.eventsPushed,
                    imported: lastSyncResult.eventsImported,
                  })}
                </div>
              )}

              <Button
                onClick={() => syncToGoogle()}
                disabled={loading.sync}
                variant="outline"
                className="w-full"
              >
                {loading.sync ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {t('GOOGLE_CALENDAR.SYNC_NOW')}
              </Button>
            </div>

            <Separator />

            {/* Quick Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-sync">{t('GOOGLE_CALENDAR.AUTO_SYNC')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('GOOGLE_CALENDAR.AUTO_SYNC_DESC')}
                  </p>
                </div>
                <Switch
                  id="auto-sync"
                  checked={syncSettings.autoSync}
                  onCheckedChange={(checked) => updateSettings({ autoSync: checked })}
                  disabled={loading.settings}
                />
              </div>

              {syncSettings.autoSync && (
                <div className="flex items-center justify-between">
                  <Label>{t('GOOGLE_CALENDAR.SYNC_INTERVAL')}</Label>
                  <Select
                    value={syncSettings.syncInterval.toString()}
                    onValueChange={(value) =>
                      updateSettings({ syncInterval: parseInt(value, 10) })
                    }
                    disabled={loading.settings}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 {t('GOOGLE_CALENDAR.MINUTES')}</SelectItem>
                      <SelectItem value="30">30 {t('GOOGLE_CALENDAR.MINUTES')}</SelectItem>
                      <SelectItem value="60">1 {t('GOOGLE_CALENDAR.HOUR')}</SelectItem>
                      <SelectItem value="120">2 {t('GOOGLE_CALENDAR.HOURS')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>{t('GOOGLE_CALENDAR.SYNC_DIRECTION')}</Label>
                <Select
                  value={syncSettings.syncDirection}
                  onValueChange={(value) =>
                    updateSettings({ syncDirection: value as SyncDirection })
                  }
                  disabled={loading.settings}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lexflow_to_google">
                      {t('GOOGLE_CALENDAR.DIRECTION_TO_GOOGLE')}
                    </SelectItem>
                    <SelectItem value="google_to_lexflow">
                      {t('GOOGLE_CALENDAR.DIRECTION_TO_LEXFLOW')}
                    </SelectItem>
                    <SelectItem value="bidirectional">
                      {t('GOOGLE_CALENDAR.DIRECTION_BOTH')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Settings Toggle */}
            <button
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                {t('GOOGLE_CALENDAR.ADVANCED_SETTINGS')}
              </span>
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  showAdvancedSettings ? 'rotate-90' : ''
                }`}
              />
            </button>

            {/* Advanced Settings */}
            {showAdvancedSettings && (
              <div className="space-y-4 pt-2">
                {/* Calendar Selection */}
                {calendars.length > 0 && (
                  <div className="space-y-2">
                    <Label>{t('GOOGLE_CALENDAR.SELECT_CALENDARS')}</Label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {calendars.map((cal) => (
                        <div
                          key={cal.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`cal-${cal.id}`}
                            checked={syncSettings.selectedCalendarIds.includes(cal.id)}
                            onCheckedChange={(checked) => {
                              const newIds = checked
                                ? [...syncSettings.selectedCalendarIds, cal.id]
                                : syncSettings.selectedCalendarIds.filter((id) => id !== cal.id);
                              updateSettings({ selectedCalendarIds: newIds });
                            }}
                          />
                          <div className="flex items-center gap-2 flex-1">
                            {cal.color && (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: cal.color }}
                              />
                            )}
                            <Label htmlFor={`cal-${cal.id}`} className="cursor-pointer">
                              {cal.name}
                              {cal.isPrimary && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {t('GOOGLE_CALENDAR.PRIMARY')}
                                </Badge>
                              )}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Include Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-desc">
                      {t('GOOGLE_CALENDAR.INCLUDE_DESCRIPTIONS')}
                    </Label>
                    <Switch
                      id="include-desc"
                      checked={syncSettings.includeDescriptions}
                      onCheckedChange={(checked) =>
                        updateSettings({ includeDescriptions: checked })
                      }
                      disabled={loading.settings}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-attendees">
                      {t('GOOGLE_CALENDAR.INCLUDE_ATTENDEES')}
                    </Label>
                    <Switch
                      id="include-attendees"
                      checked={syncSettings.includeAttendees}
                      onCheckedChange={(checked) =>
                        updateSettings({ includeAttendees: checked })
                      }
                      disabled={loading.settings}
                    />
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Disconnect */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{t('GOOGLE_CALENDAR.DISCONNECT_TITLE')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('GOOGLE_CALENDAR.DISCONNECT_DESC')}
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={loading.disconnect}
                  >
                    {loading.disconnect ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Unlink className="w-4 h-4 mr-2" />
                    )}
                    {t('GOOGLE_CALENDAR.DISCONNECT_BUTTON')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t('GOOGLE_CALENDAR.DISCONNECT_CONFIRM_TITLE')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('GOOGLE_CALENDAR.DISCONNECT_CONFIRM_DESC')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('COMMON.ACTIONS.CANCEL')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={disconnect}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {t('GOOGLE_CALENDAR.DISCONNECT_BUTTON')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Help Link */}
            <div className="text-center">
              <a
                href="https://support.google.com/calendar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                {t('GOOGLE_CALENDAR.HELP_LINK')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default GoogleCalendarSettings;
