import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Share } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useI18n } from '@/shared/context/I18nContext';
import { usePWA } from '@/shared/hooks/usePWA';
import { cn } from '@/shared/ui/utils';

interface PWAInstallPromptProps {
  /** Delay in ms before showing the prompt (default: 30 seconds) */
  showDelay?: number;
  /** Position of the banner */
  position?: 'top' | 'bottom';
  /** Custom class name */
  className?: string;
}

export function PWAInstallPrompt({
  showDelay = 30000,
  position = 'bottom',
  className,
}: PWAInstallPromptProps) {
  const { t } = useI18n();
  const {
    isInstallable,
    isInstalled,
    isStandalone,
    isInstallPromptDismissed,
    promptInstall,
    dismissInstallPrompt,
  } = usePWA();

  const [showBanner, setShowBanner] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Detect iOS for special instructions
  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  // Show banner after delay
  useEffect(() => {
    // Don't show if already installed, dismissed, or in standalone mode
    if (isInstalled || isStandalone || isInstallPromptDismissed) {
      return;
    }

    // For non-iOS, only show if installable
    if (!isIOS && !isInstallable) {
      return;
    }

    const timer = setTimeout(() => {
      setShowBanner(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, isStandalone, isInstallPromptDismissed, showDelay, isIOS]);

  // Handle install button click
  const handleInstall = async () => {
    if (isIOS) {
      // Can't programmatically install on iOS, just show instructions
      return;
    }

    setIsInstalling(true);
    try {
      const result = await promptInstall();
      if (result === 'accepted') {
        setShowBanner(false);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  // Handle dismiss
  const handleDismiss = () => {
    setShowBanner(false);
    dismissInstallPrompt();
  };

  // Don't render if conditions not met
  if (!showBanner || isInstalled || isStandalone) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-50 mx-4 sm:mx-auto sm:max-w-md',
        'animate-in slide-in-from-bottom-5 fade-in duration-300',
        position === 'top' ? 'top-4' : 'bottom-4',
        className
      )}
    >
      <div className="bg-card border rounded-xl shadow-lg p-4">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted transition-colors"
          aria-label={t('COMMON.CLOSE')}
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              {isIOS ? (
                <Smartphone className="w-6 h-6 text-primary" />
              ) : (
                <Monitor className="w-6 h-6 text-primary" />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-6">
            <h3 className="font-semibold text-foreground text-sm">
              {t('PWA.INSTALL_TITLE')}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {isIOS ? t('PWA.INSTALL_DESC_IOS') : t('PWA.INSTALL_DESC')}
            </p>

            {/* iOS specific instructions */}
            {isIOS ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{t('PWA.TAP')}</span>
                <Share className="w-4 h-4" />
                <span>{t('PWA.THEN')}</span>
                <span className="font-medium text-foreground">
                  "{t('PWA.ADD_TO_HOME')}"
                </span>
              </div>
            ) : (
              <div className="mt-3">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isInstalling ? t('PWA.INSTALLING') : t('PWA.INSTALL_BUTTON')}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Features list */}
        <div className="mt-4 pt-3 border-t flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {t('PWA.FEATURE_OFFLINE')}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {t('PWA.FEATURE_FAST')}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {t('PWA.FEATURE_NATIVE')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
