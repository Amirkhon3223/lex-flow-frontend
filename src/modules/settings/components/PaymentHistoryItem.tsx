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
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
      <div>
        <h4 className="tracking-tight mb-1">{payment.invoice}</h4>
        <p className="text-sm text-gray-500">{payment.date}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="tracking-tight">{payment.amount}</p>
          <Badge className="bg-green-100 text-green-700 border-0 text-xs">
            {payment.status}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={handleDownload}>
          <Download className="w-4 h-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
