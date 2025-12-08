import { useState, useEffect } from "react";
import { Briefcase, FileText, DollarSign, Clock, TrendingUp, Plus, Mail, Phone } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ClientInterface } from "@/app/types/clients/clients.interfaces.ts";
import { useClientsStore } from '@/app/store/clients.store';
import { useCasesStore } from '@/app/store/cases.store';
import { CaseCard } from "@/modules/cases/ui/CaseCard.tsx";
import { ContactInfoCard } from "@/modules/clients/ui/ContactInfoCard.tsx";
import { FinancialCard } from "@/modules/clients/widgets/FinancialCard.tsx";
import { AddCaseDialog } from "@/shared/components/AddCaseDialog.tsx";
import { BackButton } from "@/shared/components/BackButton.tsx";
import { EditClientDialog } from "@/shared/components/EditClientDialog.tsx";
import { useI18n } from '@/shared/context/I18nContext';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { StatCard } from '@/shared/ui/stat-card';

export default function ClientDetailPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isAddCaseDialogOpen, setIsAddCaseDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { selectedClient, fetchClientById, selectClient } = useClientsStore();
  const { cases, fetchCases } = useCasesStore();

  useEffect(() => {
    if (id) {
      fetchClientById(id);
      fetchCases({ clientId: id, limit: 100 });
    }
    return () => {
      selectClient(null);
    };
  }, [id, fetchClientById, fetchCases, selectClient]);

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

  const clientCases = cases?.filter(c => c.clientId === id) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <AddCaseDialog open={isAddCaseDialogOpen} onOpenChange={setIsAddCaseDialogOpen} />
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base sm:text-lg">{t('CLIENTS.CLIENT_CASES')}</CardTitle>
              <Badge className="bg-blue-500 text-white border-0 text-md">{clientCases.length} {t('CLIENTS.CASES_COUNT')}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 mt-2">
              {clientCases.length > 0 ? (
                clientCases.map((caseItem) => (
                  <CaseCard key={caseItem.id} caseItem={caseItem} />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  {t('CLIENTS.NO_CASES')}
                </div>
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
        </div>
      </div>
    </div>
  );
}
