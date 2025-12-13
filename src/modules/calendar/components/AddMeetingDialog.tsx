import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Phone,
  Users,
  AlarmClock,
  Flag,
} from 'lucide-react';
import { toast } from 'sonner';
import { useClientsStore } from '@/app/store/clients.store';
import { useMeetingsStore } from '@/app/store/meetings.store';
import { MeetingTypeEnum, MeetingPriorityEnum } from '@/app/types/calendar/calendar.enums';
import type { AddMeetingDialogProps } from '@/app/types/calendar/calendar.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { Textarea } from '@/shared/ui/textarea';

export function AddMeetingDialog({ open, onOpenChange, meeting, onSubmit }: AddMeetingDialogProps) {
  const { t } = useI18n();
  const { createMeeting, updateMeeting, loading: meetingLoading } = useMeetingsStore();
  const { clients, fetchClients, loading: clientsLoading } = useClientsStore();

  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    type: MeetingTypeEnum.IN_PERSON,
    priority: MeetingPriorityEnum.MEDIUM,
    time: '',
    duration: '60',
    location: '',
    description: '',
    reminder: '30',
  });

  useEffect(() => {
    if (open && clients.length === 0) {
      fetchClients({ limit: 100 });
    }
  }, [open, clients.length, fetchClients]);

  useEffect(() => {
    if (meeting && open) {
      setFormData({
        title: meeting.title,
        clientId: meeting.clientId,
        type: meeting.type,
        priority: meeting.priority,
        time: meeting.time,
        duration: meeting.duration,
        location: meeting.location || '',
        description: meeting.description || '',
        reminder: '30',
      });

      if (meeting.date) {
        try {
          const parsedDate = parse(meeting.date, 'yyyy-MM-dd', new Date());
          setDate(parsedDate);
        } catch (error) {
          toast.error('Error parsing meeting date:', error);
        }
      }
    } else if (!open) {
      setDate(undefined);
      setFormData({
        title: '',
        clientId: '',
        type: MeetingTypeEnum.IN_PERSON,
        priority: MeetingPriorityEnum.MEDIUM,
        time: '',
        duration: '60',
        location: '',
        description: '',
        reminder: '30',
      });
    }
  }, [meeting, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error(t('CALENDAR.FORMS.SELECT_DATE'));
      return;
    }

    if (!formData.clientId) {
      toast.error(t('CALENDAR.FORMS.SELECT_CLIENT'));
      return;
    }

    try {
      const meetingData = {
        title: formData.title,
        clientId: formData.clientId,
        date: format(date, 'yyyy-MM-dd'),
        time: formData.time,
        duration: formData.duration,
        type: formData.type,
        priority: formData.priority,
        location: formData.location || undefined,
        description: formData.description || undefined,
      };

      if (meeting?.id) {
        await updateMeeting(meeting.id, meetingData);
        toast.success(t('CALENDAR.MESSAGES.UPDATED'));
      } else {
        await createMeeting(meetingData);
        toast.success(t('CALENDAR.MESSAGES.CREATED'));
      }

      onOpenChange(false);
      onSubmit?.();
    } catch {
      toast.error(t('COMMON.MESSAGES.ERROR'));
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getClientDisplayName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return '';
    if (client.companyName) return client.companyName;
    return `${client.firstName || ''} ${client.lastName || ''}`.trim();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-background border-border shadow-2xl rounded-2xl sm:rounded-3xl p-0 flex flex-col">
        <DialogHeader className="px-4 pb-2 pt-4 flex-shrink-0 border-b border-border bg-background z-10 sticky top-0">
          <DialogTitle className="text-xl sm:text-2xl tracking-tight">
            {meeting ? t('CALENDAR.FORMS.EDIT_MEETING') : t('CALENDAR.FORMS.NEW_MEETING')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {meeting ? t('CALENDAR.FORMS.UPDATE_MEETING') : t('CALENDAR.FORMS.SCHEDULE_MEETING')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-4 pb-2 flex-1 overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground">
                  {t('CALENDAR.FORMS.TITLE')}
                </Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="h-10 sm:h-11 rounded-xl border-input text-sm"
                  placeholder={t('CALENDAR.FORMS.TITLE_PLACEHOLDER')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground">
                  {t('CALENDAR.FORMS.CLIENT')}
                </Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => handleChange('clientId', value)}
                >
                  <SelectTrigger className="h-10 sm:h-11 rounded-xl border-input text-sm">
                    <SelectValue placeholder={t('CALENDAR.FORMS.SELECT_CLIENT')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-[200px]">
                    {clientsLoading ? (
                      <SelectItem value="loading" disabled>
                        {t('COMMON.LOADING')}
                      </SelectItem>
                    ) : clients.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        {t('CALENDAR.FORMS.NO_CLIENTS')}
                      </SelectItem>
                    ) : (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {getClientDisplayName(client.id)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  <Flag className="w-4 h-4 text-muted-foreground" />
                  {t('CALENDAR.FORMS.PRIORITY')}
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleChange('priority', value)}
                >
                  <SelectTrigger className="h-10 sm:h-11 rounded-xl border-input text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value={MeetingPriorityEnum.LOW}>
                      {t('CALENDAR.PRIORITY.LOW')}
                    </SelectItem>
                    <SelectItem value={MeetingPriorityEnum.MEDIUM}>
                      {t('CALENDAR.PRIORITY.MEDIUM')}
                    </SelectItem>
                    <SelectItem value={MeetingPriorityEnum.HIGH}>
                      {t('CALENDAR.PRIORITY.HIGH')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground">
                  {t('CALENDAR.FORMS.MEETING_TYPE')}
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange('type', value)}
                >
                  <SelectTrigger className="h-10 sm:h-11 rounded-xl border-input text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value={MeetingTypeEnum.IN_PERSON}>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" /> {t('CALENDAR.MEETING_TYPE.IN_PERSON')}
                      </div>
                    </SelectItem>
                    <SelectItem value={MeetingTypeEnum.VIDEO}>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" /> {t('CALENDAR.MEETING_TYPE.VIDEO')}
                      </div>
                    </SelectItem>
                    <SelectItem value={MeetingTypeEnum.PHONE}>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {t('CALENDAR.MEETING_TYPE.PHONE')}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {t('CALENDAR.FORMS.DATE')}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 sm:h-11 w-full justify-start text-left rounded-xl border-input text-sm"
                    >
                      {date ? format(date, 'PPP', { locale: ru }) : t('CALENDAR.FORMS.SELECT_DATE')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl">
                    <Calendar selected={date} onSelect={setDate} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t('CALENDAR.FORMS.TIME')}
                </Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="h-10 sm:h-11 rounded-xl border-input text-sm"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground">
                  {t('CALENDAR.FORMS.DURATION')}
                </Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => handleChange('duration', value)}
                >
                  <SelectTrigger className="h-10 sm:h-11 rounded-xl border-input text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="15">{t('CALENDAR.FORMS.DURATION_15')}</SelectItem>
                    <SelectItem value="30">{t('CALENDAR.FORMS.DURATION_30')}</SelectItem>
                    <SelectItem value="45">{t('CALENDAR.FORMS.DURATION_45')}</SelectItem>
                    <SelectItem value="60">{t('CALENDAR.FORMS.DURATION_60')}</SelectItem>
                    <SelectItem value="90">{t('CALENDAR.FORMS.DURATION_90')}</SelectItem>
                    <SelectItem value="120">{t('CALENDAR.FORMS.DURATION_120')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  <AlarmClock className="w-4 h-4" />
                  {t('CALENDAR.FORMS.REMINDER')}
                </Label>
                <Select
                  value={formData.reminder}
                  onValueChange={(value) => handleChange('reminder', value)}
                >
                  <SelectTrigger className="h-10 sm:h-11 rounded-xl border-input text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="0">{t('CALENDAR.FORMS.REMINDER_NONE')}</SelectItem>
                    <SelectItem value="15">{t('CALENDAR.FORMS.REMINDER_15')}</SelectItem>
                    <SelectItem value="30">{t('CALENDAR.FORMS.REMINDER_30')}</SelectItem>
                    <SelectItem value="60">{t('CALENDAR.FORMS.REMINDER_60')}</SelectItem>
                    <SelectItem value="1440">{t('CALENDAR.FORMS.REMINDER_1440')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {(formData.type === MeetingTypeEnum.IN_PERSON ||
              formData.type === MeetingTypeEnum.VIDEO) && (
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {formData.type === MeetingTypeEnum.VIDEO
                    ? t('CALENDAR.FORMS.LINK_OR_LOCATION')
                    : t('CALENDAR.FORMS.LINK_OR_LOCATION_ALT')}
                </Label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="h-10 sm:h-11 rounded-xl border-input text-sm"
                  placeholder={
                    formData.type === MeetingTypeEnum.VIDEO
                      ? t('CALENDAR.FORMS.LINK_PLACEHOLDER')
                      : t('CALENDAR.FORMS.LOCATION_PLACEHOLDER')
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm text-muted-foreground">
                {t('CALENDAR.MEETING_DETAILS.DESCRIPTION')}
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="min-h-[80px] rounded-xl border-input text-sm resize-none"
                placeholder={t('CALENDAR.FORMS.DESCRIPTION_PLACEHOLDER')}
              />
            </div>
          </div>

          <div className="px-4 py-4 w-full flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-border bg-background sticky bottom-0 z-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 sm:h-11 w-full sm:w-1/3 rounded-xl border-input text-sm"
            >
              {t('COMMON.ACTIONS.CANCEL')}
            </Button>

            <Button
              type="submit"
              disabled={meetingLoading}
              className="h-10 sm:h-11 w-full sm:w-1/3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm"
            >
              {meetingLoading
                ? t('COMMON.LOADING')
                : meeting
                  ? t('CALENDAR.FORMS.UPDATE_MEETING')
                  : t('CALENDAR.FORMS.CREATE_MEETING')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
