import type { FinancialCardProps } from '@/app/types/clients/clients.interfaces';
import { useAuthStore } from '@/app/store/auth.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { formatCurrency } from '@/shared/utils';

export function FinancialCard({ financialData }: FinancialCardProps) {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const userCurrency = user?.currency || 'USD';
  const { totalAmount, paidAmount, remainingAmount, paymentPercentage } = financialData;

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white pb-0!">
      <CardHeader>
        <CardTitle className="text-white text-base sm:text-lg">
          {t('CLIENTS.FINANCIAL.TITLE')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-blue-100 text-xs sm:text-sm">
            {t('CLIENTS.FINANCIAL.TOTAL_AMOUNT')}
          </span>
          <span className="text-lg sm:text-xl font-bold">
            {formatCurrency(totalAmount, userCurrency)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-blue-100 text-xs sm:text-sm">
            {t('CLIENTS.FINANCIAL.PAID_AMOUNT')}
          </span>
          <span className="text-lg sm:text-xl font-bold">
            {formatCurrency(paidAmount, userCurrency)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-blue-100 text-xs sm:text-sm">
            {t('CLIENTS.FINANCIAL.REMAINING_AMOUNT')}
          </span>
          <span className="text-lg sm:text-xl font-bold">
            {formatCurrency(remainingAmount, userCurrency)}
          </span>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold text-blue-100">
              {t('CLIENTS.FINANCIAL.PAYMENT_PERCENTAGE')}
            </span>
            <span className="font-medium">{paymentPercentage}%</span>
          </div>
          <div className="h-1.5 sm:h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-white" style={{ width: `${paymentPercentage}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
