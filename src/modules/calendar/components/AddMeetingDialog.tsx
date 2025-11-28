import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Phone, Users, AlarmClock } from 'lucide-react';
import type { AddMeetingDialogProps } from '@/app/types/calendar/calendar.interfaces';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { Textarea } from '@/shared/ui/textarea';
import { useI18n } from '@/shared/context/I18nContext';

export function AddMeetingDialog({ open, onOpenChange }: AddMeetingDialogProps) {
  const { t } = useI18n();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    type: 'in_person',
    time: '',
    duration: '60',
    location: '',
    notes: '',
    reminder: '30',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);

    setDate(undefined);
    setFormData({
      title: '',
      type: 'in_person',
      time: '',
      duration: '60',
      location: '',
      notes: '',
      reminder: '30',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-background border-border shadow-2xl rounded-2xl sm:rounded-3xl p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
          <DialogTitle className="text-xl sm:text-2xl tracking-tight">{t('CALENDAR.FORMS.NEW_MEETING')}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {t('CALENDAR.FORMS.SCHEDULE_MEETING')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-4 sm:px-8 pb-6 sm:pb-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs sm:text-sm text-muted-foreground">
                {t('CALENDAR.FORMS.TITLE')}
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="h-10 sm:h-11 rounded-xl border-input focus-visible:ring-blue-500 text-sm"
                placeholder={t('CALENDAR.FORMS.TITLE_PLACEHOLDER')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-xs sm:text-sm text-muted-foreground">
                {t('CALENDAR.FORMS.MEETING_TYPE')}
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger className="h-10 sm:h-11 rounded-xl border-input focus:ring-blue-500 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="in_person">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" strokeWidth={2} />
                      <span>{t('CALENDAR.MEETING_TYPE.IN_PERSON')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" strokeWidth={2} />
                      <span>{t('CALENDAR.MEETING_TYPE.VIDEO')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" strokeWidth={2} />
                      <span>{t('CALENDAR.MEETING_TYPE.PHONE')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-border" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" strokeWidth={2} />
                  {t('CALENDAR.FORMS.DATE')}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 sm:h-11 w-full justify-start text-left rounded-xl border-input hover:bg-muted text-sm"
                    >
                      {date ? format(date, 'PPP', { locale: ru }) : t('CALENDAR.FORMS.SELECT_DATE')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                    <Calendar
                      selected={date}
                      onSelect={setDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" strokeWidth={2} />
                  {t('CALENDAR.FORMS.TIME')}
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="h-10 sm:h-11 rounded-xl border-input focus-visible:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-xs sm:text-sm text-muted-foreground">
                  {t('CALENDAR.FORMS.DURATION')}
                </Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => handleChange('duration', value)}
                >
                  <SelectTrigger className="h-10 sm:h-11 rounded-xl border-input focus:ring-blue-500 text-sm">
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
                <Label htmlFor="reminder" className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  <AlarmClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" strokeWidth={2} />
                  {t('CALENDAR.FORMS.REMINDER')}
                </Label>
                <Select
                  value={formData.reminder}
                  onValueChange={(value) => handleChange('reminder', value)}
                >
                  <SelectTrigger className="h-10 sm:h-11 rounded-xl border-input focus:ring-blue-500 text-sm">
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

            <Separator className="bg-border" />

            {(formData.type === 'in_person' || formData.type === 'video') && (
              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" strokeWidth={2} />
                  {formData.type === 'video' ? t('CALENDAR.FORMS.LINK_OR_LOCATION') : t('CALENDAR.FORMS.LINK_OR_LOCATION_ALT')}
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="h-10 sm:h-11 rounded-xl border-input focus-visible:ring-blue-500 text-sm"
                  placeholder={
                    formData.type === 'video'
                      ? t('CALENDAR.FORMS.LINK_PLACEHOLDER')
                      : t('CALENDAR.FORMS.LOCATION_PLACEHOLDER')
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-xs sm:text-sm text-muted-foreground">
                {t('CALENDAR.MEETING_DETAILS.NOTES')}
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="min-h-[60px] sm:min-h-[80px] rounded-xl border-input focus-visible:ring-blue-500 resize-none text-sm"
                placeholder={t('CALENDAR.FORMS.DESCRIPTION_PLACEHOLDER')}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:flex-1 h-10 sm:h-11 rounded-xl border-input hover:bg-muted text-sm order-2 sm:order-1"
            >
              {t('COMMON.ACTIONS.CANCEL')}
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 h-10 sm:h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md text-sm order-1 sm:order-2"
            >
              {t('CALENDAR.FORMS.CREATE_MEETING')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
