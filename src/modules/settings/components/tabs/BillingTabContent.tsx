import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useBillingStore } from '@/app/store/billing.store';
import type { PlanInterval } from '@/app/types/billing/billing.interfaces';
import { PaymentHistoryItem } from '@/modules/settings/components/PaymentHistoryItem';
import { ChangePlanDialog } from '@/shared/components/ChangePlanDialog';
import { ManagePaymentDialog } from '@/shared/components/ManagePaymentDialog';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { formatDateByLanguage } from '@/shared/utils/dateFormatter';

export function BillingTabContent() {
  const { t, language } = useI18n();
  const {
    subscription,
    plans,
    payments,
    fetchSubscription,
    fetchPlans,
    fetchPayments,
    downloadReceipt,
  } = useBillingStore();
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [isManagePaymentOpen, setIsManagePaymentOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentPlan = plans.find((p) => p.id === subscription?.planId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchSubscription(), fetchPlans(), fetchPayments()]);
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkoutStatus = urlParams.get('checkout');

    if (checkoutStatus === 'success') {
      toast.success(t('SETTINGS.BILLING.PAYMENT_SUCCESS'));
      fetchSubscription();
      window.history.replaceState({}, '', window.location.pathname);
    } else if (checkoutStatus === 'cancel') {
      toast.error(t('SETTINGS.BILLING.PAYMENT_CANCELLED'));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleChangePlan = () => {
    setIsChangePlanOpen(true);
  };

  const handleManagePayment = () => {
    setIsManagePaymentOpen(true);
  };

  const handlePlanSubmit = async (planId: string, interval: PlanInterval = 'monthly') => {
    setLoading(true);
    try {
      const response = await useBillingStore.getState().createCheckoutSession({
        planId,
        interval,
      });
      window.location.href = response.url;
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Checkout session error:', error);
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (data: { cardNumber: string; expiry: string; cvv: string }) => {
    console.log('Способ оплаты обновлен:', data);
    toast.success(t('SETTINGS.BILLING.PAYMENT_METHOD_UPDATED'));
  };

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      await downloadReceipt(paymentId);
      toast.success(t('SETTINGS.BILLING.RECEIPT_DOWNLOADED'));
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Receipt download error:', error);
    }
  };

  const formatPrice = (amount: number) => {
    return `$${amount}`;
  };

  return (
    <>
      <ChangePlanDialog
        open={isChangePlanOpen}
        onOpenChange={setIsChangePlanOpen}
        onSubmit={handlePlanSubmit}
        currentPlanId={subscription?.planId}
      />
      <ManagePaymentDialog
        open={isManagePaymentOpen}
        onOpenChange={setIsManagePaymentOpen}
        onSubmit={handlePaymentSubmit}
      />

      <div className="space-y-4 sm:space-y-6">
        {currentPlan && subscription ? (
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/30 text-white">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                <div>
                  <Badge className="bg-white/20 text-white border-0 mb-2 sm:mb-3 text-xs">
                    <Zap className="w-3 h-3 mr-1" strokeWidth={2} />
                    {subscription.status === 'active'
                      ? t('SETTINGS.BILLING.ACTIVE')
                      : subscription.status === 'trialing'
                        ? t('SETTINGS.BILLING.TRIAL')
                        : subscription.status.toUpperCase()}
                  </Badge>
                  <h3 className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-1 sm:mb-2">
                    {currentPlan.name}
                  </h3>
                  <p className="opacity-90 text-xs sm:text-sm md:text-base">
                    {currentPlan.maxUsers > 1
                      ? `${t('SETTINGS.BILLING.UP_TO')} ${currentPlan.maxUsers} ${t('SETTINGS.BILLING.USERS')}`
                      : t('SETTINGS.BILLING.SINGLE_USER')}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-2xl sm:text-3xl md:text-4xl tracking-tight mb-0.5 sm:mb-1">
                    {formatPrice(currentPlan.monthlyPrice)}
                  </div>
                  <p className="opacity-90 text-xs sm:text-sm">{t('SETTINGS.BILLING.PER_MONTH')}</p>
                </div>
              </div>

              <Separator className="my-4 sm:my-5 md:my-6 bg-white/20" />

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                {subscription.status === 'trialing' && subscription.trialEnd ? (
                  <div>
                    <p className="opacity-75 mb-0.5 sm:mb-1 text-xs sm:text-sm">
                      {t('SETTINGS.BILLING.TRIAL_ENDS')}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg">
                      {formatDateByLanguage(subscription.trialEnd, language)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="opacity-75 mb-0.5 sm:mb-1 text-xs sm:text-sm">
                      {t('SETTINGS.BILLING.NEXT_PAYMENT')}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg">
                      {subscription.currentPeriodEnd
                        ? formatDateByLanguage(subscription.currentPeriodEnd, language)
                        : '-'}
                    </p>
                  </div>
                )}
                <div>
                  <p className="opacity-75 mb-0.5 sm:mb-1 text-xs sm:text-sm">
                    {t('SETTINGS.BILLING.TEAM_SIZE')}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg">
                    {subscription.usersCount} / {subscription.maxUsers}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={handleChangePlan}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 rounded-lg sm:rounded-xl backdrop-blur-sm text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                  disabled={loading}
                >
                  {t('SETTINGS.BILLING.CHANGE_PLAN')}
                </Button>
                <Button
                  onClick={handleManagePayment}
                  className="flex-1 bg-white text-blue-600 hover:bg-gray-50 border-0 rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                  disabled={loading}
                >
                  {t('SETTINGS.BILLING.MANAGE_PAYMENT')}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('SETTINGS.BILLING.NO_SUBSCRIPTION')}</p>
            </div>
          </Card>
        )}
        <Card>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">
              {t('SETTINGS.BILLING.PAYMENT_HISTORY')}
            </h3>

            <div className="space-y-2 sm:space-y-3">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <PaymentHistoryItem
                    key={payment.id}
                    payment={{
                      date: formatDateByLanguage(payment.createdAt, language),
                      amount: formatPrice(payment.amount),
                      status:
                        payment.status === 'paid'
                          ? 'SETTINGS.BILLING.PAID'
                          : payment.status === 'failed'
                            ? 'SETTINGS.BILLING.FAILED'
                            : 'SETTINGS.BILLING.PENDING',
                      invoice: payment.receiptUrl || '-',
                    }}
                    onDownload={() => handleDownloadReceipt(payment.id)}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('SETTINGS.BILLING.NO_PAYMENTS')}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
