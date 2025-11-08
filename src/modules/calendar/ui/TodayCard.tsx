import { Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';

interface TodayCardProps {
    meetingsCount: number;
}

export function TodayCard({ meetingsCount }: TodayCardProps) {
    return (
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-white/20 p-3">
                        <CalendarIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Сегодня</h3>
                        <p className="text-sm text-blue-100">
                            У вас {meetingsCount} {meetingsCount === 1 ? 'встреча' : 'встречи'}
                        </p>
                    </div>
                </div>
                <div className="text-4xl font-bold">{meetingsCount}</div>
            </CardContent>
        </Card>
    );
}
