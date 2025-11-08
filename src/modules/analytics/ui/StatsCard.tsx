import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';

interface StatsCardProps {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    iconBgColor: string;
    iconColor: string;
}

export function StatsCard({ title, value, change, icon: Icon, iconBgColor, iconColor }: StatsCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-600">{title}</p>
                        <p className="mt-2 text-3xl font-bold">{value}</p>
                        <p className="mt-1 text-sm text-green-600">{change}</p>
                    </div>
                    <div className={`rounded-lg ${iconBgColor} p-3`}>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
