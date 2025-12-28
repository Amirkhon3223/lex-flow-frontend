/**
 * Валидация форматов файлов для загрузки документов
 * Поддерживаемые форматы 1:1 с backend
 */

export const SUPPORTED_FILE_EXTENSIONS = [
  '.doc',
  '.docx',
  '.docm',
  '.dot',
  '.dotx',
  '.dotm',
  '.rtf',
  '.xls',
  '.xlsx',
  '.xlsm',
  '.xlsb',
  '.xlt',
  '.xltx',
  '.xltm',
  '.csv',
  '.txt',
  '.log',
  '.md',
  '.pdf',
  '.odt',
  '.ods',
] as const;

/**
 * Проверяет, поддерживается ли формат файла
 * @param file - файл для проверки
 * @returns true если формат поддерживается, иначе false
 */
export function isFileFormatSupported(file: File): boolean {
  const fileName = file.name.toLowerCase();
  return SUPPORTED_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

/**
 * Получить расширение файла
 * @param filename - имя файла
 * @returns расширение файла (например ".pdf")
 */
export function getFileExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
}

/**
 * Получить список поддерживаемых форматов в читаемом виде
 * @returns строка с перечислением форматов
 */
export function getSupportedFormatsString(): string {
  return 'PDF, Word (.doc, .docx), Excel (.xls, .xlsx), TXT, RTF, ODT, ODS';
}
