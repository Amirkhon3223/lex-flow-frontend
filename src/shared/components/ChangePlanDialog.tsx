import { Check, Zap } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Card } from '@/shared/ui/card';

interface ChangePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (plan: string) => void;
}

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '4 990 ₽',
    features: ['До 50 клиентов', 'До 100 дел', '10 ГБ хранилища', '1 пользователь'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '12 990 ₽',
    features: ['Безлимит клиентов', 'Безлимит дел', '100 ГБ хранилища', 'До 5 пользователей'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'По запросу',
    features: ['Безлимит клиентов', 'Безлимит дел', 'Безлимит хранилища', 'Безлимит пользователей'],
  },
];

export function ChangePlanDialog({ open, onOpenChange, onSubmit }: ChangePlanDialogProps) {
  const handleSelectPlan = (planId: string) => {
    onSubmit?.(planId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-6xl bg-white/95 backdrop-blur-2xl border-gray-200/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-600" strokeWidth={2} />
            </div>
            Выберите план подписки
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Выберите подходящий тарифный план для вашей команды
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 border-2 ${
                plan.popular ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'
              } rounded-2xl relative`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                  Популярный
                </div>
              )}
              <h3 className="text-xl tracking-tight mb-2">{plan.name}</h3>
              <div className="text-3xl tracking-tight mb-6">{plan.price}</div>
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" strokeWidth={2} />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full h-11 rounded-xl ${
                  plan.popular
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Выбрать план
              </Button>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
