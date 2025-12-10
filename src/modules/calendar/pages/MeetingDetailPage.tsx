import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMeetingsStore } from '@/app/store/meetings.store';
import { MeetingStatusEnum } from '@/app/types/calendar/calendar.enums';
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { selectedMeeting, loading, fetchMeetingById, updateMeeting, deleteMeeting } =
    useMeetingsStore();

  const [isEditingOpen, setIsEditingOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMeetingById(id);
    }
  }, [id, fetchMeetingById]);

  if (loading || !selectedMeeting) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('COMMON.LOADING')}</p>
      </div>
    );
  }

  const meeting = selectedMeeting;

  const handleComplete = async () => {
    if (!id) return;
    try {
      await updateMeeting(id, { status: MeetingStatusEnum.COMPLETED });
      toast.success(t('CALENDAR.MESSAGES.COMPLETED'));
      navigate('/calendar');
    } catch (error) {
      toast.error(t('COMMON.MESSAGES.ERROR'));
    }
  };

  const handleReschedule = () => {
    setIsRescheduleOpen(true);
  };

  const handleCancel = () => {
    setIsCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!id) return;
    try {
      await updateMeeting(id, { status: MeetingStatusEnum.CANCELLED });
      toast.success(t('CALENDAR.MESSAGES.CANCELLED'));
      navigate('/calendar');
    } catch (error) {
      toast.error(t('COMMON.MESSAGES.ERROR'));
    }
  };

  const handleEdit = () => {
    setIsEditingOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!id) return;
    try {
      await deleteMeeting(id);
      toast.success(t('COMMON.MESSAGES.DELETED'));
      navigate('/calendar');
    } catch (error) {
      toast.error(t('COMMON.MESSAGES.ERROR'));
    }
  };

  return (
    <div>
      <UploadDocumentDialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen} />
      <CommentsDialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen} caseId={id} />
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
          <MeetingParticipantsCard
            participants={
              meeting.participants ? meeting.participants.split(',').map((p) => p.trim()) : []
            }
          />
          <MeetingNotesCard onAddNote={() => setIsAddNoteOpen(true)} />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <MeetingClientCard
            clientName={meeting.clientName}
            clientAvatar={meeting.clientAvatar}
            clientId={meeting.clientId}
          />
          {meeting.caseName && (
            <MeetingCaseCard caseName={meeting.caseName} caseId={meeting.caseId} />
          )}
          <MeetingDocumentsCard onAddDocument={() => setIsAddDocumentOpen(true)} />
          <QuickActionsCard
            onComplete={handleComplete}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
