import { useState } from 'react';
import { Zap } from 'lucide-react';
import type { PaymentHistoryInterface } from '@/app/types/settings/settings.interfaces';
import { PaymentHistoryItem } from '@/modules/settings/components/PaymentHistoryItem';
import { ChangePlanDialog } from '@/shared/components/ChangePlanDialog';
import { ManagePaymentDialog } from '@/shared/components/ManagePaymentDialog';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

const PAYMENT_HISTORY: PaymentHistoryInterface[] = [
  { date: '20 окт 2025', amount: '12 990 ₽', status: 'SETTINGS.BILLING.PAID', invoice: '#INV-001' },
  { date: '20 сен 2025', amount: '12 990 ₽', status: 'SETTINGS.BILLING.PAID', invoice: '#INV-002' },
  { date: '20 авг 2025', amount: '12 990 ₽', status: 'SETTINGS.BILLING.PAID', invoice: '#INV-003' },
];

export function BillingTabContent() {
  const { t } = useI18n();
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
      <ChangePlanDialog
        open={isChangePlanOpen}
        onOpenChange={setIsChangePlanOpen}
        onSubmit={handlePlanSubmit}
      />
      <ManagePaymentDialog
        open={isManagePaymentOpen}
        onOpenChange={setIsManagePaymentOpen}
        onSubmit={handlePaymentSubmit}
      />

      <div className="space-y-4 sm:space-y-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/30 text-white">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div>
                <Badge className="bg-white/20 text-white border-0 mb-2 sm:mb-3 text-xs">
                  <Zap className="w-3 h-3 mr-1" strokeWidth={2} />
                  {t('SETTINGS.BILLING.PREMIUM')}
                </Badge>
                <h3 className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-1 sm:mb-2">
                  LexFlow Premium
                </h3>
                <p className="opacity-90 text-xs sm:text-sm md:text-base">
                  {t('SETTINGS.BILLING.UNLIMITED_ACCESS')}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-2xl sm:text-3xl md:text-4xl tracking-tight mb-0.5 sm:mb-1">
                  12 990 ₽
                </div>
                <p className="opacity-90 text-xs sm:text-sm">{t('SETTINGS.BILLING.PER_MONTH')}</p>
              </div>
            </div>

            <Separator className="my-4 sm:my-5 md:my-6 bg-white/20" />

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div>
                <p className="opacity-75 mb-0.5 sm:mb-1 text-xs sm:text-sm">
                  {t('SETTINGS.BILLING.NEXT_PAYMENT')}
                </p>
                <p className="text-sm sm:text-base md:text-lg">20 ноября 2025</p>
              </div>
              <div>
                <p className="opacity-75 mb-0.5 sm:mb-1 text-xs sm:text-sm">
                  {t('SETTINGS.BILLING.PAYMENT_METHOD')}
                </p>
                <p className="text-sm sm:text-base md:text-lg">•••• 4242</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={handleChangePlan}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 rounded-lg sm:rounded-xl backdrop-blur-sm text-xs sm:text-sm h-8 sm:h-9 md:h-10"
              >
                {t('SETTINGS.BILLING.CHANGE_PLAN')}
              </Button>
              <Button
                onClick={handleManagePayment}
                className="flex-1 bg-white text-blue-600 hover:bg-gray-50 border-0 rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 md:h-10"
              >
                {t('SETTINGS.BILLING.MANAGE_PAYMENT')}
              </Button>
            </div>
          </div>
        </Card>
        <Card>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
              {t('SETTINGS.BILLING.PAYMENT_HISTORY')}
            </h3>

            <div className="space-y-2 sm:space-y-3">
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
