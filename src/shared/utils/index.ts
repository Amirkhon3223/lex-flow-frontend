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

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

/**
 * Currency symbols mapping
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  RUB: '₽',
  EUR: '€',
  TJS: 'сом.',
  UZS: 'сўм',
  KZT: '₸',
  CAD: 'C$',
};

/**
 * Currency locales mapping for Intl.NumberFormat
 */
const CURRENCY_LOCALES: Record<string, string> = {
  USD: 'en-US',
  RUB: 'ru-RU',
  EUR: 'de-DE',
  TJS: 'tg-TJ',
  UZS: 'uz-UZ',
  KZT: 'kk-KZ',
  CAD: 'en-CA',
};

/**
 * Format amount with currency symbol
 * @param amount - Amount to format
 * @param currency - Currency code (USD, RUB, EUR, TJS)
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  options: { locale?: string; minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
): string => {
  const locale = options.locale || CURRENCY_LOCALES[currency] || 'en-US';
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(amount);

  // For USD, EUR, and CAD, put symbol before amount
  if (currency === 'USD' || currency === 'EUR' || currency === 'CAD') {
    return `${symbol}${formatted}`;
  }

  // For RUB, TJS, UZS, and KZT, put symbol after amount with space
  return `${formatted} ${symbol}`;
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

export {
  parseLocalDate,
  getUserTimezone,
  formatDateInUserTimezone,
  formatDateTimeInUserTimezone,
  formatDateOnly,
  formatRelativeTime,
} from './dateFormatter';

export {
  validators,
  parseApiErrors,
  getFieldError,
  hasErrors,
  clearFieldError,
  validateFields,
  type FieldError,
  type FormErrors,
} from './formValidation';
