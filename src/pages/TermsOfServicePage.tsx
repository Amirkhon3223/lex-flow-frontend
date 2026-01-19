import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { LanguageSelectorPublic } from '@/shared/components/LanguageSelectorPublic.tsx';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button.tsx';

export default function TermsOfServicePage() {
  const { t, language } = useI18n();

  const getTranslations = () => {
    switch (language) {
      case 'en':
        return import('@/assets/i18n/en.json');
      case 'tj':
        return import('@/assets/i18n/tj.json');
      default:
        return import('@/assets/i18n/ru.json');
    }
  };

  const [termsData, setTermsData] = useState<any>(null);

  useEffect(() => {
    getTranslations().then((data) => {
      setTermsData(data.default.TERMS_OF_SERVICE || data.TERMS_OF_SERVICE);
    });
  }, [language]);

  if (!termsData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelectorPublic />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link to={ROUTES.AUTH.LOGIN}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('TERMS_OF_SERVICE.BACK_TO_LOGIN')}
          </Button>
        </Link>

        <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {t('TERMS_OF_SERVICE.TITLE')}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t('TERMS_OF_SERVICE.LAST_UPDATED', { date: '17 января 2026' })}
          </p>

          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">{termsData.SECTION_1_TITLE}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {termsData.SECTION_1_TEXT}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">{termsData.SECTION_2_TITLE}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {termsData.SECTION_2_TEXT}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                {termsData.SECTION_2_ITEMS.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">{termsData.SECTION_3_TITLE}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {termsData.SECTION_3_TEXT}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                {termsData.SECTION_3_ITEMS.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">{termsData.SECTION_4_TITLE}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {termsData.SECTION_4_TEXT}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                {termsData.SECTION_4_ITEMS.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">{termsData.SECTION_5_TITLE}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {termsData.SECTION_5_TEXT}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                {termsData.SECTION_5_ITEMS.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">{termsData.SECTION_6_TITLE}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {termsData.SECTION_6_TEXT}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                {termsData.SECTION_6_ITEMS.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">{termsData.SECTION_7_TITLE}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {termsData.SECTION_7_TEXT}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                {termsData.SECTION_7_ITEMS.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">{termsData.SECTION_8_TITLE}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {termsData.SECTION_8_TEXT}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                {termsData.SECTION_8_ITEMS.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">{termsData.SECTION_9_TITLE}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {termsData.SECTION_9_TEXT}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">{termsData.SECTION_10_TITLE}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {termsData.SECTION_10_TEXT}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">{termsData.SECTION_11_TITLE}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {termsData.SECTION_11_TEXT}
              </p>
              <ul className="space-y-2 text-muted-foreground ml-4">
                <li><strong>{t('CONTACTS_MODAL.EMAIL')}:</strong> <a href="mailto:lexflow.team@gmail.com" className="text-blue-500 hover:underline">lexflow.team@gmail.com</a></li>
                <li><strong>{t('CONTACTS_MODAL.TELEGRAM')}:</strong> <a href="https://t.me/Amirichinvoker" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@Amirichinvoker</a></li>
                <li><strong>{t('CONTACTS_MODAL.PHONE')}:</strong> <a href="tel:+12672283117" className="text-blue-500 hover:underline">+1 267 228 3117</a></li>
              </ul>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {t('AUTH_FOOTER.COPYRIGHT', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </div>
  );
}
