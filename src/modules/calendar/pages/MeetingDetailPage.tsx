import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Edit,
  Trash2,
  FileText,
  MessageSquare,
  Briefcase,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MeetingTypeEnum, MeetingStatusEnum, MeetingPriorityEnum } from '@/app/types/calendar/calendar.enums';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { AddMeetingDialog } from '@/modules/calendar/components/AddMeetingDialog';
import { EmptyState } from '@/modules/calendar/ui/EmptyState';
import { InfoBlock } from '@/modules/calendar/ui/InfoBlock';
import { MeetingBadges } from '@/modules/calendar/ui/MeetingBadges';
import { ParticipantItem } from '@/modules/calendar/ui/ParticipantItem';
import { QuickActionsCard } from '@/modules/calendar/ui/QuickActionsCard';
import { CommentsDialog } from '@/shared/components/CommentsDialog';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    console.log('Встреча отмечена как завершённая, ID:', id);
    toast.success('Встреча отмечена как завершённая');
    navigate('/calendar');
  };

  const handleReschedule = () => {
    setIsRescheduleOpen(true);
  };

  const handleCancel = () => {
    setIsCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    console.log('Встреча отменена, ID:', id);
    toast.success('Встреча отменена');
    navigate('/calendar');
  };

  const handleEdit = () => {
    setIsEditingOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Встреча удалена, ID:', id);
    toast.success('Встреча удалена');
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
        title="Отменить встречу?"
        description="Вы уверены, что хотите отменить эту встречу? Это действие можно будет отменить позже."
        confirmText="Да, отменить"
        cancelText="Не отменять"
        onConfirm={confirmCancel}
        variant="destructive"
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Удалить встречу?"
        description="Вы уверены, что хотите удалить эту встречу? Это действие нельзя будет отменить."
        confirmText="Да, удалить"
        cancelText="Не удалять"
        onConfirm={confirmDelete}
        variant="destructive"
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200/50 rounded-xl mb-4 sm:mb-6">
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" strokeWidth={2} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tight mb-0.5 sm:mb-1 truncate">
                {meeting.title}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 text-xs sm:text-xs md:text-sm text-gray-500">
                <span className="flex items-center gap-1 sm:gap-1 md:gap-1.5">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" strokeWidth={2} />
                  {meeting.date.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1 sm:gap-1 md:gap-1.5">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" strokeWidth={2} />
                  {meeting.time}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="rounded-lg sm:rounded-xl border-gray-200 text-xs h-7 sm:h-8 md:h-9 px-2 sm:px-3"
              >
                <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 md:mr-2" strokeWidth={2} />
                <span className="hidden md:inline">Редактировать</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="rounded-lg sm:rounded-xl border-red-200 text-red-600 hover:bg-red-50 text-xs h-7 sm:h-8 md:h-9 px-2 sm:px-3"
              >
                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 md:mr-2" strokeWidth={2} />
                <span className="hidden md:inline">Удалить</span>
              </Button>
            </div>
          </div>

          <MeetingBadges type={meeting.type} priority={meeting.priority} status={meeting.status} />
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Meeting Info */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">Информация о встрече</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <InfoBlock
                  icon={<Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600" strokeWidth={2} />}
                  iconBgColor="bg-blue-100"
                  label="Длительность"
                  value={meeting.duration}
                />

                {meeting.location && (
                  <InfoBlock
                    icon={
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-600" strokeWidth={2} />
                    }
                    iconBgColor="bg-purple-100"
                    label="Место"
                    value={meeting.location}
                  />
                )}
              </div>

              {meeting.description && (
                <div>
                  <h4 className="text-md font-bold text-gray-700 mb-1.5 sm:mb-2">Описание</h4>
                  <p className="text-md text-gray-600 leading-relaxed">{meeting.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participants */}
          {!!meeting.participants?.length && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 ">
                <CardTitle className="text-sm sm:text-base md:text-lg">Участники</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 md:px-6">
                <div className="space-y-2 sm:space-y-3">
                  {meeting.participants.map((participant, index) => (
                    <ParticipantItem key={index} name={participant} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 ">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm sm:text-base md:text-lg min-w-0">Заметки</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-lg sm:rounded-xl text-xs h-7 sm:h-8 px-2 sm:px-3 flex-shrink-0"
                  onClick={() => setIsAddNoteOpen(true)}
                >
                  <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 sm:mr-2" strokeWidth={2} />
                  <span className="hidden sm:inline">Добавить заметку</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6">
              <EmptyState
                icon={<MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" strokeWidth={2} />}
                message="Заметок пока нет"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          {/* Client Info */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 ">
              <CardTitle className="text-sm sm:text-base md:text-lg">Клиент</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6">
              <div
                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/clients/${meeting.client.name}`)}
              >
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-gray-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                    {meeting.client.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base">{meeting.client.name}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Посмотреть профиль →</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Case */}
          {meeting.case && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 ">
                <CardTitle className="text-sm sm:text-base md:text-lg">Связанное дело</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 md:px-6">
                <div
                  className="p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/cases/1')}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs sm:text-sm mb-1">{meeting.case}</div>
                      <div className="text-xs text-gray-500">Посмотреть дело →</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 ">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm sm:text-base md:text-lg min-w-0 truncate">Документы</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-lg sm:rounded-xl text-xs h-7 sm:h-8 px-2 sm:px-3 flex-shrink-0"
                  onClick={() => setIsAddDocumentOpen(true)}
                >
                  <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 sm:mr-2" strokeWidth={2} />
                  <span className="hidden sm:inline">Добавить</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6">
              <div className="rounded-xl bg-gray-50">
                <EmptyState
                  icon={<FileText className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" strokeWidth={2} />}
                  message="Документов нет"
                  size="sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <QuickActionsCard onComplete={handleComplete} onReschedule={handleReschedule} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
