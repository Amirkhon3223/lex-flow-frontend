export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU');
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('ru-RU');
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

export {
  getStatusColor,
  getDocumentStatusColor,
  getAnalysisStatusColor,
  getMedalGradient,
  iconContainerClasses,
  iconClasses,
  trendingIconClasses,
} from './styleHelpers';
