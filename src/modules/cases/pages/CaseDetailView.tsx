import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { useCasesStore } from '@/app/store/cases.store';
import { useClientsStore } from '@/app/store/clients.store';
import { useDocumentsStore } from '@/app/store/documents.store';
import { usePlanLimitsStore } from '@/app/store/planLimits.store';
import { CasePriorityEnum } from '@/app/types/cases/cases.enums';
import type { CaseDocumentInterface, AIInsightInterface } from '@/app/types/cases/cases.interfaces';
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
import { parseLocalDate } from '@/shared/utils';

export function CaseDetailView() {
  const { id = '' } = useParams<{ id: string }>();

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
  const { documents, fetchDocuments } = useDocumentsStore();
  const { usage, fetchUsage } = usePlanLimitsStore();
  const { t } = useI18n();

  const documentLimitReached = usage
    ? usage.maxDocumentsPerCase !== -1 && documents.length >= usage.maxDocumentsPerCase
    : false;

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  useEffect(() => {
    if (!id || initialized) return;

    const loadData = async () => {
      await Promise.all([
        fetchCaseById(id),
        fetchTimeline(id),
        fetchTasks(id),
        fetchComments(id),
        fetchDocuments({ caseId: id }),
      ]);
      setInitialized(true);
    };

    loadData();
  }, [id, initialized]);

  useEffect(() => {
    if (selectedCase?.clientId) {
      fetchClientById(selectedCase.clientId);
    }
  }, [selectedCase?.clientId]);

  const handleEditCaseSubmit = async (caseData: {
    title: string;
    description: string;
    deadline: string;
    courtDate?: string;
    fee: string;
    priority: string;
  }) => {
    if (!id) return;
    try {
      await updateCase(id, {
        title: caseData.title,
        description: caseData.description,
        deadline: caseData.deadline,
        courtDate: caseData.courtDate,
        fee: Number(caseData.fee),
        priority: caseData.priority as CasePriorityEnum,
      });
      setIsEditCaseDialogOpen(false);
    } catch {
      // Error handled by the store
    }
  };

  const clientId = selectedCase?.clientId || '';

  const caseData = selectedCase
    ? {
        title: selectedCase.title,
        client: selectedCase.clientId,
        category: selectedCase.category,
        deadline: selectedCase.deadline,
        courtDate: selectedCase.courtDate || '',
        fee: selectedCase.fee.toString(),
        description: selectedCase.description,
        priority: selectedCase.priority,
      }
    : {
        title: '',
        client: '',
        category: '',
        deadline: '',
        courtDate: '',
        fee: '',
        description: '',
        priority: '',
      };

  const aiInsights: AIInsightInterface[] = []; // TODO: Подключить AI-insights

  const caseDocuments: CaseDocumentInterface[] = documents.map((doc) => ({
    id: doc.id,
    caseId: doc.caseId || '',
    name: doc.name,
    size: `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`,
    fileSize: doc.fileSize,
    date: new Date(doc.createdAt).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    versions: doc.versionsCount || 0,
    status: doc.status,
    fileUrl: doc.fileUrl,
    mimeType: doc.mimeType,
    type: doc.type,
    category: doc.category,
    uploadedBy: doc.uploadedBy,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    lastModified: doc.updatedAt,
  }));

  const handleAIReport = () => navigate(ROUTES.AI_ASSISTANT);
  const handleClientProfile = () => navigate(`${ROUTES.CLIENTS.BASE}/${clientId}`);

  const handleDocumentClick = (docId: string) => {
    navigate(`${ROUTES.DOCUMENTS.DETAIL(docId)}?from=case&caseId=${id}`);
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
    ? new Date(selectedClient.joinDate).toLocaleDateString('ru-RU', {
        month: 'long',
        year: 'numeric',
      })
    : selectedClient?.createdAt
      ? new Date(selectedClient.createdAt).toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric',
        })
      : '';

  const handleDocumentUploadSuccess = async () => {
    if (id) {
      await fetchDocuments({ caseId: id });
    }
  };

  return (
    <div>
      <UploadDocumentDialog
        open={isUploadDocumentDialogOpen}
        onOpenChange={setIsUploadDocumentDialogOpen}
        onSuccess={handleDocumentUploadSuccess}
        defaultCaseId={id}
      />

      <AddTaskDialog caseId={id} open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen} />

      <CommentsDialog
        caseId={id}
        open={isCommentsDialogOpen}
        onOpenChange={setIsCommentsDialogOpen}
      />

      <EditCaseDialog
        open={isEditCaseDialogOpen}
        onOpenChange={setIsEditCaseDialogOpen}
        initialData={caseData}
        onSubmit={handleEditCaseSubmit}
      />

      <CaseHeader
        title={selectedCase?.title}
        clientName={selectedCase?.clientName}
        category={selectedCase?.category}
        deadline={selectedCase?.deadline}
        courtDate={selectedCase?.courtDate}
        priority={selectedCase?.priority}
        onBack={onBack}
        onCopyLink={handleCopyLink}
        onShareEmail={handleShareEmail}
        onEdit={() => setIsEditCaseDialogOpen(true)}
        onAddDocument={() => setIsUploadDocumentDialogOpen(true)}
        documentLimitReached={documentLimitReached}
      />

      <main className="py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <CaseProgressCard
              progress={selectedCase?.progress}
              documentsCount={selectedCase?.documents}
              eventsCount={timeline.length}
              daysUntilTrial={
                selectedCase?.courtDate
                  ? Math.ceil(
                      (parseLocalDate(selectedCase.courtDate).getTime() - Date.now()) / (1000 * 3600 * 24)
                    )
                  : 0
              }
              tasksCount={selectedCase?.tasksCount ?? 0}
            />

            <CaseAIInsightsCard insights={aiInsights} onViewFullReport={handleAIReport} />

            <CaseTabsCard
              caseId={id}
              documents={caseDocuments}
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

            <CaseFinancesCard fee={selectedCase?.fee} paidAmount={selectedCase?.paidAmount ?? 0} />

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
