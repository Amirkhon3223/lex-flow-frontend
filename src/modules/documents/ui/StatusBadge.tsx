import { DocumentStatusEnum } from '@/app/types/documents/documents.enums';
import type { StatusBadgeProps } from '@/app/types/documents/documents.interfaces';
import { Badge } from '@/shared/ui/badge';
import { getDocumentStatusColor } from '@/shared/utils/styleHelpers';

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

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={`${getDocumentStatusColor(status)} border-0`}>
      {getStatusText(status)}
    </Badge>
  );
}
