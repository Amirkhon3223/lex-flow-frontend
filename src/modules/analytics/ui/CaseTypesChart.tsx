import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface CaseTypesChartProps {
    data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
}

export function CaseTypesChart({ data }: CaseTypesChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Типы дел</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-gray-700">{item.name}</span>
                            </div>
                            <span className="font-medium">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
