import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  CreditCard,
  Download,
  MoreVertical,
  Plus,
  RefreshCw,
  Trash2,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { useBillingStore } from '@/app/store/billing.store';
import type { PaymentStatus, PlanInterval } from '@/app/types/billing/billing.interfaces';
import { ChangePlanDialog } from '@/shared/components/ChangePlanDialog';
import { useI18n } from '@/shared/context/I18nContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Separator } from '@/shared/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { formatDateByLanguage } from '@/shared/utils/dateFormatter';

type PaymentFilter = 'all' | 'paid' | 'failed' | 'pending';

export function BillingTabContent() {
  const { t, language } = useI18n();
  const {
    subscription,
    plans,
    payments,
    paymentMethods,
    fetchSubscription,
    fetchPlans,
    fetchPayments,
    fetchPaymentMethods,
    downloadReceipt,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    retryPayment,
    cancelSubscription,
  } = useBillingStore();

  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const currentPlan = plans.find((p) => p.id === subscription?.planId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchSubscription(),
          fetchPlans(),
          fetchPayments(),
          fetchPaymentMethods(),
        ]);
      } catch {
        // Silently handle - empty state will be shown
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
      fetchPayments();
      fetchPaymentMethods();
      window.history.replaceState({}, '', window.location.pathname);
    } else if (checkoutStatus === 'cancel') {
      toast.error(t('SETTINGS.BILLING.PAYMENT_CANCELLED'));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handlePlanSubmit = async (planId: string, interval: PlanInterval = 'monthly') => {
    setLoading(true);
    try {
      const response = await useBillingStore.getState().createCheckoutSession({
        planId,
        interval,
      });
      window.location.href = response.url;
    } catch {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      await downloadReceipt(paymentId);
      toast.success(t('SETTINGS.BILLING.RECEIPT_DOWNLOADED'));
    } catch {
      toast.error(t('COMMON.ERRORS.GENERIC'));
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(paymentMethodId);
      toast.success(t('SETTINGS.BILLING.PAYMENT_METHODS.SET_DEFAULT_SUCCESS'));
    } catch {
      toast.error(t('COMMON.ERRORS.GENERIC'));
    }
  };

  const handleDeleteCard = async () => {
    if (!deleteCardId) return;
    try {
      await deletePaymentMethod(deleteCardId);
      toast.success(t('SETTINGS.BILLING.PAYMENT_METHODS.REMOVE_SUCCESS'));
    } catch {
      toast.error(t('COMMON.ERRORS.GENERIC'));
    } finally {
      setDeleteCardId(null);
    }
  };

  const handleRetryPayment = async (paymentId: string) => {
    try {
      await retryPayment(paymentId);
      toast.success(t('SETTINGS.BILLING.HISTORY.RETRY_SUCCESS'));
    } catch {
      toast.error(t('COMMON.ERRORS.GENERIC'));
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
      toast.success(t('SETTINGS.BILLING.PLAN.CANCEL_SUCCESS'));
      setCancelDialogOpen(false);
    } catch {
      toast.error(t('COMMON.ERRORS.GENERIC'));
    }
  };

  const formatPrice = (amount: number) => `$${amount}`;

  const getStatusBadge = (status: PaymentStatus) => {
    const styles = {
      paid: 'bg-green-500/10 text-green-600 dark:text-green-400',
      failed: 'bg-red-500/10 text-red-600 dark:text-red-400',
      pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      refunded: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    };
    const labels = {
      paid: t('SETTINGS.BILLING.PAID'),
      failed: t('SETTINGS.BILLING.FAILED'),
      pending: t('SETTINGS.BILLING.PENDING'),
      refunded: t('SETTINGS.BILLING.REFUNDED'),
    };
    return (
      <Badge className={`${styles[status]} border-0`}>
        {labels[status]}
      </Badge>
    );
  };

  const getSubscriptionStatusBadge = () => {
    if (!subscription) return null;
    const status = subscription.status;
    const styles = {
      active: 'bg-green-500/20 text-green-600 dark:text-green-400',
      trialing: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      past_due: 'bg-red-500/20 text-red-600 dark:text-red-400',
      canceled: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
      unpaid: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
    };
    const labels = {
      active: t('SETTINGS.BILLING.ACTIVE'),
      trialing: t('SETTINGS.BILLING.TRIAL'),
      past_due: t('SETTINGS.BILLING.PLAN.PAST_DUE'),
      canceled: t('SETTINGS.BILLING.PLAN.CANCELED'),
      unpaid: t('SETTINGS.BILLING.PLAN.UNPAID'),
    };
    return (
      <Badge className={`${styles[status]} border-0`}>
        <Zap className="w-3 h-3 mr-1" />
        {labels[status]}
      </Badge>
    );
  };

  const filteredPayments = payments.filter((p) => {
    if (paymentFilter === 'all') return true;
    return p.status === paymentFilter;
  });

  const getCardBrandIcon = (brand: string) => {
    // Could add specific brand icons here
    return <CreditCard className="w-8 h-8 text-muted-foreground" />;
  };

  return (
    <>
      <ChangePlanDialog
        open={isChangePlanOpen}
        onOpenChange={setIsChangePlanOpen}
        onSubmit={handlePlanSubmit}
        currentPlanId={subscription?.status === 'trialing' ? undefined : subscription?.planId}
      />

      <AlertDialog open={!!deleteCardId} onOpenChange={() => setDeleteCardId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('COMMON.ACTIONS.CONFIRM')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('SETTINGS.BILLING.PAYMENT_METHODS.REMOVE_CONFIRM', { card: '****' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('COMMON.ACTIONS.CANCEL')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCard} className="bg-red-600 hover:bg-red-700">
              {t('SETTINGS.BILLING.PAYMENT_METHODS.REMOVE')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('SETTINGS.BILLING.PLAN.CANCEL')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('SETTINGS.BILLING.PLAN.CANCEL_CONFIRM')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('COMMON.ACTIONS.CANCEL')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('SETTINGS.BILLING.PLAN.CANCEL')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs defaultValue="plan" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="plan">{t('SETTINGS.BILLING.TABS.PLAN')}</TabsTrigger>
          <TabsTrigger value="methods">{t('SETTINGS.BILLING.TABS.PAYMENT_METHODS')}</TabsTrigger>
          <TabsTrigger value="history">{t('SETTINGS.BILLING.TABS.HISTORY')}</TabsTrigger>
        </TabsList>

        {/* Plan Tab */}
        <TabsContent value="plan" className="space-y-6">
          {currentPlan && subscription ? (
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-0 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0xMHY2aDZ2LTZoLTZ6bTAgMjB2Nmg2di02aC02em0tMTAtMTB2Nmg2di02aC02em0wLTEwdjZoNnYtNmgtNnptMCAyMHY2aDZ2LTZoLTZ6bS0xMC0xMHY2aDZ2LTZoLTZ6bTAtMTB2Nmg2di02aC02em0wIDIwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
              <CardContent className="p-6 relative">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    {getSubscriptionStatusBadge()}
                    <h2 className="text-3xl font-bold mt-3">{currentPlan.name}</h2>
                    <p className="text-white/80 mt-1">
                      {currentPlan.maxUsers > 1
                        ? `${t('SETTINGS.BILLING.UP_TO')} ${currentPlan.maxUsers} ${t('SETTINGS.BILLING.USERS')}`
                        : t('SETTINGS.BILLING.SINGLE_USER')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">
                      {formatPrice(currentPlan.monthlyPrice)}
                    </div>
                    <p className="text-white/80">{t('SETTINGS.BILLING.PER_MONTH')}</p>
                  </div>
                </div>

                <Separator className="my-6 bg-white/20" />

                <div className="grid grid-cols-2 gap-6">
                  {subscription.status === 'trialing' && subscription.trialEnd ? (
                    <div>
                      <p className="text-white/60 text-sm">{t('SETTINGS.BILLING.TRIAL_ENDS')}</p>
                      <p className="text-lg font-medium mt-1">
                        {formatDateByLanguage(subscription.trialEnd, language)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white/60 text-sm">{t('SETTINGS.BILLING.NEXT_PAYMENT')}</p>
                      <p className="text-lg font-medium mt-1">
                        {subscription.currentPeriodEnd
                          ? formatDateByLanguage(subscription.currentPeriodEnd, language)
                          : '-'}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-white/60 text-sm">{t('SETTINGS.BILLING.TEAM_SIZE')}</p>
                    <p className="text-lg font-medium mt-1">
                      {subscription.usersCount} / {subscription.maxUsers}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button
                    onClick={() => setIsChangePlanOpen(true)}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                    disabled={loading}
                  >
                    {t('SETTINGS.BILLING.CHANGE_PLAN')}
                  </Button>
                  {subscription.status !== 'canceled' && (
                    <Button
                      variant="ghost"
                      onClick={() => setCancelDialogOpen(true)}
                      className="text-white/80 hover:text-white hover:bg-white/10"
                    >
                      {t('SETTINGS.BILLING.PLAN.CANCEL')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('SETTINGS.BILLING.NO_SUBSCRIPTION')}</p>
                <Button onClick={() => setIsChangePlanOpen(true)} className="mt-4">
                  {t('SETTINGS.BILLING.CHANGE_PLAN')}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('SETTINGS.BILLING.PAYMENT_METHODS.TITLE')}</CardTitle>
                <CardDescription>{t('SETTINGS.BILLING.PAYMENT_METHODS.SUBTITLE')}</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsChangePlanOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('SETTINGS.BILLING.PAYMENT_METHODS.ADD_CARD')}
              </Button>
            </CardHeader>
            <CardContent>
              {paymentMethods.length > 0 ? (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {getCardBrandIcon(method.brand)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {method.brand} •••• {method.last4}
                            </span>
                            {method.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                {t('SETTINGS.BILLING.PAYMENT_METHODS.DEFAULT')}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {t('SETTINGS.BILLING.PAYMENT_METHODS.EXPIRES')} {method.expiryMonth}/
                            {method.expiryYear}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!method.isDefault && (
                            <DropdownMenuItem onClick={() => handleSetDefault(method.id)}>
                              <Check className="w-4 h-4 mr-2" />
                              {t('SETTINGS.BILLING.PAYMENT_METHODS.SET_DEFAULT')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => setDeleteCardId(method.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('SETTINGS.BILLING.PAYMENT_METHODS.REMOVE')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium">{t('SETTINGS.BILLING.PAYMENT_METHODS.NO_METHODS')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('SETTINGS.BILLING.PAYMENT_METHODS.NO_METHODS_DESC')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>{t('SETTINGS.BILLING.HISTORY.TITLE')}</CardTitle>
                  <CardDescription>{t('SETTINGS.BILLING.HISTORY.SUBTITLE')}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {(['all', 'paid', 'failed', 'pending'] as PaymentFilter[]).map((filter) => (
                    <Button
                      key={filter}
                      variant={paymentFilter === filter ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPaymentFilter(filter)}
                    >
                      {t(`SETTINGS.BILLING.HISTORY.FILTER_${filter.toUpperCase()}`)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredPayments.length > 0 ? (
                <div className="space-y-3">
                  {filteredPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-card gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            payment.status === 'paid'
                              ? 'bg-green-500/10'
                              : payment.status === 'failed'
                                ? 'bg-red-500/10'
                                : 'bg-yellow-500/10'
                          }`}
                        >
                          {payment.status === 'paid' ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : payment.status === 'failed' ? (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            <RefreshCw className="w-5 h-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{payment.description || payment.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateByLanguage(payment.createdAt, language)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-14 sm:ml-0">
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(payment.amount)}</p>
                          {getStatusBadge(payment.status)}
                        </div>
                        <div className="flex gap-1">
                          {payment.status === 'failed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRetryPayment(payment.id)}
                            >
                              <RefreshCw className="w-4 h-4 mr-1" />
                              {t('SETTINGS.BILLING.HISTORY.RETRY')}
                            </Button>
                          )}
                          {payment.receiptUrl && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadReceipt(payment.id)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t('SETTINGS.BILLING.NO_PAYMENTS')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
