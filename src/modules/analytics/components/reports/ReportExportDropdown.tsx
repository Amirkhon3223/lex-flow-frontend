import { Download, FileSpreadsheet, FileText, File } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import type { ExportFormat } from '@/app/types/reports/reports.interfaces';

interface ReportExportDropdownProps {
  onExport: (format: ExportFormat) => void;
  disabled?: boolean;
}

export function ReportExportDropdown({ onExport, disabled }: ReportExportDropdownProps) {
  const { t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
        >
          <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" strokeWidth={2} />
          {t('REPORTS.EXPORT')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onExport('csv')}>
          <FileText className="w-4 h-4 mr-2" />
          {t('REPORTS.EXPORT_FORMATS.CSV')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('excel')}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          {t('REPORTS.EXPORT_FORMATS.EXCEL')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('pdf')}>
          <File className="w-4 h-4 mr-2" />
          {t('REPORTS.EXPORT_FORMATS.PDF')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
