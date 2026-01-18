'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from './utils';

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  showOutsideDays?: boolean;
  className?: string;
  modifiers?: {
    meeting?: Date[];
  };
  modifiersClassNames?: {
    meeting?: string;
  };
  disabled?: (date: Date) => boolean;
}

export function Calendar({
  selected,
  onSelect,
  month,
  onMonthChange,
  showOutsideDays = true,
  className,
  modifiers,
  modifiersClassNames,
  disabled,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(month || new Date());

  React.useEffect(() => {
    if (month) setCurrentMonth(month);
  }, [month]);

  const today = new Date();
  const year = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  const startOfMonth = new Date(year, currentMonthIndex, 1);
  const endOfMonth = new Date(year, currentMonthIndex + 1, 0);
  const daysInMonth = endOfMonth.getDate();

  const startDayOfWeek = (startOfMonth.getDay() + 6) % 7;
  const days: (Date | null)[] = [];

  const prevMonthDays = new Date(year, currentMonthIndex, 0).getDate();

  if (showOutsideDays) {
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, currentMonthIndex - 1, prevMonthDays - i));
    }
  } else {
    for (let i = 0; i < startDayOfWeek; i++) days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, currentMonthIndex, i));
  }

  const remainder = 7 - (days.length % 7);
  if (remainder < 7) {
    if (showOutsideDays) {
      for (let i = 1; i <= remainder; i++) {
        days.push(new Date(year, currentMonthIndex + 1, i));
      }
    } else {
      for (let i = 0; i < remainder; i++) days.push(null);
    }
  }

  const { t, language } = useI18n();
  const weekDays = [
    t('CALENDAR.WEEK_DAYS.MON'),
    t('CALENDAR.WEEK_DAYS.TUE'),
    t('CALENDAR.WEEK_DAYS.WED'),
    t('CALENDAR.WEEK_DAYS.THU'),
    t('CALENDAR.WEEK_DAYS.FRI'),
    t('CALENDAR.WEEK_DAYS.SAT'),
    t('CALENDAR.WEEK_DAYS.SUN'),
  ];

  const handlePrev = () => {
    const newMonth = new Date(year, currentMonthIndex - 1, 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleNext = () => {
    const newMonth = new Date(year, currentMonthIndex + 1, 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleMonthChange = (monthIndex: string) => {
    const newMonth = new Date(year, parseInt(monthIndex), 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleYearChange = (newYear: string) => {
    const yearNum = parseInt(newYear);
    const newMonth = new Date(yearNum, currentMonthIndex, 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  // Generate years (from 1920 to current year + 10)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1920 + 11 }, (_, i) => 1920 + i);

  // Get month names
  const monthNames = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(year, i, 1);
    return date.toLocaleDateString(
      {
        ru: 'ru-RU',
        en: 'en-US',
        tj: 'tg-TJ',
      }[language] || 'en-US',
      { month: 'long' }
    );
  });

  const isSameDay = (a?: Date, b?: Date) =>
    a &&
    b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const meetingDates = modifiers?.meeting || [];

  const isMeetingDay = (date: Date) => meetingDates.some((d) => isSameDay(d, date));

  return (
    <div
      className={cn(
        'p-5 bg-card rounded-2xl border border-border shadow-sm text-foreground select-none',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <button onClick={handlePrev} className="p-2 rounded-lg hover:bg-muted transition flex-shrink-0">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-2 flex-1 justify-center">
          {}
          <Select value={String(currentMonthIndex)} onValueChange={handleMonthChange}>
            <SelectTrigger className="h-9 w-[140px] rounded-lg border-input text-sm font-semibold capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {monthNames.map((monthName, index) => (
                <SelectItem key={index} value={String(index)} className="capitalize">
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {}
          <Select value={String(year)} onValueChange={handleYearChange}>
            <SelectTrigger className="h-9 w-[100px] rounded-lg border-input text-sm font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {years.reverse().map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button onClick={handleNext} className="p-2 rounded-lg hover:bg-muted transition flex-shrink-0">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
        {weekDays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-sm">
        {days.map((date, index) => {
          if (!date) return <div key={index} className="h-10"></div>;

          const isOutside = date.getMonth() !== currentMonthIndex;
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selected);
          const hasMeeting = isMeetingDay(date);
          const isDisabled = disabled?.(date) || false;

          return (
            <button
              key={index}
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect?.(date)}
              className={cn(
                'relative w-10 h-10 flex items-center justify-center rounded-xl transition-all',
                // Disabled state - VERY VISIBLE
                isDisabled && 'cursor-not-allowed !opacity-30 !text-gray-400 !bg-gray-100 dark:!bg-gray-800 line-through',
                // Active states only if not disabled
                !isDisabled && 'cursor-pointer hover:bg-muted focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
                !isDisabled && isOutside && 'text-muted-foreground/50',
                !isDisabled && isToday && 'bg-blue-50 text-blue-700 font-semibold',
                !isDisabled && isSelected &&
                  'bg-gradient-to-br from-[#7B22F6] to-[#3C47F7] text-white hover:opacity-90 ring-2 ring-[#7B22F6] ring-offset-2'
              )}
            >
              {date.getDate()}
              {hasMeeting && !isDisabled && (
                <span
                  className={cn(
                    'absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full',
                    modifiersClassNames?.meeting || 'bg-blue-500'
                  )}
                ></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
