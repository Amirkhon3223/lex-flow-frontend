import { useState } from 'react';
import { Download, Copy, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

interface BackupCodesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  backupCodes: string[];
}

export function BackupCodesDialog({ open, onOpenChange, backupCodes }: BackupCodesDialogProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const codesText = backupCodes.join('\n');
      await navigator.clipboard.writeText(codesText);
      setCopied(true);
      toast.success(t('COMMON.COPIED'));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(t('COMMON.ERRORS.COPY_FAILED'));
    }
  };

  const handleDownload = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lexflow-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(t('SETTINGS.SECURITY.TWO_FACTOR.CODES_DOWNLOADED'));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
            </div>
            <DialogTitle className="text-xl">
              {t('SETTINGS.SECURITY.TWO_FACTOR.BACKUP_CODES_TITLE')}
            </DialogTitle>
          </div>
          <DialogDescription>
            {t('SETTINGS.SECURITY.TWO_FACTOR.BACKUP_CODES_DESCRIPTION')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 dark:text-amber-200">
                <p className="font-medium mb-1">
                  {t('SETTINGS.SECURITY.TWO_FACTOR.BACKUP_WARNING_TITLE')}
                </p>
                <p className="text-amber-800 dark:text-amber-300">
                  {t('SETTINGS.SECURITY.TWO_FACTOR.BACKUP_WARNING_DESC')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg border">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-background rounded border text-sm font-mono"
                >
                  <span className="text-muted-foreground w-5">{index + 1}.</span>
                  <span className="font-semibold">{code}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="flex-1"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t('COMMON.COPIED')}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  {t('COMMON.COPY')}
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={handleDownload}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('COMMON.DOWNLOAD')}
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            {t('COMMON.CLOSE')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
