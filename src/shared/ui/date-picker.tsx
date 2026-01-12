import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { useI18n } from '@/shared/context/I18nContext';
import { cn } from './utils';

interface DatePickerProps {
  value?: string; // ISO format: YYYY-MM-DD
  onChange: (date: string) => void; // Returns ISO format
  placeholder?: string;
  className?: string;
}

export function DatePicker({ value, onChange, placeholder, className }: DatePickerProps) {
  const { language } = useI18n();
  const [open, setOpen] = useState(false);

  // Parse ISO date to Date object
  const parseISODate = (isoDate: string | undefined): Date | undefined => {
    if (!isoDate) return undefined;
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Convert Date to ISO format
  const toISODate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format date for display based on language
  const formatDisplayDate = (date: Date): string => {
    const localeMap: Record<'en' | 'ru' | 'tj', string> = {
      en: 'en-US',
      ru: 'ru-RU',
      tj: 'tg-TJ',
    };

    const locale = localeMap[language as keyof typeof localeMap] || 'en-US';

    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const selectedDate = parseISODate(value);

  const handleSelect = (date: Date) => {
    const isoDate = toISODate(date);
    onChange(isoDate);
    setOpen(false);
  };

  const displayValue = selectedDate ? formatDisplayDate(selectedDate) : placeholder;

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
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar selected={selectedDate} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
