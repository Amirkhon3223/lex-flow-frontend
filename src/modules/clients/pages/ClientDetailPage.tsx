import { useState, useEffect } from "react";
import { Briefcase, FileText, DollarSign, Clock, TrendingUp, Plus, Mail, Phone } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCasesStore } from '@/app/store/cases.store';
import { useClientsStore } from '@/app/store/clients.store';
import type { ClientInterface } from "@/app/types/clients/clients.interfaces.ts";
import { CaseCard } from "@/modules/cases/ui/CaseCard.tsx";
import { ClientNotesCard } from "@/modules/clients/ui/ClientNotesCard.tsx";
import { ContactInfoCard } from "@/modules/clients/ui/ContactInfoCard.tsx";
import { FinancialCard } from "@/modules/clients/widgets/FinancialCard.tsx";
import { AddCaseDialog } from "@/shared/components/AddCaseDialog.tsx";
import { BackButton } from "@/shared/components/BackButton.tsx";
import { EditClientDialog } from "@/shared/components/EditClientDialog.tsx";
import { FilterBar } from '@/shared/components/filters/FilterBar';
import { useI18n } from '@/shared/context/I18nContext';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/shared/ui/pagination';
import { StatCard } from '@/shared/ui/stat-card';

export default function ClientDetailPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isAddCaseDialogOpen, setIsAddCaseDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const limit = 6;

  const { selectedClient, fetchClientById, selectClient } = useClientsStore();
  const { cases, pagination, loading, fetchCases } = useCasesStore();

  // Debounce поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterPriority, debouncedSearch]);

  // Загрузка клиента
  useEffect(() => {
    if (id) {
      fetchClientById(id);
    }
    return () => {
      selectClient(null);
    };
  }, [id, fetchClientById, selectClient]);

  // Загрузка дел с фильтрацией и пагинацией
  useEffect(() => {
    if (id) {
      fetchCases({
        page: currentPage,
        limit,
        clientId: id,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        priority: filterPriority !== 'all' ? filterPriority : undefined,
        search: debouncedSearch || undefined,
      });
    }
  }, [id, currentPage, filterStatus, filterPriority, debouncedSearch, fetchCases]);

  if (!selectedClient) {
    return <div className="p-8 text-center">{t('COMMON.LOADING')}</div>;
  }

  const getClientName = (client: ClientInterface) => {
    if (client.companyName) return client.companyName;
    return `${client.lastName || ''} ${client.firstName || ''} ${client.middleName || ''}`.trim();
  };

  const getClientInitials = (client: ClientInterface) => {
    if (client.companyName) {
      const words = client.companyName.split(' ').filter(w => w.length > 0);
      return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
    }
    const firstInitial = client.firstName?.[0] || '';
    const lastInitial = client.lastName?.[0] || '';
    return (firstInitial + lastInitial).toUpperCase() || 'CL';
  };

  // Функция для рендеринга пагинации
  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < pagination.totalPages - 2;

    if (showEllipsisStart) {
      pages.push(1);
      if (currentPage > 4) pages.push('ellipsis-start');
    }

    for (let i = Math.max(1, currentPage - 1); i <= Math.min(pagination.totalPages, currentPage + 1); i++) {
      pages.push(i);
    }

    if (showEllipsisEnd) {
      if (currentPage < pagination.totalPages - 3) pages.push('ellipsis-end');
      pages.push(pagination.totalPages);
    }

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          {pages.map((page, index) =>
            typeof page === 'string' ? (
              <PaginationItem key={page}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < pagination.totalPages && setCurrentPage(currentPage + 1)}
              className={currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <AddCaseDialog
        open={isAddCaseDialogOpen}
        onOpenChange={setIsAddCaseDialogOpen}
        preselectedClientId={id}
      />
      <EditClientDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

      <BackButton onClick={() => navigate(-1)} label={t('CLIENTS.ALL_CLIENTS')} />

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0">
            <AvatarFallback className="bg-blue-600 text-lg sm:text-xl text-white">
              {getClientInitials(selectedClient)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{getClientName(selectedClient)}</h1>
              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 w-fit">
                {selectedClient.status === 'active' ? t('CLIENTS.STATUS.ACTIVE_CLIENT') : t('CLIENTS.STATUS.INACTIVE')}
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span>🏢 {selectedClient.type === 'individual' ? t('CLIENTS.TYPES.INDIVIDUAL') : selectedClient.type === 'legal' ? t('CLIENTS.TYPES.LEGAL') : t('CLIENTS.TYPES.ENTREPRENEUR')}</span>
              <span>📅 {t('CLIENTS.CLIENT_SINCE')} {new Date(selectedClient.joinDate).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</span>
              {selectedClient.category === 'vip' && <span>⭐ {t('CLIENTS.STATUS.VIP_CLIENT')}</span>}
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{selectedClient.email}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                {selectedClient.phone}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none text-sm sm:text-base">
            {t('CLIENTS.WRITE')}
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md flex-1 sm:flex-none text-sm sm:text-base"
            onClick={() => setIsAddCaseDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
            {t('CLIENTS.NEW_CASE')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          label={t('CLIENTS.ACTIVE_CASES_COUNT')}
          value={selectedClient.activeCases}
          icon={Briefcase}
          iconColor="text-blue-500"
        />
        <StatCard
          label={t('CLIENTS.DOCUMENTS_COUNT')}
          value={0}
          icon={FileText}
          iconColor="text-purple-500"
        />
        <StatCard
          label={t('CLIENTS.TOTAL_FEE')}
          value={`${selectedClient.totalRevenue.toLocaleString('ru-RU')} ₽`}
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <StatCard
          label={t('CLIENTS.HOURS_WORKED')}
          value={0}
          icon={Clock}
          iconColor="text-orange-500"
        />
        <StatCard
          label={t('CLIENTS.INTERACTIONS')}
          value={0}
          icon={TrendingUp}
          iconColor="text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl !p-0">
          <Card className="relative">
            {loading && cases.length > 0 && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">{t('COMMON.LOADING')}</p>
                </div>
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base sm:text-lg">{t('CLIENTS.CLIENT_CASES')}</CardTitle>
              <Badge className="bg-blue-500 text-white border-0 text-md">
                {pagination?.total || cases.length} {t('CLIENTS.CASES_COUNT')}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 mt-2">
              {/* Фильтры и поиск */}
              <div className="space-y-3">
                <FilterBar
                  searchConfig={{
                    value: searchQuery,
                    onChange: setSearchQuery,
                    placeholder: t('CASES.SEARCH_PLACEHOLDER'),
                    className: 'flex-1 max-w-md',
                  }}
                  filters={[
                    {
                      value: filterStatus,
                      onChange: setFilterStatus,
                      placeholder: t('COMMON.STATUS.STATUS'),
                      width: 'w-[180px]',
                      options: [
                        { value: 'all', label: t('CASES.FILTERS.ALL_STATUSES') },
                        { value: 'new', label: t('COMMON.STATUS.NEW') },
                        { value: 'in_progress', label: t('COMMON.STATUS.IN_PROGRESS') },
                        { value: 'waiting', label: t('COMMON.STATUS.WAITING') },
                        { value: 'closed', label: t('COMMON.STATUS.CLOSED') },
                        { value: 'won', label: t('COMMON.STATUS.WON') },
                        { value: 'lost', label: t('COMMON.STATUS.LOST') },
                        { value: 'settled', label: t('COMMON.STATUS.SETTLED') },
                      ],
                    },
                    {
                      value: filterPriority,
                      onChange: setFilterPriority,
                      placeholder: t('COMMON.PRIORITY.PRIORITY'),
                      width: 'w-[160px]',
                      options: [
                        { value: 'all', label: t('CASES.FILTERS.ALL_PRIORITIES') },
                        { value: 'high', label: t('COMMON.PRIORITY.HIGH') },
                        { value: 'medium', label: t('COMMON.PRIORITY.MEDIUM') },
                        { value: 'low', label: t('COMMON.PRIORITY.LOW') },
                      ],
                    },
                  ]}
                />

                {/* Индикаторы активных фильтров */}
                {(filterStatus !== 'all' || filterPriority !== 'all' || debouncedSearch) && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t('COMMON.ACTIVE_FILTERS')}:</span>
                    {filterStatus !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        {t('COMMON.STATUS.STATUS')}: {t(`COMMON.STATUS.${filterStatus.toUpperCase()}`)}
                        <button
                          onClick={() => setFilterStatus('all')}
                          className="ml-1 hover:text-destructive"
                          aria-label="Remove filter"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {filterPriority !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        {t('COMMON.PRIORITY.PRIORITY')}: {t(`COMMON.PRIORITY.${filterPriority.toUpperCase()}`)}
                        <button
                          onClick={() => setFilterPriority('all')}
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
                        setFilterStatus('all');
                        setFilterPriority('all');
                        setSearchQuery('');
                      }}
                      className="text-xs"
                    >
                      {t('COMMON.CLEAR_ALL')}
                    </Button>
                  </div>
                )}
              </div>

              {/* Список дел */}
              {loading && cases.length === 0 ? (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-8 h-8 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">{t('COMMON.LOADING')}</p>
                  </div>
                </div>
              ) : cases.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {t('CLIENTS.NO_CASES')}
                </div>
              ) : (
                <>
                  {cases.map((caseItem) => (
                    <CaseCard key={caseItem.id} caseItem={caseItem} />
                  ))}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="pt-4">
                      {renderPagination()}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <ContactInfoCard
            contactInfo={{
              email: selectedClient.email,
              phone: selectedClient.phone,
              address: selectedClient.address || t('COMMON.NO_DATA'),
              birthDate: selectedClient.birthDate ? new Date(selectedClient.birthDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : t('COMMON.NO_DATA'),
            }}
            onEdit={() => {
              selectClient(selectedClient);
              setIsEditDialogOpen(true);
            }}
          />

          <FinancialCard
            financialData={{
              totalAmount: selectedClient.totalRevenue,
              paidAmount: 0,
              remainingAmount: selectedClient.totalRevenue,
              paymentPercentage: 0,
            }}
          />

          <ClientNotesCard
            client={selectedClient}
            onEdit={() => {
              selectClient(selectedClient);
              setIsEditDialogOpen(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}
