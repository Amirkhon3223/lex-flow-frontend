import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MeetingTypeEnum, MeetingStatusEnum, MeetingPriorityEnum } from '@/app/types/calendar/calendar.enums';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { AddMeetingDialog } from '@/modules/calendar/components/AddMeetingDialog';
import { MeetingCaseCard } from '@/modules/calendar/components/MeetingCaseCard';
import { MeetingClientCard } from '@/modules/calendar/components/MeetingClientCard';
import { MeetingDocumentsCard } from '@/modules/calendar/components/MeetingDocumentsCard';
import { MeetingHeader } from '@/modules/calendar/components/MeetingHeader';
import { MeetingInfoCard } from '@/modules/calendar/components/MeetingInfoCard';
import { MeetingNotesCard } from '@/modules/calendar/components/MeetingNotesCard';
import { MeetingParticipantsCard } from '@/modules/calendar/components/MeetingParticipantsCard';
import { QuickActionsCard } from '@/modules/calendar/ui/QuickActionsCard';
import { CommentsDialog } from '@/shared/components/CommentsDialog';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { useI18n } from '@/shared/context/I18nContext';

export function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [isEditingOpen, setIsEditingOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const meeting: MeetingInterface = {
    id: Number(id),
    title: 'Консультация по трудовому спору',
    client: { name: 'Иванов П.А.', avatar: 'ИП' },
    case: 'Трудовой спор - незаконное увольнение',
    date: new Date(2025, 9, 15, 10, 0),
    time: '10:00',
    duration: '1 час',
    type: MeetingTypeEnum.IN_PERSON,
    location: 'Офис, кабинет 305',
    status: MeetingStatusEnum.SCHEDULED,
    priority: MeetingPriorityEnum.HIGH,
    description:
      'Первичная консультация клиента по вопросу незаконного увольнения. Необходимо обсудить обстоятельства дела, собрать документы и определить дальнейшую стратегию.',
    participants: ['Иванов П.А.', 'Петров А.С. (юрист)'],
  };

  const handleComplete = () => {
    console.log(t('CALENDAR.MESSAGES.COMPLETED'), 'ID:', id);
    toast.success(t('CALENDAR.MESSAGES.COMPLETED'));
    navigate('/calendar');
  };

  const handleReschedule = () => {
    setIsRescheduleOpen(true);
  };

  const handleCancel = () => {
    setIsCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    console.log(t('CALENDAR.MESSAGES.CANCELLED'), 'ID:', id);
    toast.success(t('CALENDAR.MESSAGES.CANCELLED'));
    navigate('/calendar');
  };

  const handleEdit = () => {
    setIsEditingOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log(t('CALENDAR.MESSAGES.CANCELLED'), 'ID:', id);
    toast.success(t('CALENDAR.MESSAGES.CANCELLED'));
    navigate('/calendar');
  };

  return (
    <div>
      <UploadDocumentDialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen} />
      <CommentsDialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen} />
      <AddMeetingDialog open={isEditingOpen} onOpenChange={setIsEditingOpen} />
      <AddMeetingDialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen} />

      <ConfirmDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        title={`${t('CALENDAR.ACTIONS.CANCEL')}?`}
        description={t('COMMON.MESSAGES.CONFIRM_DELETE')}
        confirmText={t('COMMON.ACTIONS.DELETE')}
        cancelText={t('COMMON.ACTIONS.CANCEL')}
        onConfirm={confirmCancel}
        variant="destructive"
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`${t('COMMON.ACTIONS.DELETE')} ${t('CALENDAR.MEETINGS')}?`}
        description={t('COMMON.MESSAGES.CONFIRM_DELETE')}
        confirmText={t('COMMON.ACTIONS.DELETE')}
        cancelText={t('COMMON.ACTIONS.CANCEL')}
        onConfirm={confirmDelete}
        variant="destructive"
      />

      <MeetingHeader meeting={meeting} onEdit={handleEdit} onDelete={handleDelete} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <MeetingInfoCard meeting={meeting} />
          <MeetingParticipantsCard participants={meeting.participants || []} />
          <MeetingNotesCard onAddNote={() => setIsAddNoteOpen(true)} />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <MeetingClientCard client={meeting.client} />
          {meeting.case && <MeetingCaseCard caseName={meeting.case} />}
          <MeetingDocumentsCard onAddDocument={() => setIsAddDocumentOpen(true)} />
          <QuickActionsCard onComplete={handleComplete} onReschedule={handleReschedule} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
