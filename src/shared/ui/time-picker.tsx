import { useState, useMemo, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { cn } from './utils';

interface TimePickerProps {
  value?: string; // 24-hour format: HH:mm (e.g., "14:30")
  onChange: (time: string) => void; // Returns 24-hour format: HH:mm
  placeholder?: string;
  className?: string;
  selectedDate?: string; // ISO format: YYYY-MM-DD (to disable past times for today)
}

export function TimePicker({ value, onChange, placeholder, className, selectedDate }: TimePickerProps) {
  const { language } = useI18n();
  const [open, setOpen] = useState(false);

  // Determine if we should use 12-hour format (en) or 24-hour format (ru, tj)
  const use12Hour = language === 'en';

  // Check if selected date is today
  const isToday = () => {
    if (!selectedDate) return false;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return selectedDate === todayStr;
  };

  // Get current time
  const now = new Date();
  const currentHour24 = now.getHours();
  const currentMinute = now.getMinutes();

  // Parse 24-hour format time (HH:mm)
  const parseTime = (timeStr: string | undefined): { hours: number; minutes: number } | null => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return { hours, minutes };
  };

  // Convert 24-hour to 12-hour format for display
  const format12Hour = (hours: number): { displayHour: number; period: 'AM' | 'PM' } => {
    if (hours === 0) return { displayHour: 12, period: 'AM' };
    if (hours < 12) return { displayHour: hours, period: 'AM' };
    if (hours === 12) return { displayHour: 12, period: 'PM' };
    return { displayHour: hours - 12, period: 'PM' };
  };

  // Convert 12-hour to 24-hour format
  const to24Hour = (hour: number, period: 'AM' | 'PM'): number => {
    if (period === 'AM') {
      return hour === 12 ? 0 : hour;
    } else {
      return hour === 12 ? 12 : hour + 12;
    }
  };

  // Format time for display
  const formatDisplayTime = (hours: number, minutes: number): string => {
    if (use12Hour) {
      const { displayHour, period } = format12Hour(hours);
      return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
    } else {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
  };

  const currentTime = parseTime(value);
  const displayValue = currentTime
    ? formatDisplayTime(currentTime.hours, currentTime.minutes)
    : placeholder;

  // Current selection state
  const [selectedHour, setSelectedHour] = useState<number>(
    currentTime ? (use12Hour ? format12Hour(currentTime.hours).displayHour : currentTime.hours) : (use12Hour ? 12 : 0)
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(currentTime?.minutes || 0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(
    currentTime ? format12Hour(currentTime.hours).period : 'AM'
  );

  // Update internal state when value prop changes or when popover opens
  useEffect(() => {
    if (open && value) {
      const parsed = parseTime(value);
      if (parsed) {
        if (use12Hour) {
          const { displayHour, period } = format12Hour(parsed.hours);
          setSelectedHour(displayHour);
          setSelectedPeriod(period);
        } else {
          setSelectedHour(parsed.hours);
        }
        setSelectedMinute(parsed.minutes);
      }
    }
  }, [open, value, use12Hour]);

  // Generate hours array based on format and filter past hours if today
  const hours = useMemo(() => {
    let hoursArray = use12Hour
      ? Array.from({ length: 12 }, (_, i) => i + 1) // 1-12
      : Array.from({ length: 24 }, (_, i) => i); // 0-23

    // Filter past hours if today
    if (isToday()) {
      if (use12Hour) {
        hoursArray = hoursArray.filter((h) => {
          const hour24 = to24Hour(h, selectedPeriod);
          return hour24 > currentHour24;
        });
        // If we're in current period, only show hours >= current hour
        if (hoursArray.length === 0) {
          // All hours in this period are past, keep them but they'll be disabled
          hoursArray = Array.from({ length: 12 }, (_, i) => i + 1);
        }
      } else {
        hoursArray = hoursArray.filter((h) => h >= currentHour24);
      }
    }

    return hoursArray;
  }, [use12Hour, selectedDate, currentHour24, selectedPeriod]);

  // Generate minutes array and filter past minutes if current hour is selected
  const minutes = useMemo(() => {
    let minutesArray = Array.from({ length: 60 }, (_, i) => i);

    if (isToday()) {
      const selectedHour24 = use12Hour ? to24Hour(selectedHour, selectedPeriod) : selectedHour;

      // If selected hour is current hour, filter past minutes
      if (selectedHour24 === currentHour24) {
        minutesArray = minutesArray.filter((m) => m > currentMinute);
      }
    }

    return minutesArray;
  }, [selectedDate, selectedHour, selectedPeriod, use12Hour, currentHour24, currentMinute]);

  const handleApply = () => {
    const hour24 = use12Hour ? to24Hour(selectedHour, selectedPeriod) : selectedHour;
    const timeStr = `${String(hour24).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    onChange(timeStr);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-11 w-full justify-start text-left font-normal rounded-xl',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            {}
            <div className="flex-1">
              <Select
                value={String(selectedHour)}
                onValueChange={(val) => setSelectedHour(Number(val))}
              >
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder={use12Hour ? '12' : '00'} />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {hours.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {String(h).padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span className="text-lg font-semibold">:</span>

            {}
            <div className="flex-1">
              <Select
                value={String(selectedMinute)}
                onValueChange={(val) => setSelectedMinute(Number(val))}
              >
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="00" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {minutes.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {String(m).padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {}
            {use12Hour && (
              <div className="flex-1">
                <Select value={selectedPeriod} onValueChange={(val) => setSelectedPeriod(val as 'AM' | 'PM')}>
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button onClick={handleApply} className="w-full rounded-xl">
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
