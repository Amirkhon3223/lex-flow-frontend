import type {
    SubscriptionFeatures,
    Payment,
    SubscriptionTabProps,
} from '@/app/types/settings/settings.interfaces';
import { PaymentHistoryItem } from './PaymentHistoryItem';
import { SubscriptionCard } from './SubscriptionCard';

export function SubscriptionTab({
    plan,
    price,
    period,
    expiresAt,
    status,
    features,
    payments,
}: SubscriptionTabProps) {
    return (
        <div className="space-y-6">
            {}
            <SubscriptionCard
                plan={plan}
                price={price}
                period={period}
                expiresAt={expiresAt}
                status={status}
            />

            {}
            <div>
                <h3 className="mb-4 font-semibold text-gray-900">Возможности плана</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-gray-600">Клиенты</div>
                        <div className="mt-1 text-2xl font-bold text-blue-600">
                            {features.clients}
                        </div>
                    </div>
                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-gray-600">Дела</div>
                        <div className="mt-1 text-2xl font-bold text-purple-600">
                            {features.cases}
                        </div>
                    </div>
                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-gray-600">Хранилище</div>
                        <div className="mt-1 text-2xl font-bold text-green-600">
                            {features.storage}
                        </div>
                    </div>
                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-gray-600">Пользователи</div>
                        <div className="mt-1 text-2xl font-bold text-orange-600">
                            {features.users}
                        </div>
                    </div>
                </div>
            </div>

            {}
            <div>
                <h3 className="mb-4 font-semibold text-gray-900">История платежей</h3>
                <div className="space-y-2">
                    {payments.map((payment, idx) => (
                        <PaymentHistoryItem
                            key={idx}
                            date={payment.date}
                            plan={payment.plan}
                            amount={payment.amount}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
