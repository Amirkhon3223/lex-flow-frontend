import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/auth.store';
import { useDashboardStore } from '@/app/store/dashboard.store';
import type { CaseFormData } from '@/app/types/cases/cases.interfaces';
import { AIInsightsWidget } from '@/modules/dashboard/widgets/AIInsightsWidget';
import { PriorityCases } from '@/modules/dashboard/widgets/PriorityCases';
import { QuickActions } from '@/modules/dashboard/widgets/QuickActions';
import { RecentActivity } from '@/modules/dashboard/widgets/RecentActivity';
import { StatsCards } from '@/modules/dashboard/widgets/StatsCards';
import { TodayWidget } from '@/modules/dashboard/widgets/TodayWidget';
import { AddCaseDialog } from '@/shared/components/AddCaseDialog';
import { ClientFormModal } from '@/shared/components/ClientFormModal';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { useI18n } from '@/shared/context/I18nContext';

export default function DashboardPage() {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const { fetchAllDashboardData } = useDashboardStore();
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  const handleAddCase = async (caseData: CaseFormData) => {
    try {
      console.log('Дело успешно создано:', caseData);
      fetchAllDashboardData();
    } catch (error) {
      console.error('Ошибка при создании дела:', error);
    }
  };

  const handleUploadDocument = async () => {
    fetchAllDashboardData();
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-2">
            {t('DASHBOARD.WELCOME')}, {user?.name || 'User'}
          </h2>
          {}
        </div>

        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PriorityCases />
            <RecentActivity />
          </div>

          <div className="space-y-6">
            <TodayWidget />
            <AIInsightsWidget />
            <QuickActions
              onAddClient={() => setIsAddClientOpen(true)}
              onAddCase={() => setIsAddCaseOpen(true)}
              onUploadDocument={() => setIsUploadDocOpen(true)}
            />
          </div>
        </div>
      </div>

      <AddCaseDialog
        open={isAddCaseOpen}
        onOpenChange={setIsAddCaseOpen}
        onSubmit={handleAddCase}
      />
      <ClientFormModal open={isAddClientOpen} onOpenChange={setIsAddClientOpen} mode="create" />
      <UploadDocumentDialog
        open={isUploadDocOpen}
        onOpenChange={setIsUploadDocOpen}
        onSuccess={handleUploadDocument}
      />
    </>
  );
}
