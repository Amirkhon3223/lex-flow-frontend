import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

interface SubscriptionCardProps {
    plan: string;
    price: string;
    period: string;
    expiresAt: string;
    status: string;
}

export function SubscriptionCard({ plan, price, period, expiresAt, status }: SubscriptionCardProps) {
    return (
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold">{plan}</h3>
                        <p className="text-sm text-purple-100">
                            Активна до {expiresAt}
                        </p>
                        <p className="mt-4 text-3xl font-bold">
                            {price} / {period}
                        </p>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30">
                        {status}
                    </Badge>
                </div>
                <Button variant="outline" className="mt-6 border-white/30 bg-white/10 text-white hover:bg-white/20">
                    Управление подпиской
                </Button>
            </CardContent>
        </Card>
    );
}
