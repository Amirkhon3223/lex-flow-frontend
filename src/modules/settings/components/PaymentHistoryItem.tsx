import { Download } from 'lucide-react';
import type { PaymentHistoryItemProps } from '@/app/types/settings/settings.interfaces';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

export function PaymentHistoryItem({ payment, onDownload }: PaymentHistoryItemProps) {
  const handleDownload = () => {
    console.log('Скачать чек:', payment.invoice);
    onDownload?.();
  };

  return (
    <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-gray-50">
      <div className="min-w-0">
        <h4 className="tracking-tight mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">{payment.invoice}</h4>
        <p className="text-xs sm:text-sm text-gray-500">{payment.date}</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
        <div className="text-right">
          <p className="tracking-tight text-xs sm:text-sm md:text-base">{payment.amount}</p>
          <Badge className="bg-green-100 text-green-700 border-0 text-xs">{payment.status}</Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg sm:rounded-xl h-7 w-7 sm:h-8 sm:w-8"
          onClick={handleDownload}
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
