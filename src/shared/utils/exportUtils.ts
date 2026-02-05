/**
 * Export utilities for CSV/Excel downloads
 */

type ExportData = Record<string, unknown>[];

interface ExportColumn {
  key: string;
  header: string;
  formatter?: (value: unknown) => string;
}

/**
 * Format value for CSV (escape quotes, handle special characters)
 */
function formatCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If contains comma, newline, or quote - wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Export data to CSV file
 */
export function exportToCsv(
  data: ExportData,
  columns: ExportColumn[],
  filename: string
): void {
  if (!data.length) {
    console.warn('No data to export');
    return;
  }

  // Build header row
  const headerRow = columns.map(col => formatCsvValue(col.header)).join(',');

  // Build data rows
  const dataRows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key];
      const formattedValue = col.formatter ? col.formatter(value) : value;
      return formatCsvValue(formattedValue);
    }).join(',');
  });

  // Combine with BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  const csvContent = BOM + [headerRow, ...dataRows].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Format date for export
 */
export function formatDateForExport(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ru-RU');
}

/**
 * Format currency for export
 */
export function formatCurrencyForExport(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '';
  return amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
