import { AnalysisStatusEnum } from '@/app/types/ai-assistant/ai-assistant.enums';
import { DocumentStatusEnum } from '@/app/types/documents/documents.enums';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'urgent':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export const getDocumentStatusColor = (status: DocumentStatusEnum): string => {
  switch (status) {
    case DocumentStatusEnum.FINAL:
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case DocumentStatusEnum.REVIEW:
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case DocumentStatusEnum.DRAFT:
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const getAnalysisStatusColor = (status: AnalysisStatusEnum): string => {
  switch (status) {
    case AnalysisStatusEnum.SUCCESS:
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case AnalysisStatusEnum.WARNING:
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case AnalysisStatusEnum.ERROR:
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
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

export const iconContainerClasses = 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center';
export const iconClasses = 'w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5';
export const trendingIconClasses = 'w-2.5 h-2.5 sm:w-3 sm:h-3';
