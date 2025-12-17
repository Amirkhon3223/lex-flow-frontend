import { useEffect } from 'react';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { useI18n } from '@/shared/context/I18nContext';
import { useBillingStore } from '@/app/store/billing.store';

export function BillingTabContent() {
  const { t } = useI18n();
  const { currentPlan, subscription, payments, fetchSubscription, fetchPayments, downloadReceipt } =
    useBillingStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchSubscription(), fetchPayments(1, 5)]);
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch once on mount

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      await downloadReceipt(paymentId);
      toast.success(t('SETTINGS.BILLING.RECEIPT_DOWNLOADED'));
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Receipt download error:', error);
    }
  };

  const formatPrice = (amount: number) => `$${amount}`;

  const getIntervalText = (interval: string) => {
    return interval === 'monthly' ? t('SETTINGS.BILLING.PER_MONTH') : t('SETTINGS.BILLING.PER_YEAR');
  };

  if (!currentPlan || !subscription) {
    return (
      <div className="p-3 sm:p-4 md:p-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('SETTINGS.BILLING.NO_SUBSCRIPTION')}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg shadow-purple-500/20 text-white">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <h3 className="text-xl sm:text-2xl tracking-tight mb-0.5 sm:mb-1">
                {currentPlan.name}
              </h3>
              <p className="text-xs sm:text-sm opacity-90">
                {subscription.currentPeriodEnd
                  ? `${t('SETTINGS.BILLING.ACTIVE_UNTIL')} ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                  : '-'}
              </p>
            </div>
            <Badge className="bg-white/20 text-white border-0 w-fit text-xs sm:text-sm">
              {subscription.status === 'active'
                ? t('SETTINGS.BILLING.ACTIVE')
                : subscription.status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-2xl sm:text-3xl tracking-tight mb-4 sm:mb-6">
            {formatPrice(
              subscription.interval === 'monthly' ? currentPlan.monthlyPrice : currentPlan.yearlyPrice
            )}{' '}
            / {getIntervalText(subscription.interval)}
          </div>
          <Button className="w-full bg-white/20 hover:bg-white/30 border-0 rounded-lg sm:rounded-xl backdrop-blur-sm text-white text-xs sm:text-sm h-8 sm:h-10">
            {t('SETTINGS.BILLING.MANAGE_SUBSCRIPTION')}
          </Button>
        </div>
      </Card>

      <div>
        <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">
          {t('SETTINGS.BILLING.PLAN_FEATURES')}
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50">
              <div className="tracking-tight mb-1 text-xs sm:text-sm">{feature.name}</div>
              <div className="text-lg sm:text-2xl text-blue-500">{feature.value}</div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      <div>
        <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">
          {t('SETTINGS.BILLING.PAYMENT_HISTORY')}
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {payments.length > 0 ? (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50"
              >
                <div>
                  <div className="tracking-tight mb-0.5 sm:mb-1 text-sm sm:text-base">
                    {currentPlan.name} - {new Date(payment.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:block sm:text-right">
                  <div className="tracking-tight text-sm sm:text-base">
                    {formatPrice(payment.amount)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadReceipt(payment.id)}
                    className="text-blue-500 hover:bg-blue-500/10 rounded-lg text-xs sm:text-sm h-7 sm:h-8 px-2"
                  >
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" strokeWidth={2} />
                    {t('SETTINGS.BILLING.RECEIPT')}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('SETTINGS.BILLING.NO_PAYMENTS')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
