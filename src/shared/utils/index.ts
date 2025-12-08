export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU');
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('ru-RU');
};

export const formatDateToInput = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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
