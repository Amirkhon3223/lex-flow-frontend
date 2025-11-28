import { Check, Calendar, X } from 'lucide-react';
import type { QuickActionsCardProps } from '@/app/types/calendar/calendar.interfaces';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { useI18n } from '@/shared/context/I18nContext';

export function QuickActionsCard({ onComplete, onReschedule, onCancel }: QuickActionsCardProps) {
    const { t } = useI18n();

    return (
        <Card className="dark:bg-blue-500/10 dark:border dark:border-blue-500/20 bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 text-white overflow-hidden">
            <CardContent>
                <h3 className="text-sm sm:text-base md:text-lg tracking-tight mb-2 sm:mb-3 md:mb-4">
                    {t('CALENDAR.QUICK_ACTIONS')}
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10 rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 overflow-hidden"
                        onClick={onComplete}
                    >
                        <Check
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 flex-shrink-0"
                            strokeWidth={2}
                        />
                        <span className="truncate">{t('CALENDAR.ACTIONS.MARK_COMPLETE')}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10 rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 overflow-hidden"
                        onClick={onReschedule}
                    >
                        <Calendar
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 flex-shrink-0"
                            strokeWidth={2}
                        />
                        <span className="truncate">{t('CALENDAR.ACTIONS.RESCHEDULE')}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10 rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 overflow-hidden"
                        onClick={onCancel}
                    >
                        <X
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 flex-shrink-0"
                            strokeWidth={2}
                        />
                        <span className="truncate">{t('CALENDAR.ACTIONS.CANCEL')}</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
