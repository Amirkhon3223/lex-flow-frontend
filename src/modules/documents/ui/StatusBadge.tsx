import { DocumentStatusEnum } from '@/app/types/documents/documents.enums';
import type { StatusBadgeProps } from '@/app/types/documents/documents.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { getDocumentStatusColor } from '@/shared/utils/styleHelpers';

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useI18n();

  const getStatusText = (status: DocumentStatusEnum) => {
    switch (status) {
      case DocumentStatusEnum.FINAL:
        return t('DOCUMENTS.STATUS.FINAL');
      case DocumentStatusEnum.REVIEW:
        return t('DOCUMENTS.STATUS.REVIEW');
      case DocumentStatusEnum.DRAFT:
        return t('DOCUMENTS.STATUS.DRAFT');
      default:
        return status;
    }
  };

  return (
    <Badge className={`${getDocumentStatusColor(status)} border-0`}>
      {getStatusText(status)}
    </Badge>
  );
}
