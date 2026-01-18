/**
 * @file ClientsListView.tsx
 * @description Страница списка всех клиентов с фильтрацией, поиском и статистикой
 *
 * TODO:
 * - Добавить пагинацию
 * - Сортировка по колонкам
 * - Экспорт данных (Excel, VCF)
 * - Массовые действия
 * - Режим сетки (Grid view)
 */

import { useState, useEffect } from 'react';
import {
  Plus,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Users,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config.ts';
import { useClientsStore } from '@/app/store/clients.store';
import {
  ClientTypeEnum,
  ClientCategoryEnum,
  ClientStatusEnum,
} from '@/app/types/clients/clients.enums';
import type { ClientInterface } from '@/app/types/clients/clients.interfaces';
import { ClientFormModal } from '@/shared/components/ClientFormModal';
import { DataPagination } from '@/shared/components/DataPagination';
import { FilterBar } from '@/shared/components/filters/FilterBar';
import { ActionsMenu } from '@/shared/components/menus/ActionsMenu';
import { useI18n } from '@/shared/context/I18nContext';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { StatCard } from '@/shared/ui/stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export function ClientsPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { clients, selectedClient, pagination, loading, fetchClients, deleteClient, selectClient } =
    useClientsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientFormMode, setClientFormMode] = useState<'create' | 'edit'>('create');
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);

  const limit = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterCategory, filterStatus, debouncedSearch]);

  useEffect(() => {
    fetchClients({
      page: currentPage,
      limit,
      type: filterType !== 'all' ? filterType : undefined,
      category: filterCategory !== 'all' ? filterCategory : undefined,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      search: debouncedSearch || undefined,
    });
  }, [currentPage, debouncedSearch, filterType, filterCategory, filterStatus]);

  const getClientName = (client: ClientInterface) => {
    if (client.companyName) return client.companyName;
    return `${client.lastName || ''} ${client.firstName || ''} ${client.middleName || ''}`.trim();
  };

  const getClientInitials = (client: ClientInterface) => {
    if (client.companyName) {
      const words = client.companyName.split(' ').filter((w) => w.length > 0);
      return words
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
    }
    const firstInitial = client.firstName?.[0] || '';
    const lastInitial = client.lastName?.[0] || '';
    return (firstInitial + lastInitial).toUpperCase() || 'CL';
  };

  const getCategoryBadge = (category: ClientCategoryEnum) => {
    const styles = {
      [ClientCategoryEnum.VIP]: 'bg-purple-100 text-purple-700',
      [ClientCategoryEnum.PREMIUM]: 'bg-blue-100 text-blue-700',
      [ClientCategoryEnum.STANDARD]: 'bg-gray-100 text-gray-700',
    };
    const labels = {
      [ClientCategoryEnum.VIP]: t('CLIENTS.CATEGORIES.VIP'),
      [ClientCategoryEnum.PREMIUM]: t('CLIENTS.CATEGORIES.PREMIUM'),
      [ClientCategoryEnum.STANDARD]: t('CLIENTS.CATEGORIES.STANDARD'),
    };
    return <Badge className={`${styles[category]} border-0`}>{labels[category]}</Badge>;
  };

  const getStatusBadge = (status: ClientStatusEnum) => {
    const styles = {
      [ClientStatusEnum.ACTIVE]: 'bg-green-100 text-green-700',
      [ClientStatusEnum.INACTIVE]: 'bg-gray-100 text-gray-700',
      [ClientStatusEnum.PENDING]: 'bg-amber-100 text-amber-700',
    };
    const labels = {
      [ClientStatusEnum.ACTIVE]: t('CLIENTS.STATUS.ACTIVE'),
      [ClientStatusEnum.INACTIVE]: t('CLIENTS.STATUS.INACTIVE'),
      [ClientStatusEnum.PENDING]: t('CLIENTS.STATUS.PENDING'),
    };
    return <Badge className={`${styles[status]} border-0 text-xs`}>{labels[status]}</Badge>;
  };

  const getTypeIcon = (type: ClientTypeEnum) => {
    switch (type) {
      case ClientTypeEnum.LEGAL:
        return <Building2 className="w-4 h-4" strokeWidth={2} />;
      case ClientTypeEnum.ENTREPRENEUR:
        return <Briefcase className="w-4 h-4" strokeWidth={2} />;
      default:
        return <Users className="w-4 h-4" strokeWidth={2} />;
    }
  };

  const stats = [
    {
      label: t('CLIENTS.STATS.TOTAL'),
      value: pagination?.total || clients.length,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: t('CLIENTS.STATS.ACTIVE'),
      value: clients.filter((c) => c.status === ClientStatusEnum.ACTIVE).length,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: t('CLIENTS.STATS.VIP'),
      value: clients.filter((c) => c.category === ClientCategoryEnum.VIP).length,
      icon: Star,
      color: 'text-purple-500',
    },
    {
      label: t('CLIENTS.STATS.ACTIVE_CASES'),
      value: clients.reduce((sum, c) => sum + c.activeCases, 0),
      icon: Briefcase,
      color: 'text-orange-500',
    },
  ];

  return (
    <div>
      <ClientFormModal
        open={isClientFormOpen}
        onOpenChange={setIsClientFormOpen}
        mode={clientFormMode}
        client={clientFormMode === 'edit' ? selectedClient || undefined : undefined}
      />

      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight">
                  {t('CLIENTS.TITLE')}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                  {t('CLIENTS.SUBTITLE')}
                </p>
              </div>
            </div>

            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md w-full sm:w-auto"
              onClick={() => {
                setClientFormMode('create');
                setIsClientFormOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
              {t('CLIENTS.NEW_CLIENT')}
            </Button>
          </div>

          <FilterBar
            searchConfig={{
              value: searchQuery,
              onChange: setSearchQuery,
              placeholder: t('CLIENTS.SEARCH_PLACEHOLDER'),
              className: 'flex-1 max-w-md',
            }}
            filters={[
              {
                value: filterType,
                onChange: setFilterType,
                placeholder: t('CLIENTS.FIELDS.TYPE'),
                width: 'w-[180px]',
                options: [
                  { value: 'all', label: t('CLIENTS.FILTERS.ALL_TYPES') },
                  { value: 'individual', label: t('CLIENTS.FILTERS.INDIVIDUAL') },
                  { value: 'legal', label: t('CLIENTS.FILTERS.LEGAL') },
                  { value: 'entrepreneur', label: t('CLIENTS.FILTERS.ENTREPRENEUR') },
                ],
              },
              {
                value: filterCategory,
                onChange: setFilterCategory,
                placeholder: t('CLIENTS.FIELDS.CATEGORY'),
                width: 'w-[160px]',
                options: [
                  { value: 'all', label: t('CLIENTS.FILTERS.ALL_CATEGORIES') },
                  { value: 'vip', label: t('CLIENTS.FILTERS.VIP') },
                  { value: 'premium', label: t('CLIENTS.FILTERS.PREMIUM') },
                  { value: 'standard', label: t('CLIENTS.FILTERS.STANDARD') },
                ],
              },
              {
                value: filterStatus,
                onChange: setFilterStatus,
                placeholder: t('CLIENTS.FIELDS.STATUS'),
                width: 'w-[160px]',
                options: [
                  { value: 'all', label: t('CLIENTS.FILTERS.ALL_STATUSES') },
                  { value: 'active', label: t('CLIENTS.FILTERS.ACTIVE') },
                  { value: 'inactive', label: t('CLIENTS.FILTERS.INACTIVE') },
                  { value: 'pending', label: t('CLIENTS.FILTERS.PENDING') },
                ],
              },
            ]}
          />
        </div>
      </header>

      <main className="py-4 sm:py-6">
        {}
        {(filterType !== 'all' ||
          filterCategory !== 'all' ||
          filterStatus !== 'all' ||
          debouncedSearch) && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('COMMON.ACTIVE_FILTERS')}:</span>
            {filterType !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {t('CLIENTS.FIELDS.TYPE')}: {t(`CLIENTS.FILTERS.${filterType.toUpperCase()}`)}
                <button
                  onClick={() => setFilterType('all')}
                  className="ml-1 hover:text-destructive"
                  aria-label="Remove filter"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {t('CLIENTS.FIELDS.CATEGORY')}:{' '}
                {t(`CLIENTS.FILTERS.${filterCategory.toUpperCase()}`)}
                <button
                  onClick={() => setFilterCategory('all')}
                  className="ml-1 hover:text-destructive"
                  aria-label="Remove filter"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterStatus !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {t('CLIENTS.FIELDS.STATUS')}: {t(`CLIENTS.FILTERS.${filterStatus.toUpperCase()}`)}
                <button
                  onClick={() => setFilterStatus('all')}
                  className="ml-1 hover:text-destructive"
                  aria-label="Remove filter"
                >
                  ×
                </button>
              </Badge>
            )}
            {debouncedSearch && (
              <Badge variant="secondary" className="gap-1">
                {t('COMMON.SEARCH')}: {debouncedSearch}
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 hover:text-destructive"
                  aria-label="Clear search"
                >
                  ×
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterType('all');
                setFilterCategory('all');
                setFilterStatus('all');
                setSearchQuery('');
              }}
              className="text-xs"
            >
              {t('COMMON.CLEAR_ALL')}
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.color}
              valueColor={stat.color}
            />
          ))}
        </div>

        <Card className="hidden md:block relative">
          {loading && clients.length > 0 && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">{t('COMMON.LOADING')}</p>
              </div>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">
                  {t('CLIENTS.FIELDS.CLIENT')}
                </TableHead>
                <TableHead className="text-muted-foreground">{t('CLIENTS.FIELDS.TYPE')}</TableHead>
                <TableHead className="text-muted-foreground">
                  {t('CLIENTS.FIELDS.CATEGORY')}
                </TableHead>
                <TableHead className="text-muted-foreground">
                  {t('CLIENTS.FIELDS.CONTACTS')}
                </TableHead>
                <TableHead className="text-muted-foreground">{t('CLIENTS.FIELDS.CASES')}</TableHead>
                <TableHead className="text-muted-foreground">
                  {t('CLIENTS.FIELDS.REVENUE')}
                </TableHead>
                <TableHead className="text-muted-foreground">
                  {t('CLIENTS.FIELDS.LAST_CONTACT')}
                </TableHead>
                <TableHead className="text-muted-foreground">
                  {t('CLIENTS.FIELDS.STATUS')}
                </TableHead>
                <TableHead className="text-right text-muted-foreground">
                  {t('CLIENTS.FIELDS.ACTIONS')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin" />
                      <p className="text-sm text-muted-foreground">{t('COMMON.LOADING')}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-12 h-12 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">{t('CLIENTS.NO_CLIENTS')}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(ROUTES.CLIENTS.DETAIL(client.id))}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-border">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            {getClientInitials(client)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="tracking-tight mb-0.5">{getClientName(client)}</div>
                          <div className="text-xs text-muted-foreground">
                            {t('CLIENTS.SINCE')}{' '}
                            {new Date(client.joinDate).toLocaleDateString('ru-RU', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getTypeIcon(client.type)}
                        <span>
                          {client.type === ClientTypeEnum.INDIVIDUAL
                            ? t('CLIENTS.TYPES.INDIVIDUAL')
                            : client.type === ClientTypeEnum.LEGAL
                              ? t('CLIENTS.TYPES.LEGAL')
                              : t('CLIENTS.TYPES.ENTREPRENEUR')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(client.category)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                          <span className="truncate max-w-[180px]">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="text-blue-600">{client.activeCases}</span>
                        <span className="text-muted-foreground"> / {client.totalCases}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <DollarSign className="w-3.5 h-3.5 text-green-600" strokeWidth={2} />
                        <span className="text-foreground">
                          {client.totalRevenue.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                        {client.lastContact
                          ? new Date(client.lastContact).toLocaleDateString('ru-RU')
                          : t('COMMON.NO_DATA')}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell className="text-right">
                      <ActionsMenu
                        items={[
                          {
                            icon: Eye,
                            label: t('CLIENTS.ACTIONS.PROFILE'),
                            onClick: (e) => {
                              e?.stopPropagation();
                              navigate(ROUTES.CLIENTS.DETAIL(client.id));
                            },
                          },
                          {
                            icon: Edit,
                            label: t('CLIENTS.ACTIONS.EDIT'),
                            onClick: (e) => {
                              e?.stopPropagation();
                              selectClient(client);
                              setClientFormMode('edit');
                              setIsClientFormOpen(true);
                            },
                            separator: true,
                          },
                          {
                            icon: Mail,
                            label: t('CLIENTS.ACTIONS.WRITE'),
                            onClick: (e) => {
                              e?.stopPropagation();
                            },
                          },
                          {
                            icon: Trash2,
                            label: t('CLIENTS.ACTIONS.DELETE'),
                            onClick: async (e) => {
                              e?.stopPropagation();
                              if (confirm(t('CLIENTS.CONFIRM_DELETE'))) {
                                await deleteClient(client.id);
                              }
                            },
                            variant: 'danger',
                            separator: true,
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:hidden">
          {loading && clients.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center h-32 gap-2">
              <div className="w-8 h-8 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">{t('COMMON.LOADING')}</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center h-32 gap-2">
              <Users className="w-12 h-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">{t('CLIENTS.NO_CLIENTS')}</p>
            </div>
          ) : (
            clients.map((client) => (
              <Card
                key={client.id}
                onClick={() => navigate(ROUTES.CLIENTS.DETAIL(client.id))}
                className="bg-card border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="w-10 h-10 ring-2 ring-border flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                          {getClientInitials(client)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="tracking-tight text-sm truncate">
                          {getClientName(client)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t('CLIENTS.SINCE')}{' '}
                          {new Date(client.joinDate).toLocaleDateString('ru-RU', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    {getCategoryBadge(client.category)}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getTypeIcon(client.type)}
                      <span>
                        {client.type === ClientTypeEnum.INDIVIDUAL
                          ? t('CLIENTS.TYPES.INDIVIDUAL')
                          : client.type === ClientTypeEnum.LEGAL
                            ? t('CLIENTS.TYPES.LEGAL')
                            : t('CLIENTS.TYPES.ENTREPRENEUR')}
                      </span>
                      <span className="ml-auto">{getStatusBadge(client.status)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                      {client.phone}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-border pt-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-muted-foreground">{t('CLIENTS.FIELDS.CASES')}: </span>
                        <span className="text-blue-600">{client.activeCases}</span>
                        <span className="text-muted-foreground">/{client.totalCases}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-600" strokeWidth={2} />
                        <span className="text-foreground">
                          {client.totalRevenue.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {t('COMMON.SHOWING')} {(currentPage - 1) * limit + 1} -{' '}
              {Math.min(currentPage * limit, pagination.total)} {t('COMMON.OF')} {pagination.total}
            </div>
            <DataPagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          </div>
        )}
      </main>
    </div>
  );
}
