/**
 * Get user's timezone from localStorage or fallback to UTC
 */
export function getUserTimezone(): string {
  return localStorage.getItem('userTimezone') || 'UTC';
}

/**
 * Parse date string to local Date object (avoiding UTC conversion)
 * @param dateString - Date string in "YYYY-MM-DD" format or ISO format
 * @returns Date object in local timezone
 */
export function parseLocalDate(dateString: string): Date {
  if (!dateString) return new Date();

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(dateString);
}

/**
 * Format date in user's timezone
 * @param dateString - ISO date string from backend
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDateInUserTimezone(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const userTimezone = getUserTimezone();

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: userTimezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleString('ru-RU', { ...defaultOptions, ...options });
}

/**
 * Format date and time in user's timezone
 * @param dateString - ISO date string from backend
 * @returns Formatted date and time string
 */
export function formatDateTimeInUserTimezone(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const userTimezone = getUserTimezone();

  return date.toLocaleString('ru-RU', {
    timeZone: userTimezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date only (without time) in user's timezone
 * @param dateString - ISO date string from backend
 * @returns Formatted date string
 */
export function formatDateOnly(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const userTimezone = getUserTimezone();

  return date.toLocaleDateString('ru-RU', {
    timeZone: userTimezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date based on user's language preference
 * @param dateString - ISO date string from backend
 * @param language - Language code ('en' | 'ru' | 'tj')
 * @param options - Optional Intl.DateTimeFormatOptions
 * @returns Formatted date string in the specified locale
 */
export function formatDateByLanguage(
  dateString: string,
  language: 'en' | 'ru' | 'tj',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const userTimezone = getUserTimezone();

  // Map language codes to Intl locale strings
  const localeMap: Record<'en' | 'ru' | 'tj', string> = {
    en: 'en-US',
    ru: 'ru-RU',
    tj: 'tg-TJ', // Tajik uses 'tg' ISO code
  };

  const locale = localeMap[language] || 'en-US';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: userTimezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString(locale, { ...defaultOptions, ...options });
}

/**
 * Legacy function - kept for backward compatibility
 * Use formatDateInUserTimezone or formatDateOnly instead
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date to YYYY-MM-DD for input fields
 */
export function formatDateToInput(dateString: string): string {
  if (!dateString) return '';

  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 * Uses user's timezone for calculation
 */
export function formatRelativeTime(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Завтра';
  if (diffDays === -1) return 'Вчера';
  if (diffDays > 1) return `Через ${diffDays} дн.`;
  if (diffDays < -1) return `${Math.abs(diffDays)} дн. назад`;

  return formatDateInUserTimezone(dateString);
}
