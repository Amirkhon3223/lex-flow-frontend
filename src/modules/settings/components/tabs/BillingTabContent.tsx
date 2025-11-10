import { useState } from 'react';
import { Zap } from 'lucide-react';
import type { PaymentHistoryInterface } from '@/app/types/settings/settings.interfaces';
import { PaymentHistoryItem } from '@/modules/settings/components/PaymentHistoryItem';
import { ChangePlanDialog } from '@/shared/components/ChangePlanDialog';
import { ManagePaymentDialog } from '@/shared/components/ManagePaymentDialog';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

const PAYMENT_HISTORY: PaymentHistoryInterface[] = [
  { date: '20 окт 2025', amount: '12 990 ₽', status: 'Оплачено', invoice: '#INV-001' },
  { date: '20 сен 2025', amount: '12 990 ₽', status: 'Оплачено', invoice: '#INV-002' },
  { date: '20 авг 2025', amount: '12 990 ₽', status: 'Оплачено', invoice: '#INV-003' },
];

export function BillingTabContent() {
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [isManagePaymentOpen, setIsManagePaymentOpen] = useState(false);

  const handleChangePlan = () => {
    setIsChangePlanOpen(true);
  };

  const handleManagePayment = () => {
    setIsManagePaymentOpen(true);
  };

  const handlePlanSubmit = (plan: string) => {
    console.log('План изменен на:', plan);
  };

  const handlePaymentSubmit = (data: { cardNumber: string; expiry: string; cvv: string }) => {
    console.log('Способ оплаты обновлен:', data);
  };

  return (
    <>
      <ChangePlanDialog open={isChangePlanOpen} onOpenChange={setIsChangePlanOpen} onSubmit={handlePlanSubmit} />
      <ManagePaymentDialog open={isManagePaymentOpen} onOpenChange={setIsManagePaymentOpen} onSubmit={handlePaymentSubmit} />

      <div className="space-y-6">
        {/* Subscription Card */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/30 text-white">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Badge className="bg-white/20 text-white border-0 mb-3">
                <Zap className="w-3 h-3 mr-1" strokeWidth={2} />
                Премиум
              </Badge>
              <h3 className="text-3xl tracking-tight mb-2">LexFlow Premium</h3>
              <p className="opacity-90">Безлимитный доступ ко всем функциям</p>
            </div>
            <div className="text-right">
              <div className="text-4xl tracking-tight mb-1">12 990 ₽</div>
              <p className="opacity-90">в месяц</p>
            </div>
          </div>

          <Separator className="my-6 bg-white/20" />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="opacity-75 mb-1">Следующая оплата</p>
              <p className="text-lg">20 ноября 2025</p>
            </div>
            <div>
              <p className="opacity-75 mb-1">Метод оплаты</p>
              <p className="text-lg">•••• 4242</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleChangePlan}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl backdrop-blur-sm"
            >
              Изменить план
            </Button>
            <Button
              onClick={handleManagePayment}
              className="flex-1 bg-white text-blue-600 hover:bg-gray-50 border-0 rounded-xl"
            >
              Управление оплатой
            </Button>
          </div>
        </div>
      </Card>

      {/* Payment History */}
      <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
        <div className="p-6">
          <h3 className="text-xl tracking-tight mb-6">История платежей</h3>

          <div className="space-y-3">
            {PAYMENT_HISTORY.map((payment, index) => (
              <PaymentHistoryItem key={index} payment={payment} />
            ))}
          </div>
        </div>
      </Card>
      </div>
    </>
  );
}
