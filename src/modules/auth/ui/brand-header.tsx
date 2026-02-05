import { useI18n } from '@/shared/context/I18nContext';

export function BrandHeader() {
  const { t } = useI18n();

  return (
    <header
      className="text-center mb-6 sm:mb-8"
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
        <img
          src="/ROUNDED_LEXFLOW_BG.png"
          alt="LexFlow - AI-Powered Legal Practice Management Software"
          title="LexFlow Legal Practice Management"
          className="w-32 h-16 sm:w-40 sm:h-20 object-contain"
          itemProp="logo"
          loading="eager"
          width="160"
          height="80"
        />
      </div>
      <h1
        className="text-2xl sm:text-3xl font-semibold text-accent-foreground mb-1.5 sm:mb-2"
        itemProp="name"
      >
        LexFlow
      </h1>
      <p
        className="text-sm sm:text-base text-secondary-foreground px-4"
        itemProp="description"
      >
        {t('AUTH.SUBTITLE')}
      </p>
      <meta itemProp="applicationCategory" content="Legal Practice Management" />
      <meta itemProp="operatingSystem" content="Web Browser" />
    </header>
  );
}
