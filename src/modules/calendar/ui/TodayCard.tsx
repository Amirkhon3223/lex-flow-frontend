import type { TodayCardProps } from '@/app/types/calendar/calendar.interfaces';
import { Card } from '@/shared/ui/card';

export function TodayCard({ meetingsCount }: TodayCardProps) {
    return (
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 text-white mb-4 sm:mb-6">
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div>
                        <h3 className="text-lg sm:text-xl tracking-tight mb-1">Сегодня</h3>
                        <p className="text-xs sm:text-sm opacity-90">
                            {new Date().toLocaleDateString('ru-RU', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            })}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl sm:text-3xl tracking-tight">{meetingsCount}</div>
                        <div className="text-xs sm:text-sm opacity-90">
                            {meetingsCount === 1 ? 'встреча' : 'встречи'}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
