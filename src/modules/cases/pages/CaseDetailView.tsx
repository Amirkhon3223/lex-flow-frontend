import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import {
  DocumentStatusEnum,
  TimelineEventTypeEnum,
  AIInsightTypeEnum,
  AIInsightPriorityEnum,
} from '@/app/types/cases/cases.enums';
import type {
  CaseDocumentInterface,
  TimelineEventInterface,
  CaseTaskInterface,
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
import { useCasesStore } from '@/app/store/cases.store';

export function CaseDetailView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const onBack = () => navigate(-1);

  const [isUploadDocumentDialogOpen, setIsUploadDocumentDialogOpen] = useState(false);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const [isEditCaseDialogOpen, setIsEditCaseDialogOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { selectedCase, timeline, loading, fetchCaseById, fetchTimeline, updateCase } = useCasesStore();

  useEffect(() => {
    if (!id || initialized) return;

    const loadData = async () => {
      await fetchCaseById(id);
      await fetchTimeline(id);
      setInitialized(true);
    };

    loadData();
  }, [id, initialized, fetchCaseById, fetchTimeline]);

  const handleEditCaseSubmit = async (caseData: any) => {
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

  const documents: CaseDocumentInterface[] = []; // TODO: Добавить документы в сторе

  const tasks: CaseTaskInterface[] = []; // TODO: Добавить задачи в сторе

  const aiInsights: AIInsightInterface[] = []; // TODO: Добавить insights в сторе

  const handleAIReport = () => {
    navigate(ROUTES.AI_ASSISTANT);
  };

  const handleClientProfile = () => {
    navigate(`${ROUTES.CLIENTS.BASE}/${clientId}`);
  };

  const handleDocumentClick = (docId: number) => {
    navigate(ROUTES.DOCUMENTS.DETAIL(docId.toString()));
  };

  const handleDownloadDocument = (docName: string) => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = docName;
    link.click();
    console.log('Downloading:', docName);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    console.log('Link copied:', url);
  };

  const handleShareEmail = () => {
    const url = window.location.href;
    const subject = t('CASES.SHARE.SUBJECT');
    const body = t('CASES.SHARE.BODY', { url });
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const { t } = useI18n();

  return (
    <div>
      <UploadDocumentDialog open={isUploadDocumentDialogOpen} onOpenChange={setIsUploadDocumentDialogOpen} />
      <AddTaskDialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen} />
      <CommentsDialog open={isCommentsDialogOpen} onOpenChange={setIsCommentsDialogOpen} />
      <EditCaseDialog open={isEditCaseDialogOpen} onOpenChange={setIsEditCaseDialogOpen} initialData={caseData} onSubmit={handleEditCaseSubmit} />

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

      <main className="py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <CaseProgressCard
              progress={selectedCase?.progress}
              documentsCount={selectedCase?.documents}
              eventsCount={timeline.length}
              daysUntilTrial={selectedCase?.deadline ? Math.ceil((new Date(selectedCase.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0}
              tasksCount={0}
            />
            <CaseAIInsightsCard insights={aiInsights} onViewFullReport={handleAIReport} />
            <CaseTabsCard
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
              clientPhone=""
              clientEmail=""
              clientCases={0}
              clientSince={selectedCase?.createdAt ? new Date(selectedCase.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) : ''}
              onViewProfile={handleClientProfile}
            />
            <CaseTasksCard tasks={tasks} onAddTask={() => setIsAddTaskDialogOpen(true)} />
            <CaseFinancesCard fee={selectedCase?.fee} paidAmount={0} />
            <CaseCommentsCard commentsCount={3} onOpenComments={() => setIsCommentsDialogOpen(true)} />
          </div>
        </div>
      </main>
    </div>
  );
}
