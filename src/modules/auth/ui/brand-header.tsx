import { useI18n } from '@/shared/context/I18nContext';

export function BrandHeader() {
  const { t } = useI18n();

  return (
    <div className="text-center mb-6 sm:mb-8">
      <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
        <img src="/ROUNDED_LEXFLOW_BG.png" alt="LexFlow" className="w-32 h-16 sm:w-40 sm:h-20 object-contain" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-accent-foreground mb-1.5 sm:mb-2">
        LexFlow
      </h1>
      <p className="text-sm sm:text-base text-secondary-foreground px-4">
        {t('AUTH.SUBTITLE')}
      </p>
    </div>
  );
}
