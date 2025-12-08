import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { useCasesStore } from '@/app/store/cases.store';
import { useClientsStore } from '@/app/store/clients.store';
import type {
  CaseDocumentInterface,
  AIInsightInterface,
} from '@/app/types/cases/cases.interfaces';
import { CaseAIInsightsCard } from '@/modules/cases/components/CaseAIInsightsCard';
import { CaseClientCard } from '@/modules/cases/components/CaseClientCard';
import { CaseCommentsCard } from '@/modules/cases/components/CaseCommentsCard';
import { CaseFinancesCard } from '@/modules/cases/components/CaseFinancesCard';
import { CaseHeader } from '@/modules/cases/components/CaseHeader';
import { CaseProgressCard } from '@/modules/cases/components/CaseProgressCard';
import { CaseTabsCard } from '@/modules/cases/components/CaseTabsCard';
import { CaseTasksCard } from '@/modules/cases/components/CaseTasksCard';
import { EditCaseDialog } from '@/modules/cases/ui/EditCaseDialog';
import { AddTaskDialog } from '@/shared/components/AddTaskDialog';
import { CommentsDialog } from '@/shared/components/CommentsDialog';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { useI18n } from '@/shared/context/I18nContext';

export function CaseDetailView() {
  // ВАЖНО: правильный вариант — гарантированно string
  const { id = "" } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const onBack = () => navigate(-1);

  const [isUploadDocumentDialogOpen, setIsUploadDocumentDialogOpen] = useState(false);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const [isEditCaseDialogOpen, setIsEditCaseDialogOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const {
    selectedCase,
    timeline,
    fetchCaseById,
    fetchTimeline,
    updateCase,
    tasks,
    comments,
    fetchTasks,
    fetchComments,
    tasksLoading,
  } = useCasesStore();

  const { selectedClient, fetchClientById } = useClientsStore();
  const { t } = useI18n();

  useEffect(() => {
    if (!id || initialized) return;

    const loadData = async () => {
      await fetchCaseById(id);
      await fetchTimeline(id);
      await fetchTasks(id);
      await fetchComments(id);
      setInitialized(true);
    };

    loadData();
  }, [id, initialized, fetchCaseById, fetchTimeline, fetchTasks, fetchComments]);

  // Загружаем клиента когда получили кейс
  useEffect(() => {
    if (selectedCase?.clientId) {
      fetchClientById(selectedCase.clientId);
    }
  }, [selectedCase?.clientId, fetchClientById]);

  const handleEditCaseSubmit = async (caseData: {
    title: string;
    description: string;
    deadline: string;
    fee: string;
    priority: string;
  }) => {
    if (!id) return;
    try {
      await updateCase(id, {
        title: caseData.title,
        description: caseData.description,
        deadline: caseData.deadline,
        fee: Number(caseData.fee),
        priority: caseData.priority,
      });
      setIsEditCaseDialogOpen(false);
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  const clientId = selectedCase?.clientId || '';

  const caseData = selectedCase
    ? {
      title: selectedCase.title,
      client: selectedCase.clientId,
      category: selectedCase.category,
      deadline: selectedCase.deadline,
      fee: selectedCase.fee.toString(),
      description: selectedCase.description,
      priority: selectedCase.priority,
    }
    : {
      title: '',
      client: '',
      category: '',
      deadline: '',
      fee: '',
      description: '',
      priority: '',
    };

  const documents: CaseDocumentInterface[] = []; // TODO: Подключить API документов
  const aiInsights: AIInsightInterface[] = []; // TODO: Подключить AI-insights

  const handleAIReport = () => navigate(ROUTES.AI_ASSISTANT);
  const handleClientProfile = () => navigate(`${ROUTES.CLIENTS.BASE}/${clientId}`);

  const handleDocumentClick = (docId: number) => {
    navigate(ROUTES.DOCUMENTS.DETAIL(docId.toString()));
  };

  const handleDownloadDocument = (docName: string) => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = docName;
    link.click();
  };

  const handleCopyLink = () => navigator.clipboard.writeText(window.location.href);

  const handleShareEmail = () => {
    const url = window.location.href;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      t('CASES.SHARE.SUBJECT')
    )}&body=${encodeURIComponent(t('CASES.SHARE.BODY', { url }))}`;
  };

  const clientSince = selectedClient?.joinDate
    ? new Date(selectedClient.joinDate).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    : selectedClient?.createdAt
      ? new Date(selectedClient.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
      : '';

  return (
    <div>
      {/* ДИАЛОГИ */}
      <UploadDocumentDialog open={isUploadDocumentDialogOpen} onOpenChange={setIsUploadDocumentDialogOpen} />

      <AddTaskDialog
        caseId={id}     // теперь всегда string
        open={isAddTaskDialogOpen}
        onOpenChange={setIsAddTaskDialogOpen}
      />

      <CommentsDialog
        caseId={id}     // теперь всегда string
        open={isCommentsDialogOpen}
        onOpenChange={setIsCommentsDialogOpen}
      />

      <EditCaseDialog
        open={isEditCaseDialogOpen}
        onOpenChange={setIsEditCaseDialogOpen}
        initialData={caseData}
        onSubmit={handleEditCaseSubmit}
      />

      {/* ХЕДЕР */}
      <CaseHeader
        title={selectedCase?.title}
        clientName={selectedCase?.clientName}
        category={selectedCase?.category}
        deadline={selectedCase?.deadline}
        priority={selectedCase?.priority}
        onBack={onBack}
        onCopyLink={handleCopyLink}
        onShareEmail={handleShareEmail}
        onEdit={() => setIsEditCaseDialogOpen(true)}
        onAddDocument={() => setIsUploadDocumentDialogOpen(true)}
      />

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <CaseProgressCard
              progress={selectedCase?.progress}
              documentsCount={selectedCase?.documents}
              eventsCount={timeline.length}
              daysUntilTrial={
                selectedCase?.deadline
                  ? Math.ceil((new Date(selectedCase.deadline).getTime() - Date.now()) / (1000 * 3600 * 24))
                  : 0
              }
              tasksCount={selectedCase?.tasksCount ?? 0}
            />

            <CaseAIInsightsCard insights={aiInsights} onViewFullReport={handleAIReport} />

            <CaseTabsCard
              caseId={id}
              documents={documents}
              timeline={timeline}
              onDocumentClick={handleDocumentClick}
              onDownloadDocument={handleDownloadDocument}
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <CaseClientCard
              clientName={selectedCase?.clientName}
              clientAvatar={selectedCase?.clientAvatar}
              clientPhone={selectedClient?.phone || ''}
              clientEmail={selectedClient?.email || ''}
              clientCases={selectedClient?.totalCases ?? 0}
              clientSince={clientSince}
              onViewProfile={handleClientProfile}
            />

            <CaseTasksCard
              tasks={tasks}
              loading={tasksLoading}
              caseId={id}
              onAddTask={() => setIsAddTaskDialogOpen(true)}
            />

            <CaseFinancesCard
              fee={selectedCase?.fee}
              paidAmount={selectedCase?.paidAmount ?? 0}
            />

            <CaseCommentsCard
              commentsCount={comments.length}
              onOpenComments={() => setIsCommentsDialogOpen(true)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
