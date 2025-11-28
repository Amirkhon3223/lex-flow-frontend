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

interface ChangePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (plan: string) => void;
}

const PLAN_KEYS = [
  {
    id: 'basic',
    nameKey: 'PLAN.BASIC.NAME',
    priceKey: 'PLAN.BASIC.PRICE',
    featureKeys: ['PLAN.BASIC.FEATURES.CLIENTS', 'PLAN.BASIC.FEATURES.CASES', 'PLAN.BASIC.FEATURES.STORAGE', 'PLAN.BASIC.FEATURES.USERS'],
  },
  {
    id: 'pro',
    nameKey: 'PLAN.PRO.NAME',
    priceKey: 'PLAN.PRO.PRICE',
    featureKeys: ['PLAN.PRO.FEATURES.CLIENTS', 'PLAN.PRO.FEATURES.CASES', 'PLAN.PRO.FEATURES.STORAGE', 'PLAN.PRO.FEATURES.USERS'],
    popular: true,
  },
  {
    id: 'enterprise',
    nameKey: 'PLAN.ENTERPRISE.NAME',
    priceKey: 'PLAN.ENTERPRISE.PRICE',
    featureKeys: ['PLAN.ENTERPRISE.FEATURES.CLIENTS', 'PLAN.ENTERPRISE.FEATURES.CASES', 'PLAN.ENTERPRISE.FEATURES.STORAGE', 'PLAN.ENTERPRISE.FEATURES.USERS'],
  },
];

export function ChangePlanDialog({ open, onOpenChange, onSubmit }: ChangePlanDialogProps) {
  const { t } = useI18n();
  const handleSelectPlan = (planId: string) => {
    onSubmit?.(planId);
    onOpenChange(false);
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
          {PLAN_KEYS.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 border-2 ${plan.popular ? 'border-blue-500 bg-blue-500/5' : 'border-border'
                } rounded-2xl relative`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                  {t('PLAN.POPULAR')}
                </div>
              )}
              <h3 className="text-xl tracking-tight mb-2">{t(plan.nameKey)}</h3>
              <div className="text-3xl tracking-tight mb-6">{t(plan.priceKey)}</div>
              <div className="space-y-3 mb-6">
                {plan.featureKeys.map((featureKey, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" strokeWidth={2} />
                    <span className="text-sm text-muted-foreground">{t(featureKey)}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full h-11 rounded-xl ${plan.popular
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
              >
                {t('PLAN.SELECT_PLAN')}
              </Button>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
