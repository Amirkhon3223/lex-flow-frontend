import { AnalysisStatusEnum } from '@/app/types/ai-assistant/ai-assistant.enums';
import { DocumentStatusEnum } from '@/app/types/documents/documents.enums';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'urgent':
      return 'bg-status-urgent-bg text-status-urgent-text';
    case 'medium':
      return 'bg-status-medium-bg text-status-medium-text';
    case 'low':
      return 'bg-status-low-bg text-status-low-text';
    case 'completed':
      return 'bg-status-completed-bg text-status-completed-text';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const getDocumentStatusColor = (status: DocumentStatusEnum): string => {
  switch (status) {
    case DocumentStatusEnum.FINAL:
      return 'bg-doc-final-bg text-doc-final-fg border-0';
    case DocumentStatusEnum.REVIEW:
      return 'bg-doc-review-bg text-doc-review-fg border-0';
    case DocumentStatusEnum.DRAFT:
      return 'bg-doc-draft-bg text-doc-draft-fg border-0';
    default:
      return 'bg-doc-draft-bg text-doc-draft-fg border-0';
  }
};

export const getAnalysisStatusColor = (status: AnalysisStatusEnum): string => {
  switch (status) {
    case AnalysisStatusEnum.SUCCESS:
      return 'bg-analysis-success-bg text-analysis-success-text';
    case AnalysisStatusEnum.WARNING:
      return 'bg-analysis-warning-bg text-analysis-warning-text';
    case AnalysisStatusEnum.ERROR:
      return 'bg-analysis-error-bg text-analysis-error-text';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const getMedalGradient = (index: number): string => {
  switch (index) {
    case 0:
      return 'bg-gradient-to-br from-yellow-400 to-orange-500';
    case 1:
      return 'bg-gradient-to-br from-gray-300 to-gray-400';
    case 2:
      return 'bg-gradient-to-br from-orange-400 to-orange-600';
    default:
      return 'bg-gradient-to-br from-blue-500 to-purple-600';
  }
};

export const iconContainerClasses =
  'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center';

export const iconClasses = 'w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5';

export const trendingIconClasses = 'w-2.5 h-2.5 sm:w-3 sm:h-3';
