import { DocumentStatusEnum } from '@/app/types/documents/documents.enums';
import { AnalysisStatusEnum } from '@/app/types/ai-assistant/ai-assistant.enums';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'urgent':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const getDocumentStatusColor = (status: DocumentStatusEnum): string => {
  switch (status) {
    case DocumentStatusEnum.FINAL:
      return 'bg-green-100 text-green-700';
    case DocumentStatusEnum.REVIEW:
      return 'bg-blue-100 text-blue-700';
    case DocumentStatusEnum.DRAFT:
      return 'bg-gray-200 text-gray-700';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

export const getAnalysisStatusColor = (status: AnalysisStatusEnum): string => {
  switch (status) {
    case AnalysisStatusEnum.SUCCESS:
      return 'bg-green-100 text-green-700';
    case AnalysisStatusEnum.WARNING:
      return 'bg-amber-100 text-amber-700';
    case AnalysisStatusEnum.ERROR:
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
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
