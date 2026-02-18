import { useI18n } from '@/shared/context/I18nContext';
import { DatePicker } from '@/shared/ui/date-picker';
import { Button } from '@/shared/ui/button';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const { t } = useI18n();

  const handlePreset = (preset: 'last_30' | 'quarter' | 'year' | 'last_year') => {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (preset) {
      case 'last_30':
        start = new Date(now);
        start.setDate(start.getDate() - 30);
        break;
      case 'quarter': {
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        start = new Date(now.getFullYear(), quarterMonth, 1);
        break;
      }
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case 'last_year':
        start = new Date(now.getFullYear() - 1, 0, 1);
        end = new Date(now.getFullYear() - 1, 11, 31);
        break;
    }

    const toISO = (d: Date) => d.toISOString().split('T')[0];
    onChange(toISO(start), toISO(end));
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
          {t('REPORTS.DATE_FROM')}
        </span>
        <DatePicker
          value={startDate}
          onChange={(date) => onChange(date, endDate)}
          className="w-36 sm:w-44 h-8 sm:h-9 text-xs sm:text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
          {t('REPORTS.DATE_TO')}
        </span>
        <DatePicker
          value={endDate}
          onChange={(date) => onChange(startDate, date)}
          className="w-36 sm:w-44 h-8 sm:h-9 text-xs sm:text-sm"
        />
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="h-7 sm:h-8 text-xs px-2 sm:px-3"
          onClick={() => handlePreset('last_30')}
        >
          {t('REPORTS.PRESETS.LAST_30_DAYS')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 sm:h-8 text-xs px-2 sm:px-3"
          onClick={() => handlePreset('quarter')}
        >
          {t('REPORTS.PRESETS.THIS_QUARTER')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 sm:h-8 text-xs px-2 sm:px-3"
          onClick={() => handlePreset('year')}
        >
          {t('REPORTS.PRESETS.THIS_YEAR')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 sm:h-8 text-xs px-2 sm:px-3"
          onClick={() => handlePreset('last_year')}
        >
          {t('REPORTS.PRESETS.LAST_YEAR')}
        </Button>
      </div>
    </div>
  );
}
