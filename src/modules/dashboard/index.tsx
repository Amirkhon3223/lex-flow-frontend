import { useState } from 'react';
import { caseService } from "@/app/services/cases/caseService";
import { clientService } from "@/app/services/clients/clientService";
import { documentService } from "@/app/services/documents/documentService";
import { AIInsightsWidget } from "@/modules/dashboard/widgets/AIInsightsWidget";
import { PriorityCases } from "@/modules/dashboard/widgets/PriorityCases";
import { QuickActions } from "@/modules/dashboard/widgets/QuickActions";
import { RecentActivity } from "@/modules/dashboard/widgets/RecentActivity";
import { StatsCards } from "@/modules/dashboard/widgets/StatsCards";
import { TodayWidget } from "@/modules/dashboard/widgets/TodayWidget";
import { AddCaseDialog } from "@/shared/components/AddCaseDialog";
import { AddClientDialog } from "@/shared/components/AddClientDialog";
import { UploadDocumentDialog } from "@/shared/components/UploadDocumentDialog";

export default function DashboardPage() {
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);

  const handleAddCase = async (caseData: any) => {
    try {
      const newCase = await caseService.create(caseData);
      console.log('Дело успешно создано:', newCase);
    } catch (error) {
      console.error('Ошибка при создании дела:', error);
    }
  };

  const handleAddClient = async (clientData: any) => {
    try {
      const newClient = await clientService.create(clientData);
      console.log('Клиент успешно создан:', newClient);
    } catch (error) {
      console.error('Ошибка при создании клиента:', error);
    }
  };

  const handleUploadDocument = async (documentData: any) => {
    try {
      const newDocument = await documentService.upload(documentData);
      console.log('Документ успешно загружен:', newDocument);
    } catch (error) {
      console.error('Ошибка при загрузке документа:', error);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl tracking-tight mb-2">Добро пожаловать, Александр</h2>
          <p className="text-gray-500 text-lg">У вас 5 задач на сегодня</p>
        </div>

        <StatsCards />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
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
      <AddClientDialog
        open={isAddClientOpen}
        onOpenChange={setIsAddClientOpen}
        onSubmit={handleAddClient}
      />
      <UploadDocumentDialog
        open={isUploadDocOpen}
        onOpenChange={setIsUploadDocOpen}
        onSubmit={handleUploadDocument}
      />
    </>
  );
}
