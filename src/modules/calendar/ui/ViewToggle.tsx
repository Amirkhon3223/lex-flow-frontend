import { Grid3x3, List } from 'lucide-react';
import type { ViewToggleProps } from '@/app/types/calendar/calendar.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
    const { t } = useI18n();

    return (
        <div className="flex items-center bg-blue-500/10 border border-blue-500/20 rounded-xl p-0.5 sm:p-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange('calendar')}
                className={`rounded-sm sm:rounded-md md:rounded-lg text-xs px-1.5 sm:px-2 md:px-3 h-6 sm:h-7 md:h-8 ${
                    viewMode === 'calendar' ? 'bg-card shadow-sm' : 'hover:bg-transparent'
                }`}
            >
                <Grid3x3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 md:mr-2" strokeWidth={2} />
                <span className="hidden md:inline">{t('CALENDAR.VIEW.CALENDAR')}</span>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange('list')}
                className={`rounded-sm sm:rounded-md md:rounded-lg text-xs px-1.5 sm:px-2 md:px-3 h-6 sm:h-7 md:h-8 ${
                    viewMode === 'list' ? 'bg-card shadow-sm' : 'hover:bg-transparent'
                }`}
            >
                <List className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 md:mr-2" strokeWidth={2} />
                <span className="hidden md:inline">{t('CALENDAR.VIEW.LIST')}</span>
            </Button>
        </div>
    );
}
