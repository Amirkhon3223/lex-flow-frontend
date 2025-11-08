import { Button } from '@/shared/ui/button';

interface PaymentHistoryItemProps {
    date: string;
    plan: string;
    amount: string;
}

export function PaymentHistoryItem({ date, plan, amount }: PaymentHistoryItemProps) {
    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
                <div className="font-medium text-gray-900">{plan}</div>
                <div className="text-sm text-gray-600">{date}</div>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-gray-900">{amount}</div>
                <Button variant="ghost" size="sm">
                    Чек
                </Button>
            </div>
        </div>
    );
}
