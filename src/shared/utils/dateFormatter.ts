/**
 * Get user's timezone from localStorage or fallback to UTC
 */
export function getUserTimezone(): string {
  return localStorage.getItem('userTimezone') || 'UTC';
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
 * IMPORTANT: This does NOT convert timezone - it returns the date as-is
 * Use this when sending dates to backend
 */
export function formatDateToInput(dateString: string): string {
  if (!dateString) return '';

  // Extract just the date part if it's an ISO string
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
