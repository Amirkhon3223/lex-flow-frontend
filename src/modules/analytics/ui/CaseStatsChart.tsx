import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface CaseStatsChartProps {
    data: Array<{
        month: string;
        completed: number;
        failed: number;
    }>;
}

export function CaseStatsChart({ data }: CaseStatsChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Статистика дел</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#10b981" name="Завершено" />
                        <Bar dataKey="failed" fill="#ef4444" name="Отклонено" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
