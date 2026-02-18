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
import { CaseTimeTrackingCard } from '@/modules/cases/components/CaseTimeTrackingCard';
import { CasePartiesCard } from '@/modules/cases/components/CasePartiesCard';
import CaseDeadlinesCard from '@/modules/cases/components/CaseDeadlinesCard';
import { EditCaseDialog } from '@/modules/cases/ui/EditCaseDialog';
import { AddTaskDialog } from '@/shared/components/AddTaskDialog';
import { CommentsDialog } from '@/shared/components/CommentsDialog';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { useI18n } from '@/shared/context/I18nContext';
import { useHighlightItem } from '@/shared/hooks/useHighlightItem';
import { parseLocalDate } from '@/shared/utils';
import { cn } from '@/shared/ui/utils';

export function CaseDetailView() {
  const { id = '' } = useParams<{ id: string }>();
  const { isHighlighted } = useHighlightItem();

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
    timeEntries,
    timeEntriesLoading,
    timeEntriesTotalDuration,
    timeEntriesTotalBillable,
    fetchTimeEntries,
    parties,
    partiesLoading,
    fetchParties,
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
        fetchTimeEntries(id),
        fetchParties(id),
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

  const handlePrint = () => {
    if (!selectedCase) return;

    const statusLabels: Record<string, string> = {
      new: t('COMMON.STATUS.NEW'),
      in_progress: t('COMMON.STATUS.IN_PROGRESS'),
      waiting: t('COMMON.STATUS.WAITING'),
      closed: t('COMMON.STATUS.CLOSED'),
      won: t('COMMON.STATUS.WON'),
      lost: t('COMMON.STATUS.LOST'),
      settled: t('COMMON.STATUS.SETTLED'),
    };

    const priorityLabels: Record<string, string> = {
      low: t('COMMON.PRIORITY.LOW'),
      medium: t('COMMON.PRIORITY.MEDIUM'),
      high: t('COMMON.PRIORITY.HIGH'),
      urgent: t('COMMON.PRIORITY.URGENT'),
    };

    const categoryLabels: Record<string, string> = {
      labor: t('CASES.CATEGORIES.LABOR'),
      civil: t('CASES.CATEGORIES.CIVIL'),
      family: t('CASES.CATEGORIES.FAMILY'),
      inheritance: t('CASES.CATEGORIES.INHERITANCE'),
      contract: t('CASES.CATEGORIES.CONTRACT'),
      corporate: t('CASES.CATEGORIES.CORPORATE'),
    };

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formatDate = (date: string | Date | undefined) => {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('ru-RU');
    };

    const formatCurrency = (amount: number) => {
      return amount.toLocaleString('ru-RU') + ' ₽';
    };

    const tasksHtml = tasks.length > 0 ? `
      <h2 style="margin-top: 30px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb;">${t('CASES.TABS.TASKS')}</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">${t('TASKS.TASK_TITLE')}</th>
            <th style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${t('COMMON.STATUS.STATUS')}</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">${t('CASES.FIELDS.DEADLINE')}</th>
          </tr>
        </thead>
        <tbody>
          ${tasks.map(task => `
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${task.title}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">
                ${task.completed ? '✅' : '⬜'}
              </td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${formatDate(task.createdAt)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '';

    const documentsHtml = caseDocuments.length > 0 ? `
      <h2 style="margin-top: 30px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb;">${t('CASES.TABS.DOCUMENTS')}</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">${t('DOCUMENTS.FIELDS.NAME')}</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">${t('DOCUMENTS.FIELDS.SIZE')}</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">${t('COMMON.CREATED_AT')}</th>
          </tr>
        </thead>
        <tbody>
          ${caseDocuments.map(doc => `
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${doc.name}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">${doc.size}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${doc.date}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '';

    const timelineHtml = timeline.length > 0 ? `
      <h2 style="margin-top: 30px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb;">${t('CASES.TABS.TIMELINE')}</h2>
      <div style="margin-top: 15px;">
        ${timeline.map(event => `
          <div style="padding: 12px; margin-bottom: 10px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #3b82f6;">
            <div style="font-weight: 600; color: #111827;">${event.title}</div>
            <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">${event.description || ''}</div>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 6px;">${formatDate(event.eventDate)}</div>
          </div>
        `).join('')}
      </div>
    ` : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${t('CASES.CASE_REPORT')} - ${selectedCase.title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #1f2937; }
          h1 { color: #111827; margin-bottom: 5px; }
          .subtitle { color: #6b7280; margin-bottom: 30px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .date { color: #6b7280; font-size: 14px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 10px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .info-item { }
          .info-label { font-size: 12px; color: #6b7280; }
          .info-value { font-size: 15px; color: #111827; font-weight: 500; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 25px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
          .stat { text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .stat-label { font-size: 12px; color: #6b7280; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
          .badge-status { background: #dbeafe; color: #1d4ed8; }
          .badge-priority { background: #fef3c7; color: #92400e; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">LexFlow</div>
          <div class="date">${formatDate(new Date())}</div>
        </div>

        <h1>${selectedCase.title}</h1>
        <div class="subtitle">
          <span class="badge badge-status">${statusLabels[selectedCase.status] || selectedCase.status}</span>
          <span class="badge badge-priority" style="margin-left: 8px;">${priorityLabels[selectedCase.priority] || selectedCase.priority}</span>
        </div>

        <div class="stats">
          <div class="stat">
            <div class="stat-value">${selectedCase.progress || 0}%</div>
            <div class="stat-label">${t('CASES.FIELDS.PROGRESS')}</div>
          </div>
          <div class="stat">
            <div class="stat-value">${caseDocuments.length}</div>
            <div class="stat-label">${t('DOCUMENTS.TITLE')}</div>
          </div>
          <div class="stat">
            <div class="stat-value">${tasks.length}</div>
            <div class="stat-label">${t('CASES.TABS.TASKS')}</div>
          </div>
          <div class="stat">
            <div class="stat-value">${formatCurrency(selectedCase.fee || 0)}</div>
            <div class="stat-label">${t('CASES.FIELDS.FEE')}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">${t('CASES.DETAIL.OVERVIEW')}</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">${t('CASES.FIELDS.CLIENT')}</div>
              <div class="info-value">${selectedCase.clientName || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">${t('CASES.FIELDS.CATEGORY')}</div>
              <div class="info-value">${categoryLabels[selectedCase.category] || selectedCase.category}</div>
            </div>
            <div class="info-item">
              <div class="info-label">${t('CASES.FIELDS.DEADLINE')}</div>
              <div class="info-value">${formatDate(selectedCase.deadline)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">${t('CASES.FIELDS.COURT_DATE')}</div>
              <div class="info-value">${formatDate(selectedCase.courtDate)}</div>
            </div>
            <div class="info-item" style="grid-column: span 2;">
              <div class="info-label">${t('CASES.FIELDS.DESCRIPTION')}</div>
              <div class="info-value">${selectedCase.description || '-'}</div>
            </div>
          </div>
        </div>

        ${tasksHtml}
        ${documentsHtml}
        ${timelineHtml}

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
          ${t('CASES.REPORT_GENERATED')} LexFlow • ${formatDate(new Date())}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

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
    <div
      id={id ? `highlight-${id}` : undefined}
      className={cn(id && isHighlighted(id) && 'animate-highlight')}
    >
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
        onPrint={handlePrint}
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
              category={selectedCase?.category || ''}
              onAddTask={() => setIsAddTaskDialogOpen(true)}
              onTasksChanged={() => fetchTasks(id)}
            />

            <CaseTimeTrackingCard
              caseId={id}
              timeEntries={timeEntries}
              totalDuration={timeEntriesTotalDuration}
              totalBillable={timeEntriesTotalBillable}
              loading={timeEntriesLoading}
              defaultHourlyRate={selectedCase?.hourlyRate ?? 0}
            />

            <CasePartiesCard
              caseId={id}
              parties={parties}
              loading={partiesLoading}
            />

            <CaseDeadlinesCard
              caseId={id}
              jurisdiction={selectedCase?.jurisdiction}
              category={selectedCase?.category}
            />

            <CaseFinancesCard
              fee={selectedCase?.fee}
              paidAmount={selectedCase?.paidAmount ?? 0}
              billingMethod={selectedCase?.billingMethod}
              totalHours={selectedCase?.totalHours}
              billableAmount={selectedCase?.billableAmount}
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
