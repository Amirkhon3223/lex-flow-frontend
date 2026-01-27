import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';
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

interface RescheduleMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDate?: string;
  currentTime?: string;
  onReschedule: (date: string, time: string) => Promise<void>;
}

export function RescheduleMeetingDialog({
  open,
  onOpenChange,
  currentDate,
  currentTime,
  onReschedule,
}: RescheduleMeetingDialogProps) {
  const { t } = useI18n();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (currentDate) {
        try {
          const parsedDate = parse(currentDate, 'yyyy-MM-dd', new Date());
          setDate(parsedDate);
        } catch {
          // Invalid date format - use default
        }
      }
      setTime(currentTime || '');
    }
  }, [open, currentDate, currentTime]);

  const handleReschedule = async () => {
    if (!date) {
      toast.error(t('CALENDAR.FORMS.SELECT_DATE'));
      return;
    }

    if (!time) {
      toast.error(t('CALENDAR.FORMS.SELECT_TIME'));
      return;
    }

    setLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      await onReschedule(formattedDate, time);
      toast.success(t('CALENDAR.MESSAGES.RESCHEDULED'));
      onOpenChange(false);
    } catch (error) {
      toast.error(t('COMMON.MESSAGES.ERROR'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background border-border shadow-2xl rounded-2xl sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl tracking-tight">
            {t('CALENDAR.ACTIONS.RESCHEDULE')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {t('CALENDAR.MESSAGES.SELECT_NEW_DATE_TIME')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {t('CALENDAR.FORMS.DATE')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 sm:h-11 w-full justify-start text-left rounded-xl border-input"
                >
                  {date ? format(date, 'PPP', { locale: ru }) : t('CALENDAR.FORMS.SELECT_DATE')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                <Calendar
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const checkDate = new Date(date);
                    checkDate.setHours(0, 0, 0, 0);
                    return checkDate.getTime() < today.getTime();
                  }}
                />
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
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-10 sm:h-11 rounded-xl border-input"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-10 sm:h-11 rounded-xl border-input hover:bg-muted"
            >
              {t('COMMON.ACTIONS.CANCEL')}
            </Button>
            <Button
              type="button"
              onClick={handleReschedule}
              disabled={loading}
              className="flex-1 h-10 sm:h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
            >
              {loading ? t('COMMON.LOADING') : t('CALENDAR.ACTIONS.RESCHEDULE')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
