import { useEffect, useState } from 'react';
import { Check, Zap } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { billingService } from '@/app/services/billing/billing.service';
import type { Plan } from '@/app/types/billing/billing.interfaces';

interface ChangePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (plan: string) => void;
  currentPlanId?: string;
}

const PLAN_FEATURES: Record<string, string[]> = {
  plan_basic: [
    'PLAN.BASIC.FEATURES.CLIENTS',
    'PLAN.BASIC.FEATURES.CASES',
    'PLAN.BASIC.FEATURES.STORAGE',
    'PLAN.BASIC.FEATURES.USERS',
  ],
  plan_pro: [
    'PLAN.PRO.FEATURES.CLIENTS',
    'PLAN.PRO.FEATURES.CASES',
    'PLAN.PRO.FEATURES.STORAGE',
    'PLAN.PRO.FEATURES.USERS',
  ],
  plan_pro_max: [
    'PLAN.ENTERPRISE.FEATURES.CLIENTS',
    'PLAN.ENTERPRISE.FEATURES.CASES',
    'PLAN.ENTERPRISE.FEATURES.STORAGE',
    'PLAN.ENTERPRISE.FEATURES.USERS',
  ],
};

export function ChangePlanDialog({ open, onOpenChange, onSubmit, currentPlanId }: ChangePlanDialogProps) {
  const { t } = useI18n();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchPlans = async () => {
        try {
          setLoading(true);
          const response = await billingService.getPlans();
          setPlans(response.plans);
        } catch (error) {
          console.error('Failed to fetch plans:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPlans();
    }
  }, [open]);

  const handleSelectPlan = (planId: string) => {
    onSubmit?.(planId);
    onOpenChange(false);
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-6xl bg-background/95 backdrop-blur-2xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" strokeWidth={2} />
            </div>
            {t('PLAN.TITLE')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('PLAN.SUBTITLE')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {loading ? (
            <div className="col-span-3 text-center py-8 text-muted-foreground">
              {t('COMMON.LOADING')}
            </div>
          ) : (
            plans.map((plan) => {
              const isProMax = plan.id === 'plan_pro_max';
              const isCurrentPlan = plan.id === currentPlanId;
              const featureKeys = PLAN_FEATURES[plan.id] || [];

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl relative ${
                    isCurrentPlan
                      ? 'p-[2px] bg-gradient-to-b from-purple-500 to-pink-500'
                      : ''
                  }`}
                >
                  <Card
                    className={`p-6 border-2 ${
                      isCurrentPlan
                        ? 'border-transparent'
                        : plan.popular
                        ? 'border-blue-500 bg-blue-500/5'
                        : 'border-border'
                    } ${isProMax ? 'opacity-60 bg-muted/50' : ''} rounded-2xl relative`}
                  >
                    {plan.popular && !isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                        {t('PLAN.POPULAR')}
                      </div>
                    )}
                    <h3 className="text-xl tracking-tight mb-2">{plan.name}</h3>
                    <div className="text-3xl tracking-tight mb-6">
                      {formatPrice(plan.monthlyPrice, plan.currency)}
                    </div>
                    <div className="space-y-3 mb-6">
                      {featureKeys.map((featureKey, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400" strokeWidth={2} />
                          <span className="text-sm text-muted-foreground">{t(featureKey)}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isProMax || isCurrentPlan}
                      className={`w-full h-11 rounded-xl ${
                        plan.popular
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      {isProMax
                        ? t('PLAN.COMING_SOON')
                        : isCurrentPlan
                        ? t('PLAN.ALREADY_SELECTED')
                        : t('PLAN.SELECT_PLAN')}
                    </Button>
                  </Card>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
