import { DocumentStatusEnum } from '@/app/types/documents/documents.enums';
import type { StatusBadgeProps } from '@/app/types/documents/documents.interfaces';
import { Badge } from '@/shared/ui/badge';

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: DocumentStatusEnum) => {
    switch (status) {
      case DocumentStatusEnum.FINAL:
        return 'bg-green-100 text-green-700 border-0';
      case DocumentStatusEnum.REVIEW:
        return 'bg-blue-100 text-blue-700 border-0';
      case DocumentStatusEnum.DRAFT:
        return 'bg-gray-200 text-gray-700 border-0';
      default:
        return 'bg-gray-100 text-gray-600 border-0';
    }
  };

  const getStatusText = (status: DocumentStatusEnum) => {
    switch (status) {
      case DocumentStatusEnum.FINAL:
        return 'Финал';
      case DocumentStatusEnum.REVIEW:
        return 'Проверка';
      case DocumentStatusEnum.DRAFT:
        return 'Черновик';
      default:
        return status;
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {getStatusText(status)}
    </Badge>
  );
}
