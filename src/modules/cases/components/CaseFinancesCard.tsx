import { DollarSign } from 'lucide-react';
import { useAuthStore } from '@/app/store/auth.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { formatCurrency } from '@/shared/utils';

interface CaseFinancesCardProps {
  fee?: number;
  paidAmount?: number;
}

export function CaseFinancesCard({ fee = 0, paidAmount = 0 }: CaseFinancesCardProps) {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const userCurrency = user?.currency || 'USD';

  const remainingAmount = Math.max(0, fee - paidAmount);

  return (
    <Card>
      <div>
        <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">
          {t('CASES.DETAIL.FINANCES')}
        </h3>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-muted-foreground">
                {t('CASES.FIELDS.FEE')}
              </span>
              <span className="text-lg sm:text-xl tracking-tight">{formatCurrency(fee, userCurrency)}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">{t('CLIENTS.FINANCIAL.PAID_AMOUNT')}</span>
              <span className="text-green-600 dark:text-green-400">
                {formatCurrency(paidAmount, userCurrency)}
              </span>
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <DollarSign
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground"
              strokeWidth={2}
            />
            <span className="text-muted-foreground">
              {t('CLIENTS.FINANCIAL.REMAINING_AMOUNT')}:
            </span>
            <span className="text-foreground">{formatCurrency(remainingAmount, userCurrency)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
