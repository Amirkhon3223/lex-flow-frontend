import type { FinancialCardProps } from '@/app/types/clients/clients.interfaces';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function FinancialCard({ financialData }: FinancialCardProps) {
  const { totalAmount, paidAmount, remainingAmount, paymentPercentage } = financialData;

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
      <CardHeader>
        <CardTitle className="text-white">Финансы</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-blue-100">Всего к оплате</span>
          <span className="text-xl font-bold">{totalAmount.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-100">Оплачено</span>
          <span className="text-xl font-bold">{paidAmount.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-100">Остаток</span>
          <span className="text-xl font-bold">{remainingAmount.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-blue-100">Процент оплаты</span>
            <span className="font-medium">{paymentPercentage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-white"
              style={{ width: `${paymentPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
