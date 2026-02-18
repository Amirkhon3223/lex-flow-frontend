import { useEffect, useState } from 'react';
import { Download, Search, Filter, User, FileText, Briefcase, Calendar, Clock } from 'lucide-react';
import { useAuditLogsStore } from '@/app/store/auditLogs.store';
import type { AuditAction, AuditEntityType } from '@/app/types/audit/audit.interfaces';
import { DataPagination } from '@/shared/components/DataPagination';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

const actionLabelKeys: Record<AuditAction, string> = {
  create: 'SETTINGS.AUDIT.ACTIONS.CREATE',
  update: 'SETTINGS.AUDIT.ACTIONS.UPDATE',
  delete: 'SETTINGS.AUDIT.ACTIONS.DELETE',
  view: 'SETTINGS.AUDIT.ACTIONS.VIEW',
  export: 'SETTINGS.AUDIT.ACTIONS.EXPORT',
  login: 'SETTINGS.AUDIT.ACTIONS.LOGIN',
  logout: 'SETTINGS.AUDIT.ACTIONS.LOGOUT',
};

const actionColors: Record<AuditAction, string> = {
  create: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  update: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  delete: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  view: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  export: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  login: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  logout: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const entityLabelKeys: Record<AuditEntityType, string> = {
  client: 'SETTINGS.AUDIT.ENTITIES.CLIENT',
  case: 'SETTINGS.AUDIT.ENTITIES.CASE',
  document: 'SETTINGS.AUDIT.ENTITIES.DOCUMENT',
  meeting: 'SETTINGS.AUDIT.ENTITIES.MEETING',
  task: 'SETTINGS.AUDIT.ENTITIES.TASK',
  comment: 'SETTINGS.AUDIT.ENTITIES.COMMENT',
  user: 'SETTINGS.AUDIT.ENTITIES.USER',
  workspace: 'SETTINGS.AUDIT.ENTITIES.WORKSPACE',
  subscription: 'SETTINGS.AUDIT.ENTITIES.SUBSCRIPTION',
  team_member: 'SETTINGS.AUDIT.ENTITIES.TEAM_MEMBER',
  auth: 'SETTINGS.AUDIT.ENTITIES.AUTH',
};

const entityIcons: Record<AuditEntityType, React.ElementType> = {
  client: User,
  case: Briefcase,
  document: FileText,
  meeting: Calendar,
  task: Clock,
  comment: FileText,
  user: User,
  workspace: Briefcase,
  subscription: FileText,
  team_member: User,
  auth: User,
};

export function AuditLogTabContent() {
  const { t } = useI18n();
  const { logs, pagination, loading, filter, fetchLogs, setFilter, clearFilter, exportLogs } =
    useAuditLogsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  useEffect(() => {
    fetchLogs(1, 20);
  }, [fetchLogs]);

  const handleSearch = () => {
    setFilter({
      ...filter,
      search: searchQuery || undefined,
      action: actionFilter !== 'all' ? (actionFilter as AuditAction) : undefined,
      entityType: entityFilter !== 'all' ? (entityFilter as AuditEntityType) : undefined,
    });
    fetchLogs(1, 20);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActionFilter('all');
    setEntityFilter('all');
    clearFilter();
    fetchLogs(1, 20);
  };

  const handlePageChange = (page: number) => {
    fetchLogs(page, 20);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>{t('SETTINGS.AUDIT.TITLE')}</CardTitle>
            <CardDescription>{t('SETTINGS.AUDIT.DESCRIPTION')}</CardDescription>
          </div>
          <Button variant="outline" onClick={exportLogs} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            {t('COMMON.ACTIONS.EXPORT')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('SETTINGS.AUDIT.SEARCH_PLACEHOLDER')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t('SETTINGS.AUDIT.FILTER_ACTION')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('SETTINGS.AUDIT.ALL_ACTIONS')}</SelectItem>
              <SelectItem value="create">{t(actionLabelKeys.create)}</SelectItem>
              <SelectItem value="update">{t(actionLabelKeys.update)}</SelectItem>
              <SelectItem value="delete">{t(actionLabelKeys.delete)}</SelectItem>
              <SelectItem value="login">{t(actionLabelKeys.login)}</SelectItem>
              <SelectItem value="logout">{t(actionLabelKeys.logout)}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('SETTINGS.AUDIT.FILTER_ENTITY')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('SETTINGS.AUDIT.ALL_ENTITIES')}</SelectItem>
              <SelectItem value="client">{t(entityLabelKeys.client)}</SelectItem>
              <SelectItem value="case">{t(entityLabelKeys.case)}</SelectItem>
              <SelectItem value="document">{t(entityLabelKeys.document)}</SelectItem>
              <SelectItem value="meeting">{t(entityLabelKeys.meeting)}</SelectItem>
              <SelectItem value="auth">{t(entityLabelKeys.auth)}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} className="w-full sm:w-auto">
            {t('COMMON.SEARCH')}
          </Button>
          {(searchQuery || actionFilter !== 'all' || entityFilter !== 'all') && (
            <Button variant="ghost" onClick={handleClearFilters} className="w-full sm:w-auto">
              {t('COMMON.CLEAR_ALL')}
            </Button>
          )}
        </div>

        {/* Logs List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">{t('SETTINGS.AUDIT.NO_LOGS')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const EntityIcon = entityIcons[log.entityType] || FileText;
              return (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <EntityIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">{log.userName}</span>
                        <Badge className={`${actionColors[log.action]} border-0`}>
                          {t(actionLabelKeys[log.action])}
                        </Badge>
                        <span className="text-muted-foreground text-sm">
                          {t(entityLabelKeys[log.entityType])}
                        </span>
                      </div>
                      {log.entityName && (
                        <p className="text-sm text-muted-foreground truncate">
                          {log.entityName}
                        </p>
                      )}
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {log.ipAddress && (
                      <span className="hidden md:inline">{log.ipAddress}</span>
                    )}
                    <span className="whitespace-nowrap">{formatDate(log.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <DataPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </CardContent>
    </Card>
  );
}
