/**
 * Custom Date Picker with Wheel Selection (3 columns: Day, Month, Year)
 * Format changes based on language: EN (MM/DD/YYYY), RU/TJ (DD.MM.YYYY)
 */

import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { useI18n } from '@/shared/context/I18nContext';
import { cn } from './utils';

interface DatePickerWheelProps {
  value?: string; // ISO format: YYYY-MM-DD
  onChange: (date: string) => void; // Returns ISO format
  placeholder?: string;
  className?: string;
}

export function DatePickerWheel({ value, onChange, placeholder, className }: DatePickerWheelProps) {
  const { language, t } = useI18n();
  const [open, setOpen] = useState(false);

  // Parse ISO date to day, month, year
  const parseISODate = (isoDate: string | undefined): { day: number; month: number; year: number } => {
    if (!isoDate) {
      const now = new Date();
      return { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() };
    }
    const [year, month, day] = isoDate.split('-').map(Number);
    return { day, month, year };
  };

  const { day: initialDay, month: initialMonth, year: initialYear } = parseISODate(value);

  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  const dayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  // Update when value changes externally
  useEffect(() => {
    if (value) {
      const { day, month, year } = parseISODate(value);
      setSelectedDay(day);
      setSelectedMonth(month);
      setSelectedYear(year);
    }
  }, [value]);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);

  // Month names by language
  const getMonthName = (month: number) => {
    const monthNames = {
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
      tj: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    };
    return monthNames[language as keyof typeof monthNames]?.[month - 1] || monthNames.en[month - 1];
  };

  // Format date for display based on language
  const formatDisplayDate = (day: number, month: number, year: number): string => {
    const padZero = (num: number) => num.toString().padStart(2, '0');

    if (language === 'en') {
      // MM/DD/YYYY
      return `${padZero(month)}/${padZero(day)}/${year}`;
    } else {
      // DD.MM.YYYY (ru, tj)
      return `${padZero(day)}.${padZero(month)}.${year}`;
    }
  };

  // Convert to ISO format for backend
  const toISODate = (day: number, month: number, year: number): string => {
    const padZero = (num: number) => num.toString().padStart(2, '0');
    return `${year}-${padZero(month)}-${padZero(day)}`;
  };

  const handleConfirm = () => {
    const isoDate = toISODate(selectedDay, selectedMonth, selectedYear);
    onChange(isoDate);
    setOpen(false);
  };

  // Scroll to center selected item
  const scrollToSelected = (ref: React.RefObject<HTMLDivElement | null>, value: number) => {
    if (!ref.current) return;
    const container = ref.current;
    const items = container.querySelectorAll('[data-value]');
    const selectedItem = Array.from(items).find(
      (item) => Number(item.getAttribute('data-value')) === value
    );
    if (selectedItem) {
      const itemElement = selectedItem as HTMLElement;
      const containerHeight = container.clientHeight;
      const itemHeight = itemElement.clientHeight;
      const scrollTop = itemElement.offsetTop - containerHeight / 2 + itemHeight / 2;
      container.scrollTop = scrollTop;
    }
  };

  // Scroll to selected on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        scrollToSelected(dayRef, selectedDay);
        scrollToSelected(monthRef, selectedMonth);
        scrollToSelected(yearRef, selectedYear);
      }, 100);
    }
  }, [open]);

  const WheelColumn = ({
    items,
    selectedValue,
    onSelect,
    ref,
    renderItem,
  }: {
    items: number[];
    selectedValue: number;
    onSelect: (value: number) => void;
    ref: React.RefObject<HTMLDivElement | null>;
    renderItem: (item: number) => React.ReactNode;
  }) => (
    <div className="relative h-[200px]">
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

      {/* Selected item highlight */}
      <div className="absolute top-1/2 left-0 right-0 h-10 -translate-y-1/2 bg-primary/5 border-y border-primary/20 pointer-events-none z-10" />

      {/* Scrollable list */}
      <div
        ref={ref}
        className="h-full overflow-y-scroll snap-y snap-mandatory"
      >
        {/* Top padding */}
        <div className="h-[75px]" />

        {items.map((item) => (
          <div
            key={item}
            data-value={item}
            onClick={() => onSelect(item)}
            className={cn(
              'h-10 flex items-center justify-center cursor-pointer transition-all snap-center',
              selectedValue === item
                ? 'text-foreground font-semibold text-lg'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {renderItem(item)}
          </div>
        ))}

        {/* Bottom padding */}
        <div className="h-[75px]" />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </div>
  );

  const displayValue = value
    ? formatDisplayDate(selectedDay, selectedMonth, selectedYear)
    : placeholder || t('CLIENTS.FIELDS.BIRTH_DATE');

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
          <Calendar className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Day column (or Month for EN) */}
            <div>
              <div className="text-xs text-center text-muted-foreground mb-2 font-medium">
                {language === 'en' ? t('COMMON.MONTH') || 'Month' : t('COMMON.DAY') || 'Day'}
              </div>
              {language === 'en' ? (
                <WheelColumn
                  items={months}
                  selectedValue={selectedMonth}
                  onSelect={setSelectedMonth}
                  ref={monthRef}
                  renderItem={(m) => getMonthName(m)}
                />
              ) : (
                <WheelColumn
                  items={days}
                  selectedValue={selectedDay}
                  onSelect={setSelectedDay}
                  ref={dayRef}
                  renderItem={(d) => d}
                />
              )}
            </div>

            {/* Month column (or Day for EN) */}
            <div>
              <div className="text-xs text-center text-muted-foreground mb-2 font-medium">
                {language === 'en' ? t('COMMON.DAY') || 'Day' : t('COMMON.MONTH') || 'Month'}
              </div>
              {language === 'en' ? (
                <WheelColumn
                  items={days}
                  selectedValue={selectedDay}
                  onSelect={setSelectedDay}
                  ref={dayRef}
                  renderItem={(d) => d}
                />
              ) : (
                <WheelColumn
                  items={months}
                  selectedValue={selectedMonth}
                  onSelect={setSelectedMonth}
                  ref={monthRef}
                  renderItem={(m) => getMonthName(m)}
                />
              )}
            </div>

            {/* Year column */}
            <div>
              <div className="text-xs text-center text-muted-foreground mb-2 font-medium">
                {t('COMMON.YEAR') || 'Year'}
              </div>
              <WheelColumn
                items={years}
                selectedValue={selectedYear}
                onSelect={setSelectedYear}
                ref={yearRef}
                renderItem={(y) => y}
              />
            </div>
          </div>

          <Button onClick={handleConfirm} className="w-full">
            {t('COMMON.ACTIONS.CONFIRM') || 'Confirm'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
