/**
 * Форматирует текст описания по правилам:
 * - Множественные пробелы заменяются на один пробел
 * - Более 2 переносов строк подряд заменяются на максимум 2 переноса (1 пустая строка)
 */
export function formatDescription(text: string): string {
  if (!text) return '';

  let formatted = text.replace(/ +/g, ' ');

  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  return formatted;
}
