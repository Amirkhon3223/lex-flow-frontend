import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export function CaseDetailView() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const onBack = () => window.history.back();

  const [isUploadDocumentDialogOpen, setIsUploadDocumentDialogOpen] = useState(false);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const [isEditCaseDialogOpen, setIsEditCaseDialogOpen] = useState(false);

  const clientId = 1;

  const caseData = {
    title: 'Трудовой спор - незаконное увольнение',
    client: 'client1',
    category: 'labor',
    deadline: '2025-10-20',
    fee: '75000',
    description: 'Дело о незаконном увольнении работника',
    priority: 'high',
  };

  const documents: CaseDocumentInterface[] = [
    {
      id: 1,
      name: 'Исковое заявление.pdf',
      size: '2.4 MB',
      date: '12 окт 2025',
      versions: 3,
      status: DocumentStatusEnum.FINAL,
    },
    {
      id: 2,
      name: 'Трудовой договор.pdf',
      size: '1.8 MB',
      date: '10 окт 2025',
      versions: 2,
      status: DocumentStatusEnum.REVIEW,
    },
    {
      id: 3,
      name: 'Приказ об увольнении.pdf',
      size: '856 KB',
      date: '8 окт 2025',
      versions: 1,
      status: DocumentStatusEnum.DRAFT,
    },
  ];

  const timeline: TimelineEventInterface[] = [
    {
      date: '15 окт 2025, 14:30',
      title: 'Документ отправлен клиенту',
      description: 'Исковое заявление.pdf',
      type: TimelineEventTypeEnum.DOCUMENT,
    },
    {
      date: '14 окт 2025, 11:00',
      title: 'Встреча с клиентом',
      description: 'Обсуждение стратегии защиты',
      type: TimelineEventTypeEnum.MEETING,
    },
    {
      date: '12 окт 2025, 16:45',
      title: 'Создан новый документ',
      description: 'Исковое заявление.pdf (версия 3)',
      type: TimelineEventTypeEnum.DOCUMENT,
    },
    {
      date: '10 окт 2025, 09:15',
      title: 'Дело создано',
      description: 'Трудовой спор - незаконное увольнение',
      type: TimelineEventTypeEnum.SYSTEM,
    },
  ];

  const tasks: CaseTaskInterface[] = [
    { id: 1, title: 'Подготовить возражение на иск', completed: true },
    { id: 2, title: 'Собрать доказательства', completed: true },
    { id: 3, title: 'Встретиться с клиентом', completed: false },
    { id: 4, title: 'Подать документы в суд', completed: false },
  ];

  const aiInsights: AIInsightInterface[] = [
    {
      type: AIInsightTypeEnum.RISK,
      title: 'Выявлен риск',
      description: 'Отсутствует уведомление о сокращении за 2 месяца',
      priority: AIInsightPriorityEnum.HIGH,
    },
    {
      type: AIInsightTypeEnum.OPPORTUNITY,
      title: 'Сильная позиция',
      description: 'Есть свидетели нарушения процедуры увольнения',
      priority: AIInsightPriorityEnum.MEDIUM,
    },
    {
      type: AIInsightTypeEnum.DEADLINE,
      title: 'Приближается срок',
      description: 'Подача в суд через 5 дней',
      priority: AIInsightPriorityEnum.HIGH,
    },
  ];

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
    const subject = t('CASES.SHARE_CASE');
    const body = `${t('CASES.CHECK_THIS_CASE')}: ${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div>
      <UploadDocumentDialog open={isUploadDocumentDialogOpen} onOpenChange={setIsUploadDocumentDialogOpen} />
      <AddTaskDialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen} />
      <CommentsDialog open={isCommentsDialogOpen} onOpenChange={setIsCommentsDialogOpen} />
      <EditCaseDialog open={isEditCaseDialogOpen} onOpenChange={setIsEditCaseDialogOpen} initialData={caseData} />

      <CaseHeader
        onBack={onBack}
        onCopyLink={handleCopyLink}
        onShareEmail={handleShareEmail}
        onEdit={() => setIsEditCaseDialogOpen(true)}
        onAddDocument={() => setIsUploadDocumentDialogOpen(true)}
      />

      <main className="py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <CaseProgressCard />
            <CaseAIInsightsCard insights={aiInsights} onViewFullReport={handleAIReport} />
            <CaseTabsCard
              documents={documents}
              timeline={timeline}
              onDocumentClick={handleDocumentClick}
              onDownloadDocument={handleDownloadDocument}
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <CaseClientCard onViewProfile={handleClientProfile} />
            <CaseTasksCard tasks={tasks} onAddTask={() => setIsAddTaskDialogOpen(true)} />
            <CaseFinancesCard />
            <CaseCommentsCard commentsCount={3} onOpenComments={() => setIsCommentsDialogOpen(true)} />
          </div>
        </div>
      </main>
    </div>
  );
}
