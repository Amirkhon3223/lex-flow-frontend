import { useEffect, useState } from 'react';
import { HardDrive, AlertTriangle, AlertCircle } from 'lucide-react';
import { billingService } from '@/app/services/billing/billing.service';
import type { StorageUsageResponse } from '@/app/types/billing/billing.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Separator } from '@/shared/ui/separator';

interface StorageIndicatorProps {
  className?: string;
}

export function StorageIndicator({ className = '' }: StorageIndicatorProps) {
  const { t } = useI18n();
  const [storageData, setStorageData] = useState<StorageUsageResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const data = await billingService.getStorageUsage();
        setStorageData(data);
      } catch {
        // Silently handle - indicator will show loading state
      } finally {
        setLoading(false);
      }
    };

    fetchStorage();
  }, []);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-muted rounded w-24 mb-2"></div>
        <div className="h-2 bg-muted rounded w-full mb-1"></div>
        <div className="h-3 bg-muted rounded w-20"></div>
      </div>
    );
  }

  if (!storageData) {
    return null;
  }

  const { percentage, warningLevel, usedFormatted, limitFormatted } = storageData;

  // Calculate color based on percentage (gradient from green to red)
  const getProgressColor = () => {
    if (percentage <= 50) {
      // Green to yellow (0-50%)
      const ratio = percentage / 50;
      const r = Math.round(34 + (245 - 34) * ratio);
      const g = Math.round(197 + (158 - 197) * ratio);
      const b = Math.round(94 + (11 - 94) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Yellow to red (50-100%)
      const ratio = (percentage - 50) / 50;
      const r = Math.round(245 + (239 - 245) * ratio);
      const g = Math.round(158 - 158 * ratio);
      const b = Math.round(11 + (68 - 11) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const getIcon = () => {
    switch (warningLevel) {
      case 'critical':
        return <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" strokeWidth={2} />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" strokeWidth={2} />;
      default:
        return <HardDrive className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" strokeWidth={2} />;
    }
  };

  const progressColor = getProgressColor();

  return (
    <div className={className}>
      <Separator className="my-3 sm:my-4 bg-border" />

      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          {getIcon()}
          <span className="text-muted-foreground">{t('STORAGE.TITLE')}</span>
        </div>

        {/* Progress bar */}
        <div className="relative w-full">
          <div className="h-2 sm:h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>

          {/* Percentage label on the right */}
          <div className="absolute right-0 -top-0.5 text-[10px] sm:text-xs text-muted-foreground font-medium">
            {percentage}%
          </div>
        </div>

        {/* Usage text */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
          <span>{usedFormatted}</span>
          <span>{limitFormatted}</span>
        </div>

        {/* Warning message */}
        {warningLevel === 'warning' && (
          <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 mt-1">
            {t('STORAGE.WARNING_70')}
          </p>
        )}
        {warningLevel === 'critical' && (
          <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 mt-1">
            {t('STORAGE.WARNING_90')}
          </p>
        )}
      </div>
    </div>
  );
}
