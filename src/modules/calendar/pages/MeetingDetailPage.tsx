import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Users,
  Edit,
  Trash2,
  Check,
  X,
  FileText,
  MessageSquare,
  Briefcase,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { MeetingTypeEnum, MeetingStatusEnum, MeetingPriorityEnum } from '@/app/types/calendar/calendar.enums';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { AddMeetingDialog } from '@/modules/calendar/components/AddMeetingDialog';
import { CommentsDialog } from '@/shared/components/CommentsDialog';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditingOpen, setIsEditingOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const handleComplete = () => {
    // TODO: Обновить статус встречи на COMPLETED в API
    console.log('Встреча отмечена как завершённая, ID:', id);
    navigate('/calendar');
  };

  const handleReschedule = () => {
    setIsRescheduleOpen(true);
  };

  const handleCancel = () => {
    if (confirm('Вы уверены, что хотите отменить встречу?')) {
      // TODO: Отменить встречу в API
      console.log('Встреча отменена, ID:', id);
      navigate('/calendar');
    }
  };

  const handleEdit = () => {
    setIsEditingOpen(true);
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить встречу?')) {
      // TODO: Удалить встречу
      navigate('/calendar');
    }
  };

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
    description: 'Первичная консультация клиента по вопросу незаконного увольнения. Необходимо обсудить обстоятельства дела, собрать документы и определить дальнейшую стратегию.',
    participants: ['Иванов П.А.', 'Петров А.С. (юрист)'],
  };

  const getMeetingTypeIcon = (type: MeetingInterface['type']) => {
    switch (type) {
      case MeetingTypeEnum.VIDEO:
        return <Video className="w-5 h-5" strokeWidth={2} />;
      case MeetingTypeEnum.PHONE:
        return <Phone className="w-5 h-5" strokeWidth={2} />;
      default:
        return <Users className="w-5 h-5" strokeWidth={2} />;
    }
  };

  const getMeetingTypeColor = (type: MeetingInterface['type']) => {
    switch (type) {
      case MeetingTypeEnum.VIDEO:
        return 'bg-purple-100 text-purple-700';
      case MeetingTypeEnum.PHONE:
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getMeetingTypeLabel = (type: MeetingInterface['type']) => {
    switch (type) {
      case MeetingTypeEnum.VIDEO:
        return 'Видеовстреча';
      case MeetingTypeEnum.PHONE:
        return 'Телефонный звонок';
      default:
        return 'Личная встреча';
    }
  };

  const getPriorityColor = (priority?: MeetingInterface['priority']) => {
    switch (priority) {
      case MeetingPriorityEnum.HIGH:
        return 'bg-red-100 text-red-700';
      case MeetingPriorityEnum.MEDIUM:
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityLabel = (priority?: MeetingInterface['priority']) => {
    switch (priority) {
      case MeetingPriorityEnum.HIGH:
        return 'Высокий приоритет';
      case MeetingPriorityEnum.MEDIUM:
        return 'Средний приоритет';
      default:
        return 'Низкий приоритет';
    }
  };

  return (
    <div>
      <UploadDocumentDialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen} />
      <CommentsDialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen} />
      <AddMeetingDialog open={isEditingOpen} onOpenChange={setIsEditingOpen} />
      <AddMeetingDialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200/50 rounded-xl mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl tracking-tight mb-1">{meeting.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" strokeWidth={2} />
                  {meeting.date.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" strokeWidth={2} />
                  {meeting.time}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="rounded-xl border-gray-200"
              >
                <Edit className="w-4 h-4 mr-2" strokeWidth={2} />
                Редактировать
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                Удалить
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2">
            <Badge className={`${getMeetingTypeColor(meeting.type)} border-0`}>
              {getMeetingTypeIcon(meeting.type)}
              <span className="ml-1.5">{getMeetingTypeLabel(meeting.type)}</span>
            </Badge>
            {meeting.priority && (
              <Badge className={`${getPriorityColor(meeting.priority)} border-0`}>
                {getPriorityLabel(meeting.priority)}
              </Badge>
            )}
            {meeting.status === MeetingStatusEnum.COMPLETED && (
              <Badge className="bg-green-100 text-green-700 border-0">
                <Check className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                Завершено
              </Badge>
            )}
            {meeting.status === MeetingStatusEnum.CANCELLED && (
              <Badge className="bg-gray-100 text-gray-700 border-0">
                <X className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                Отменено
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Meeting Info */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Информация о встрече</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Длительность</div>
                      <div className="font-medium">{meeting.duration}</div>
                    </div>
                  </div>
                </div>

                {meeting.location && (
                  <div className="p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-600" strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Место</div>
                        <div className="font-medium">{meeting.location}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {meeting.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Описание</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{meeting.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participants */}
          {meeting.participants && meeting.participants.length > 0 && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Участники</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meeting.participants.map((participant, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                          {participant
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{participant}</div>
                        <div className="text-xs text-gray-500">Участник</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Заметки</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setIsAddNoteOpen(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" strokeWidth={2} />
                  Добавить заметку
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-8 h-8 text-gray-400" strokeWidth={2} />
                </div>
                <p className="text-sm text-gray-500">Заметок пока нет</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Клиент</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/clients/${meeting.client.name}`)}
              >
                <Avatar className="w-12 h-12 ring-2 ring-gray-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {meeting.client.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{meeting.client.name}</div>
                  <div className="text-sm text-gray-500">Посмотреть профиль →</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Case */}
          {meeting.case && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Связанное дело</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-blue-600" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1">{meeting.case}</div>
                      <div className="text-xs text-gray-500">Посмотреть дело →</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Документы</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setIsAddDocumentOpen(true)}
                >
                  <FileText className="w-4 h-4 mr-2" strokeWidth={2} />
                  Добавить
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-7 h-7 text-gray-400" strokeWidth={2} />
                </div>
                <p className="text-sm text-gray-500">Документов нет</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg tracking-tight mb-4">Быстрые действия</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 rounded-xl"
                  onClick={handleComplete}
                >
                  <Check className="w-4 h-4 mr-2" strokeWidth={2} />
                  Отметить как завершённую
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 rounded-xl"
                  onClick={handleReschedule}
                >
                  <Calendar className="w-4 h-4 mr-2" strokeWidth={2} />
                  Перенести встречу
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 rounded-xl"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4 mr-2" strokeWidth={2} />
                  Отменить встречу
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
