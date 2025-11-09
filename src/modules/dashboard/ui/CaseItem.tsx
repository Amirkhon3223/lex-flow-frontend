import { User, Clock } from 'lucide-react';
import type { CaseItemProps } from '@/app/types/dashboard/dashboard.interfaces';
import { Badge } from '@/shared/ui/badge';

export function CaseItem({ title, client, deadline, status, onClick }: CaseItemProps) {
  return (
    <div
      onClick={onClick}
      className="group p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="tracking-tight">{title}</h4>
            {status === 'urgent' && (
              <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                Срочно
              </Badge>
            )}
            {status === 'completed' && (
              <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                Завершено
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" strokeWidth={2} />
              {client}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" strokeWidth={2} />
              {deadline}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
